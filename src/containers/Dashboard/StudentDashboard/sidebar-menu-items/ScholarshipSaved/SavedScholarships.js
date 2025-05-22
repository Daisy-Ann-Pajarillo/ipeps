import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography, // Changed from custom Typography component to MUI Typography
  Button,
  useTheme,
} from "@mui/material";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedScholarshipsView from "./SavedScholarshipView"; // Fix typo in import name
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoNav from '../../../../Home/images/logonav.png'; // Fix logo path

const SavedScholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Load applied scholarships
  const loadAppliedScholarships = async () => {
    try {
      if (auth.token) {
        const response = await axios.get("/api/get-applied-scholarships", {
          auth: { username: auth.token },
        });

        if (
          response.data.success &&
          Array.isArray(response.data.applications)
        ) {
          const appliedMap = {};
          response.data.applications.forEach((app) => {
            appliedMap[app.employer_scholarshippost_id] = true;
          });
          setAppliedScholarshipIds(appliedMap);
        }
      }
    } catch (error) {
      console.error("Error fetching applied scholarships:", error);
    }
  };

  // Load saved scholarships
  const loadSavedScholarships = async () => {
    try {
      setIsLoading(true);
      if (auth.token) {
        const response = await axios.get("/api/get-saved-scholarships", {
          auth: { username: auth.token },
        });

        if (
          response.data.success &&
          Array.isArray(response.data.scholarships)
        ) {
          const scholarships = response.data.scholarships.map((item) => ({
            saved_scholarship_id: item.saved_scholarship_id,
            employer_scholarshippost_id: item.scholarship_posting_id,
            scholarship_title: item.scholarship_title,
            scholarship_description: item.scholarship_description,
            scholarship_type: item.scholarship_type,
            amount: item.amount,
            deadline: item.deadline,
            country: item.country,
            city_municipality: item.city_municipality,
            created_at: item.created_at,
            logo: item.logo_url || "http://bij.ly/4ib59B1",
            employer: {
              full_name: item.employer?.full_name || "Unknown Provider",
            },
          }));

          setSavedScholarships(scholarships);

          if (scholarships.length > 0 && !selectedScholarship) {
            setSelectedScholarship(scholarships[0]);
          }
        } else {
          setSavedScholarships([]);
          setSelectedScholarship(null);
        }
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
      toast.error(
        error.response?.data?.error || "Failed to load saved scholarships"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadSavedScholarships();
      loadAppliedScholarships();
    }
  }, [auth.token]);

  // Filter scholarships
  const filteredScholarships = savedScholarships.filter((s) =>
    s.scholarship_title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "Amount") {
      return (b.amount || 0) - (a.amount || 0);
    } else if (sortBy === "Deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });

  // Handle Apply
  const handleApplyScholarship = async (scholarshipId) => {
    try {
      const checkResponse = await axios.post(
        "/api/check-scholarship-status",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (checkResponse.data.is_applied) {
        toast.info("You have already applied for this scholarship");
        setAppliedScholarshipIds((prev) => ({
          ...prev,
          [scholarshipId]: true,
        }));
        return;
      }

      await axios.post(
        "/api/apply-scholarships",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setAppliedScholarshipIds((prev) => ({
        ...prev,
        [scholarshipId]: true,
      }));
      toast.success("Successfully applied to scholarship");

    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to apply for scholarship"
      );
    }
  };

  // Remove from saved
  const handleRemoveFromSaved = async (scholarshipId) => {
    try {
      await axios.post(
        "/api/save-scholarship",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      const updatedList = savedScholarships.filter(
        (s) => s.employer_scholarshippost_id !== scholarshipId
      );
      setSavedScholarships(updatedList);

      if (
        selectedScholarship?.employer_scholarshippost_id === scholarshipId
      ) {
        setSelectedScholarship(updatedList[0] || null);
      }

      toast.success("Scholarship removed from saved");

    } catch (error) {
      toast.error("Failed to remove scholarship");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <img src={logoNav} alt="Iloilo Province Logo" className="h-12 w-12 rounded-full border border-gray-300 dark:border-gray-700 bg-white" />
          <span className="font-bold text-blue-800 dark:text-blue-200 text-base sm:text-lg tracking-tight whitespace-nowrap">PESO | Saved Scholarships</span>
        </div>
      </header>

      {/* Unified Search Bar - Matching JobView.js */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 px-2">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search saved scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="Most Recent">Recent</option>
          <option value="Amount">Amount</option>
          <option value="Deadline">Deadline</option>
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 md:py-4 w-full max-w-[1800px] mx-auto">
        {/* Details Panel (top on mobile, right on desktop) */}
        {selectedScholarship && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <SavedScholarshipsView
              scholarship={selectedScholarship}
              isApplied={appliedScholarshipIds[selectedScholarship.employer_scholarshippost_id]}
              onApply={() => handleApplyScholarship(selectedScholarship.employer_scholarshippost_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedScholarship.employer_scholarshippost_id)}
            />
          </div>
        )}
        {/* Scholarship List */}
        <div className={`${selectedScholarship ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            {savedScholarships.length} saved scholarships
          </Typography>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img src={logoNav} alt="IPEPS Logo" className="w-16 h-16 sm:w-24 sm:h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Saved Scholarships...
                </Typography>
              </div>
            ) : sortedScholarships.length === 0 ? (
              <div className="flex justify-center items-center h-32 sm:h-40">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No saved scholarships found
                </p>
              </div>
            ) : (
              sortedScholarships.map((scholarship) => (
                <div
                  key={scholarship.saved_scholarship_id}
                  onClick={() => setSelectedScholarship(scholarship)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedScholarship?.saved_scholarship_id === scholarship.saved_scholarship_id
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
                        {`Posted By: ${scholarship.employer?.full_name || "N/A"}`}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {scholarship.scholarship_type}
                      </div>
                      {scholarship.deadline && (
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-red-700 self-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(
                          scholarship.employer_scholarshippost_id
                        );
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
      </div>
    </div>
  );
};

export default SavedScholarships;