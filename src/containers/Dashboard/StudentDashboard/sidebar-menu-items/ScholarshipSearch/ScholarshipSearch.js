import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import ScholarshipView from "./ScholarshipView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";
import { Typography } from "@mui/material";
import logoNav from '../../../../Home/images/logonav.png';  // Updated path to match other components

const ScholarshipSearch = ({ isCollapsed }) => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load saved scholarships
  const loadSavedScholarships = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-saved-scholarships", {
        auth: { username: auth.token },
      });

      if (response.data.success && Array.isArray(response.data.scholarships)) {
        const savedIds = response.data.scholarships.map(
          (s) => s.employer_scholarshippost_id
        );
        setSavedScholarshipIds(savedIds);
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
    }
  };

  // Load applied scholarships
  const loadAppliedScholarships = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-applied-scholarships", {
        auth: { username: auth.token },
      });

      if (
        response.data.success &&
        Array.isArray(response.data.applications)
      ) {
        const appliedIds = response.data.applications.map(
          (a) => a.employer_scholarshippost_id
        );
        setAppliedScholarshipIds(appliedIds);
      }
    } catch (error) {
      console.error("Error fetching applied scholarships:", error);
    }
  };

  // Fetch all scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/all-scholarship-postings", {
          auth: { username: auth.token },
        });

        if (
          response.data &&
          Array.isArray(response.data.scholarship_postings)
        ) {
          const scholarshipList = response.data.scholarship_postings;
          setScholarships(scholarshipList);

          if (scholarshipList.length > 0 && !selectedScholarship) {
            setSelectedScholarship(scholarshipList[0]);
          }

          await Promise.all([
            loadSavedScholarships(),
            loadAppliedScholarships(),
          ]);
        } else {
          setScholarships([]);
          toast.error("No scholarships found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to load scholarships");
        setScholarships([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.token) {
      fetchScholarships();
    }
  }, [auth.token]);

  // Filter and sort scholarships
  useEffect(() => {
    let updatedScholarships = [...scholarships];

    // Text search filter
    if (query) {
      updatedScholarships = updatedScholarships.filter(
        (s) =>
          s.scholarship_title.toLowerCase().includes(query.toLowerCase()) ||
          s.scholarship_description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Experience level filter
    if (entryLevel) {
      updatedScholarships = updatedScholarships.filter(
        (s) => s.experience_level === entryLevel
      );
    }

    // Scholarship type filter
    if (scholarshipType) {
      updatedScholarships = updatedScholarships.filter(
        (s) => s.scholarship_type === scholarshipType
      );
    }

    // Sort options
    if (sortBy === "Most Recent") {
      updatedScholarships.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Amount") {
      updatedScholarships.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    }

    setFilteredScholarships(updatedScholarships);

    // If selected scholarship is not in filtered list, update selection
    if (
      selectedScholarship &&
      !updatedScholarships.some(
        (s) => s.scholarship_id === selectedScholarship.scholarship_id
      )
    ) {
      if (updatedScholarships.length > 0) {
        setSelectedScholarship(updatedScholarships[0]);
      } else {
        setSelectedScholarship(null);
      }
    }
  }, [query, entryLevel, scholarshipType, sortBy, scholarships, selectedScholarship]);

  const handleScholarshipClick = (scholarshipId) => {
    const scholarship = scholarships.find(
      (s) => s.scholarship_id === scholarshipId
    );
    setSelectedScholarship(scholarship);
  };

  const handleSaveScholarship = async (scholarshipId) => {
    try {
      const response = await axios.post(
        "/api/save-scholarship",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setSavedScholarshipIds((prev) =>
        prev.includes(scholarshipId)
          ? prev.filter((id) => id !== scholarshipId)
          : [...prev, scholarshipId]
      );

      toast.success(
        savedScholarshipIds.includes(scholarshipId)
          ? "Scholarship removed from saved"
          : "Scholarship saved successfully"
      );
    } catch (error) {
      toast.error("Failed to save/unsave scholarship");
    }
  };

  const handleApplyScholarship = async (scholarshipId) => {
    try {
      const checkResponse = await axios.post(
        "/api/check-scholarship-status",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (checkResponse.data.is_applied) {
        toast.info("You have already applied for this scholarship");
        return;
      }

      const applyResponse = await axios.post(
        "/api/apply-scholarships",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (applyResponse.data.application_id) {
        setAppliedScholarshipIds([...appliedScholarshipIds, scholarshipId]);
        toast.success("Application submitted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Hero Section - Updated gradient colors */}
      <section className="w-full bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400 dark:from-teal-900 dark:to-teal-700 px-8 py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h3" className="text-white font-bold mb-3">
          Explore Scholarships
        </Typography>
        <Typography variant="h6" className="text-teal-100 mb-8">
          Find and apply for scholarships that match your profile
        </Typography>

        {/* Search & Filter Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search scholarships..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <select
              value={entryLevel}
              onChange={(e) => setEntryLevel(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="">Experience Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row p-8 pt-14">
        {/* Scholarship Details (top on mobile, right on desktop) */}
        {selectedScholarship && (
          <div className="w-full lg:w-2/5 mb-8 lg:mb-0 lg:order-2">
            <ScholarshipView
              scholarship={selectedScholarship}
              isSaved={savedScholarshipIds.includes(selectedScholarship.scholarship_id)}
              isApplied={appliedScholarshipIds.includes(selectedScholarship.scholarship_id)}
              onSave={() => handleSaveScholarship(selectedScholarship.scholarship_id)}
              onApply={() => handleApplyScholarship(selectedScholarship.scholarship_id)}
            />
          </div>
        )}
        {/* Scholarships List */}
        <div className={`${selectedScholarship ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <div className="flex justify-between items-center mb-6">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400">
              {filteredScholarships.length} scholarships found
            </Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Amount">Amount</option>
            </select>
          </div>

          <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-4">
                <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Loading Scholarships...
                </Typography>
              </div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.scholarship_id}
                  onClick={() => handleScholarshipClick(scholarship.scholarship_id)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border ${
                    selectedScholarship?.scholarship_id === scholarship.scholarship_id
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex gap-3">
                    {/* Logo */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={scholarship.logo || "http://bij.ly/4ib59B1"}
                        alt={scholarship.scholarship_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {scholarship.scholarship_title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Posted by: {scholarship.employer.full_name || "N/A"}
                      </div>
                    </div>
                    {/* Applied Status */}
                    {appliedScholarshipIds.includes(scholarship.scholarship_id) && (
                      <div className="flex items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Applied
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSearch;