import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { BookmarkBorder } from "@mui/icons-material";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedScholarshipsView from "./SavedScholarshipView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoNav from '../../../../Home/images/logonav.png';

const SavedScholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

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
            company_name: item.employer?.full_name || "Unknown Provider",
            reward_type: item.reward_type,
            requirements: item.requirements,
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
    s.scholarship_title?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleScholarshipStatusChange = async (scholarshipId, status) => {
    // Update applied status locally
    if (status === 'applied') {
      setAppliedScholarshipIds(prev => ({
        ...prev,
        [scholarshipId]: true
      }));
    } else if (status === 'withdrawn') {
      setAppliedScholarshipIds(prev => ({
        ...prev,
        [scholarshipId]: false
      }));
    }
  };

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900">
            <BookmarkBorder className="h-6 w-6 text-teal-700 dark:text-teal-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Saved Scholarships</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your bookmarked opportunities</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{savedScholarships.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Saved Items</span>
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
              placeholder="Search saved scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Sort by</option>
            <option value="Most Recent">Recent</option>
            <option value="Amount">Amount</option>
            <option value="Deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Scholarship List */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
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
                  key={scholarship.employer_scholarshippost_id}
                  onClick={() => setSelectedScholarship(scholarship)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedScholarship?.employer_scholarshippost_id === scholarship.employer_scholarshippost_id
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={scholarship.logo || "http://bij.ly/4ib59B1"}
                        alt={scholarship.scholarship_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">                      
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {scholarship.scholarship_title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
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

                      {appliedScholarshipIds[scholarship.employer_scholarshippost_id] && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Applied
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scholarship Details */}
        {selectedScholarship && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8 order-first lg:order-none">
            <SavedScholarshipsView
              scholarship={selectedScholarship}
              isApplied={appliedScholarshipIds[selectedScholarship.employer_scholarshippost_id]}
              onApply={() => handleApplyScholarship(selectedScholarship.employer_scholarshippost_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedScholarship.employer_scholarshippost_id)}
              onScholarshipStatusChanged={(status) => handleScholarshipStatusChange(selectedScholarship.employer_scholarshippost_id, status)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedScholarships;