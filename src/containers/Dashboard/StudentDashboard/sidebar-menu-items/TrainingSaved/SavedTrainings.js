import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  useTheme,  // Add this import
} from "@mui/material";
import { tokens } from "../../../theme";
import SavedTrainingsView from "./SavedTrainingsView";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoNav from '../../../../Home/images/logonav.png';

import * as actions from "../../../../../store/actions/index";

// Add loading animation styles
const styles = `
  @keyframes pulse-zoom {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  .loading-logo {
    animation: pulse-zoom 1.5s ease-in-out infinite;
  }
`;

const SavedTrainings = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = "72px";
  const [enrolledTrainings, setEnrolledTrainings] = useState({});
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState([]); // Add this state
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Check status for a single training
  const checkTrainingStatus = async (trainingId) => {
    if (!auth.token || !trainingId) return null;

    try {
      const response = await axios.post(
        "/api/check-training-status",
        {
          employer_trainingpost_id: trainingId,
        },
        {
          auth: { username: auth.token },
        }
      );

      if (response.data && response.data.success) {
        return {
          is_applied: response.data.is_applied || false,
        };
      }
    } catch (error) {
      console.error(`Error checking status for training ${trainingId}:`, error);
    }

    return null;
  };

  // Fetch saved trainings from the API with authentication
  const fetchSavedTrainings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-saved-trainings", {
        auth: {
          username: auth.token,
        },
      });

      console.log("Saved trainings response:", response.data);

      // Handle the response data
      if (response.data.success && Array.isArray(response.data.trainings)) {
        const transformedTrainings = response.data.trainings.map(
          (training) => ({
            id: training.saved_training_id,
            training_id:
              training.employer_trainingpost_id || training.training_id, // Use employer_trainingpost_id if available
            title: training.training_title,
            description: training.training_description,
            companyImage: training.providerImage || "https://bit.ly/3Qgevzn",
            expiration: training.expiration_date,
            provider: training.provider || "Unknown Provider",
            // Adding more properties that might be needed
            city_municipality: training.city_municipality,
            training_type: training.training_type,
            experience_level: training.experience_level,
            estimated_cost_from: training.estimated_cost_from,
            estimated_cost_to: training.estimated_cost_to,
          })
        );

        setSavedTrainings(transformedTrainings);

        // Auto-select first training if available and no training is currently selected
        if (transformedTrainings.length > 0 && !selectedTraining) {
          setSelectedTraining(transformedTrainings[0]);
        }

        // Check enrollment status for all trainings
        checkEnrollmentStatuses(transformedTrainings);
      } else {
        // console.error("Invalid API response:", response.data);
        // toast.error("Failed to load saved trainings");
      }
    } catch (error) {
      //console.error("Error fetching saved trainings:", error);
      ////toast.error("Failed to load saved trainings");
    } finally {
      setIsLoading(false);
    }
  };

  // Check enrollment status for all trainings
  const checkEnrollmentStatuses = async (trainings) => {
    if (!auth.token || !trainings.length) return;

    const enrolledMap = {};

    for (const training of trainings) {
      if (training.training_id) {
        try {
          const status = await checkTrainingStatus(training.training_id);
          if (status && status.is_applied) {
            enrolledMap[training.training_id] = true;
          }
        } catch (error) {
          // Continue checking other trainings even if one fails
          console.error(
            `Error checking status for training ${training.training_id}:`,
            error
          );
        }
      }
    }

    setEnrolledTrainings(enrolledMap);
  };

  useEffect(() => {
    if (auth.token) {
      fetchSavedTrainings();
    }
  }, [auth.token]);

  const handleEnroll = async (trainingId) => {
    if (!auth.token) {
      toast.error("Please login to enroll in a training");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/apply-training",
        {
          employer_trainingpost_id: trainingId,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      // Update enrollment status
      setEnrolledTrainings((prev) => ({
        ...prev,
        [trainingId]: true,
      }));

      toast.success(
        response.data.message || "Successfully enrolled in the training"
      );
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_applied) {
        setEnrolledTrainings((prev) => ({
          ...prev,
          [trainingId]: true,
        }));
        toast.info("You have already enrolled in this training");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to enroll in the training"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromSaved = async (training) => {
    setIsLoading(true);
    try {
      // Use the correct ID for the API call
      const trainingIdToUse = training.training_id;

      // Using the save-training endpoint to toggle saved status
      const response = await axios.post(
        "/api/save-training",
        {
          employer_trainingpost_id: trainingIdToUse,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      // Remove the training from local state
      const updatedTrainings = savedTrainings.filter(
        (t) => t.id !== training.id
      );
      setSavedTrainings(updatedTrainings);

      // If the removed training was selected, clear the selection
      if (selectedTraining?.id === training.id) {
        setSelectedTraining(null);
      }

      toast.info("Training removed from saved items");
    } catch (error) {
      console.error("Error removing saved training:", error);
      toast.error("Failed to remove training from saved items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingClick = (trainingId) => {
    const selected = savedTrainings.find((t) => t.id === trainingId);
    setSelectedTraining(selected);
  };

  // useEffect to filter and sort trainings dynamically
  useEffect(() => {
    let updatedTrainings = [
      ...(Array.isArray(savedTrainings) ? savedTrainings : []),
    ];

    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(query.toLowerCase())) ||
          (t.description &&
            t.description.toLowerCase().includes(query.toLowerCase())) ||
          (t.provider && t.provider.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Sorting logic
    if (sortBy === "Company Name") {
      updatedTrainings.sort((a, b) =>
        (a.provider || "").localeCompare(b.provider || "")
      );
    } else if (sortBy === "Most Recent") {
      updatedTrainings.sort((a, b) => {
        if (!a.expiration && !b.expiration) return 0;
        if (!a.expiration) return 1;
        if (!b.expiration) return -1;
        return new Date(b.expiration) - new Date(a.expiration);
      });
    }

    setFilteredTrainings(updatedTrainings);
  }, [query, sortBy, savedTrainings]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Centered Header Section */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-800 dark:to-purple-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          My Saved Trainings
        </Typography>
        <Typography variant="subtitle1" className="text-purple-100 mb-4 text-xs sm:text-base md:text-lg">
          Review and manage your bookmarked training opportunities
        </Typography>

        {/* Search & Filter Section - Unified */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-12 sm:-mb-16 md:-mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search saved trainings..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Company Name">Company Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section with responsive layout */}
      <div className="flex flex-col lg:flex-row p-2 sm:p-4 md:p-8 pt-8 sm:pt-12 md:pt-14 gap-6 md:gap-8">
        {/* Training Details (top on mobile, right on desktop) */}
        {selectedTraining && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <SavedTrainingsView
              training={selectedTraining}
              isEnrolled={enrolledTrainings[selectedTraining.training_id] || false}
              onEnroll={() => handleEnroll(selectedTraining.training_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedTraining)}
              isLoading={isLoading}
            />
          </div>
        )}
        {/* Training List */}
        <div className={`${selectedTraining ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {filteredTrainings.length} saved trainings
            </Typography>
          </div>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Saved Trainings...
                </Typography>
              </div>
            ) : filteredTrainings.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2">
                <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No saved trainings found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard/training-search')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Browse Trainings
                </Button>
              </div>
            ) : (
              filteredTrainings.map((training) => (
                <div
                  key={training.id}
                  onClick={() => handleTrainingClick(training.id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedTraining?.id === training.id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    {/* Provider Logo */}
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={training.companyImage}
                        alt={training.title}
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    </div>
                    {/* Training Info */}
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {training.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {training.city_municipality}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {training.training_type} • {training.experience_level}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Provider: {training.provider}
                      </div>
                    </div>
                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-red-700 self-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(training);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  {enrolledTrainings[training.training_id] && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enrolled
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedTrainings;
