import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import logoNav from "../../../../Home/images/logonav.png";
import { Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SavedScholarshipView from "./SavedScholarshipView";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const SavedScholarships = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const loadSavedScholarships = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get-saved-scholarships", {
        auth: { username: auth.token },
      });

      if (response.data.success && Array.isArray(response.data.scholarships)) {
        setSavedScholarships(response.data.scholarships);
        if (response.data.scholarships.length > 0) {
          setSelectedScholarship(response.data.scholarships[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
      toast.error("Failed to load saved scholarships");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadSavedScholarships();
    }
  }, [auth.token]);

  const handleApply = async (scholarshipId) => {
    try {
      setIsLoading(true);
      await axios.post(
        "/api/apply-scholarship",
        { scholarship_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setAppliedScholarshipIds((prev) => ({
        ...prev,
        [scholarshipId]: true,
      }));

      toast.success("Successfully applied to scholarship");
    } catch (error) {
      console.error("Error applying to scholarship:", error);
      toast.error(
        error.response?.data?.message || "Failed to apply to scholarship"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromSaved = async (scholarshipId) => {
    try {
      setIsLoading(true);
      await axios.post(
        "/api/remove-saved-scholarship",
        { scholarship_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setSavedScholarships((prev) =>
        prev.filter((s) => s.scholarship_id !== scholarshipId)
      );
      if (selectedScholarship?.scholarship_id === scholarshipId) {
        setSelectedScholarship(null);
      }
      toast.success("Scholarship removed from saved list");
    } catch (error) {
      console.error("Error removing scholarship:", error);
      toast.error("Failed to remove scholarship");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter scholarships
  const filteredScholarships = savedScholarships.filter((scholarship) =>
    scholarship.scholarship_title?.toLowerCase().includes(query.toLowerCase()) ||
    scholarship.scholarship_description?.toLowerCase().includes(query.toLowerCase()) ||
    scholarship.company_name?.toLowerCase().includes(query.toLowerCase())
  );

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900">
            <BookmarkIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">
              Saved Scholarships
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your bookmarked scholarships
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {sortedScholarships.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Saved Items
          </span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e]">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search saved scholarships..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="Most Recent">Recent</option>
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
          {/* Scholarship List Section */}
          <div className="flex-1 flex flex-col min-w-0">
            <div
              className="flex flex-col gap-3 overflow-y-auto lg:pr-4"
              style={{
                maxHeight: "calc(100vh - 180px)",
                paddingBottom: selectedScholarship ? "10px" : "0",
              }}
            >
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-40 gap-2">
                  <img
                    src={logoNav}
                    alt="IPEPS Logo"
                    className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                  />
                  <Typography
                    variant="body1"
                    className="text-gray-600 dark:text-gray-400 animate-pulse text-base"
                  >
                    Loading Scholarships...
                  </Typography>
                </div>
              ) : sortedScholarships.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                  <Typography
                    variant="body1"
                    className="text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                  >
                    No saved scholarships found
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/dashboard/scholarship-search")}
                    className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-base"
                  >
                    Browse Scholarships
                  </Button>
                </div>
              ) : (
                sortedScholarships.map((scholarship) => (
                  <div
                    key={scholarship.scholarship_id}
                    onClick={() => setSelectedScholarship(scholarship)}
                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                      selectedScholarship?.scholarship_id === scholarship.scholarship_id
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={scholarship.companyImage || scholarship.provider_logo || "http://bij.ly/4ib59B1"}
                          alt={scholarship.scholarship_title || scholarship.title}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {scholarship.scholarship_title || scholarship.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {scholarship.company_name || scholarship.provider}
                        </div>
                        
                        {/* Scholarship Details Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {(scholarship.reward_type || scholarship.amount) && (
                            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-purple-700 dark:text-purple-300 text-xs">
                              <PaymentIcon fontSize="small" className="w-4 h-4" />
                              {scholarship.reward_type || scholarship.amount}
                            </span>
                          )}
                          {scholarship.scholarship_type && (
                            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-purple-700 dark:text-purple-300 text-xs">
                              <SchoolIcon fontSize="small" className="w-4 h-4" />
                              {scholarship.scholarship_type}
                            </span>
                          )}
                          {scholarship.deadline && (
                            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-purple-700 dark:text-purple-300 text-xs">
                              <CalendarTodayIcon fontSize="small" className="w-4 h-4" />
                              Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 self-start text-base sm:text-lg p-1 hover:bg-red-50 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSaved(scholarship.scholarship_id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Details - Desktop View */}
          {selectedScholarship && (
            <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8">
              <SavedScholarshipView
                scholarship={selectedScholarship}
                onApply={() => handleApply(selectedScholarship.scholarship_id)}
                onRemoveSaved={() =>
                  handleRemoveFromSaved(selectedScholarship.scholarship_id)
                }
                isApplied={appliedScholarshipIds[selectedScholarship.scholarship_id]}
                isMobile={false}
              />
            </div>
          )}

          {/* Details - Mobile Modal View */}
          {selectedScholarship && (
            <div className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 overflow-hidden">
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
                    <SavedScholarshipView
                      scholarship={selectedScholarship}
                      onApply={() => handleApply(selectedScholarship.scholarship_id)}
                      onRemoveSaved={() => {
                        handleRemoveFromSaved(selectedScholarship.scholarship_id);
                        setSelectedScholarship(null);
                      }}
                      isApplied={appliedScholarshipIds[selectedScholarship.scholarship_id]}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedScholarships;