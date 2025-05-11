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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Hero Section - Updated gradient colors */}
      <section className="w-full bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400 dark:from-teal-900 dark:to-teal-700 px-8 py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h3" className="text-white font-bold mb-3">
          My Saved Scholarships
        </Typography>
        <Typography variant="h6" className="text-teal-100 mb-8">
          Review and manage your bookmarked scholarship opportunities
        </Typography>

        {/* Search & Filter Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search saved scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Amount">Amount</option>
              <option value="Deadline">Deadline</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="flex p-8 pt-14">
        {/* Scholarship List */}
        <div className={`${selectedScholarship ? "w-3/5" : "w-full"} pr-6`}>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-4">
            {savedScholarships.length} saved scholarships
          </Typography>

          <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-4">
                <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Loading Saved Scholarships...
                </Typography>
              </div>
            ) : sortedScholarships.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 dark:text-gray-400">
                  No saved scholarships found
                </p>
              </div>
            ) : (
              sortedScholarships.map((scholarship) => (
                <div
                  key={scholarship.saved_scholarship_id}
                  onClick={() => setSelectedScholarship(scholarship)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border ${
                    selectedScholarship?.saved_scholarship_id === scholarship.saved_scholarship_id
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
                        {`Posted By: ${scholarship.employer?.full_name || "N/A"}`}
                      </div>
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

        {/* Details Panel */}
        {selectedScholarship && (
          <div className="w-2/5">
            <SavedScholarshipsView
              scholarship={selectedScholarship}
              isApplied={appliedScholarshipIds[selectedScholarship.employer_scholarshippost_id]}
              onApply={() => handleApplyScholarship(selectedScholarship.employer_scholarshippost_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedScholarship.employer_scholarshippost_id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedScholarships;