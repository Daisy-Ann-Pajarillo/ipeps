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
import pesoLogo from '../../../../Home/images/pesoLogo.png';

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
    <div className="min-h-screen w-full">
      <ToastContainer />
      
      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <img src={pesoLogo} alt="Iloilo Province Logo" className="h-12 w-12 rounded-full border border-gray-300 dark:border-gray-700 bg-white" />
          <span className="font-bold text-blue-800 dark:text-blue-200 text-base sm:text-lg tracking-tight whitespace-nowrap">PESO | Scholarships</span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 px-2">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search scholarships, providers, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
          />
        </div>
        <select
          value={entryLevel}
          onChange={(e) => setEntryLevel(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Level</option>
          <option value="Undergraduate">Undergrad</option>
          <option value="Graduate">Graduate</option>
          <option value="PhD">PhD</option>
        </select>
        <select
          value={scholarshipType}
          onChange={(e) => setScholarshipType(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Type</option>
          <option value="Merit">Merit</option>
          <option value="Need-based">Need-based</option>
          <option value="Athletic">Athletic</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort</option>
          <option value="Most Recent">Recent</option>
          <option value="Amount">Amount</option>
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 md:py-4 w-full max-w-[1800px] mx-auto">
        {/* Scholarship Details (top on mobile, right on desktop) */}
        {selectedScholarship && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {filteredScholarships.length} scholarships found
            </Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Amount">Amount</option>
            </select>
          </div>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img src={logoNav} alt="IPEPS Logo" className="w-16 h-16 sm:w-24 sm:h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Scholarships...
                </Typography>
              </div>
            ) : filteredScholarships.length === 0 ? (
              <div className="flex justify-center items-center h-32 sm:h-40">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No scholarships found matching your criteria
                </p>
              </div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.scholarship_id}
                  onClick={() => handleScholarshipClick(scholarship.scholarship_id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedScholarship?.scholarship_id === scholarship.scholarship_id
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    {/* Logo */}
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={scholarship.logo || "http://bij.ly/4ib59B1"}
                        alt={scholarship.scholarship_title}
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {scholarship.scholarship_title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Posted by: {scholarship.employer?.full_name || "N/A"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {scholarship.scholarship_type} • {scholarship.experience_level}
                      </div>
                      {scholarship.deadline && (
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                        </div>
                      )}
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