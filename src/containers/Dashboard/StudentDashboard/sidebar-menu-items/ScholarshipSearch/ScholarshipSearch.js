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
import logoNav from '../../../../Home/images/logonav.png';// Updated path to match other components
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
      <ToastContainer />      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Scholarships</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find and apply for scholarship opportunities</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredScholarships.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Available Scholarships</span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}
      <div className="w-full bg-[#1a237e] dark:bg-[#0d1544] shadow-lg sm:shadow-xl py-4 px-2 sm:px-4">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex flex-row items-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
            <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search scholarships, providers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
          
          <select
            value={scholarshipType}
            onChange={(e) => setScholarshipType(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Type: All</option>
            <option value="Merit">Merit</option>
            <option value="Need-based">Need-based</option>
            <option value="Athletic">Athletic</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Sort by</option>
            <option value="Most Recent">Recent</option>
            <option value="Amount">Amount</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 md:py-4 w-full max-w-[1800px] mx-auto">
        {/* Scholarship Details (top on mobile, right on desktop) */}
        {selectedScholarship && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <ScholarshipView
              scholarship={selectedScholarship}
              isSaved={savedScholarshipIds.includes(selectedScholarship.employer_scholarshippost_id)}
              isApplied={appliedScholarshipIds.includes(selectedScholarship.employer_scholarshippost_id)}
              onSave={() => handleSaveScholarship(selectedScholarship.employer_scholarshippost_id)}
              onApply={() => handleApplyScholarship(selectedScholarship.employer_scholarshippost_id)}
            />
          </div>
        )}

        {/* Scholarship List */}
        <div className={`${selectedScholarship ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Scholarships...
                </Typography>
              </div>
            ) : filteredScholarships.length === 0 ? (
              <div className="flex justify-center items-center h-32 sm:h-40">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No scholarships found
                </p>
              </div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.employer_scholarshippost_id}
                  onClick={() => handleScholarshipClick(scholarship.employer_scholarshippost_id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedScholarship?.employer_scholarshippost_id === scholarship.employer_scholarshippost_id
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={scholarship.companyImage || "http://bij.ly/4ib59B1"}
                        alt={scholarship.scholarship_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {scholarship.scholarship_title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            {scholarship.company_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                          {scholarship.scholarship_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          {scholarship.reward_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {scholarship.city_municipality}, {scholarship.country}
                        </span>
                      </div>

                      {savedScholarshipIds.includes(scholarship.employer_scholarshippost_id) && (
                        <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">                          <Bookmark className="w-3 h-3 mr-1" />
                          Saved
                        </span>
                      )}
                      
                      {appliedScholarshipIds.includes(scholarship.employer_scholarshippost_id) && (
                        <span className="inline-flex items-center mt-2 ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Applied
                        </span>
                      )}
                    </div>
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