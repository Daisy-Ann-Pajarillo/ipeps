import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import ScholarshipView from "./ScholarshipView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";
import { Typography } from "@mui/material";
import logoNav from '../../../../Home/images/logonav.png';// Updated path to match other components
import pesoLogo from '../../../../Home/images/pesoLogo.png';
import SearchIcon from '@mui/icons-material/Search';

const ScholarshipSearch = () => {
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

        if (response.data && Array.isArray(response.data.scholarship_postings)) {
          const scholarshipList = response.data.scholarship_postings;
          setScholarships(scholarshipList);
          setFilteredScholarships(scholarshipList);
          
          // Only auto-select first scholarship on desktop
          const isDesktop = window.innerWidth >= 1024;
          if (scholarshipList.length > 0 && !selectedScholarship && isDesktop) {
            setSelectedScholarship(scholarshipList[0]);
          }

          await Promise.all([
            loadSavedScholarships(),
            loadAppliedScholarships(),
          ]);
        } else {
          setScholarships([]);
          setFilteredScholarships([]); // Add this line
          toast.error("No scholarships found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to load scholarships");
        setScholarships([]);
        setFilteredScholarships([]); // Add this line
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

    if (query) {
      updatedScholarships = updatedScholarships.filter(
        (s) =>
          s.scholarship_title.toLowerCase().includes(query.toLowerCase()) ||
          s.scholarship_description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (scholarshipType) {
      updatedScholarships = updatedScholarships.filter(
        (s) => s.scholarship_type === scholarshipType
      );
    }

    if (sortBy === "Most Recent") {
      updatedScholarships.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Amount") {
      updatedScholarships.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    }

    setFilteredScholarships(updatedScholarships);
  }, [query, scholarshipType, sortBy, scholarships]); // Remove selectedScholarship from dependencies

  const handleScholarshipClick = (scholarshipId) => {
    console.log("Clicked scholarship ID:", scholarshipId);
    const selected = scholarships.find(
      (s) => s.scholarship_id === scholarshipId
    );
    console.log("Found scholarship:", selected);
    if (selected) {
      setSelectedScholarship(selected);
    }
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

      {/* Unified Filter/Search Row - Matching TrainingApplications */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e]">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search scholarships..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
      </div>

      {/* Main Content Layout - Matching TrainingApplications */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden">
        {/* Scholarships List Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col gap-3 h-[calc(100vh-180px)] overflow-y-auto lg:pr-4">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32 loading-logo"
                />
                <div className="text-center">
                  <Typography variant="h6" className="text-gray-800 dark:text-gray-200 mb-2">
                    Loading Scholarships
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                    Please wait while we fetch scholarships...
                  </Typography>
                </div>
              </div>
            ) : filteredScholarships.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  No scholarships found.
                </Typography>
              </div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.scholarship_id}
                  onClick={() => handleScholarshipClick(scholarship.scholarship_id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedScholarship?.scholarship_id === scholarship.scholarship_id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex gap-2 sm:gap-3 min-w-0">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={scholarship.companyImage || "http://bij.ly/4ib59B1"}
                        alt={scholarship.provider || scholarship.scholarship_title}
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {scholarship.scholarship_title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {scholarship.company_name || scholarship.employer?.company_name || 'Unknown Company'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        Vacancies: {scholarship.slots || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        Expires: {scholarship.expiration_date ? new Date(scholarship.expiration_date).toLocaleDateString() : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop View */}
        {selectedScholarship && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 sticky top-4" 
               style={{ zIndex: 1000 }}>
            <ScholarshipView 
              scholarship={selectedScholarship} 
              isSaved={savedScholarshipIds.includes(selectedScholarship.scholarship_id)}
              isApplied={appliedScholarshipIds.includes(selectedScholarship.scholarship_id)}
              onSave={() => handleSaveScholarship(selectedScholarship.scholarship_id)}
              onApply={() => handleApplyScholarship(selectedScholarship.scholarship_id)}
              isMobile={false}
            />
          </div>
        )}

        {/* Mobile View */}
        {selectedScholarship && (
          <div 
            className="lg:hidden fixed inset-0"
            style={{ zIndex: Number.MAX_SAFE_INTEGER }}
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              style={{ 
                position: 'fixed',
                zIndex: Number.MAX_SAFE_INTEGER,
                pointerEvents: 'auto'
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" onClick={() => setSelectedScholarship(null)} />
                <div className="absolute inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0">
                  <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                    <div className="absolute right-4 top-4 z-10">
                      <button
                        onClick={() => setSelectedScholarship(null)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <ScholarshipView 
                      scholarship={selectedScholarship} 
                      isSaved={savedScholarshipIds.includes(selectedScholarship.scholarship_id)}
                      isApplied={appliedScholarshipIds.includes(selectedScholarship.scholarship_id)}
                      onSave={() => handleSaveScholarship(selectedScholarship.scholarship_id)}
                      onApply={() => handleApplyScholarship(selectedScholarship.scholarship_id)}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipSearch;