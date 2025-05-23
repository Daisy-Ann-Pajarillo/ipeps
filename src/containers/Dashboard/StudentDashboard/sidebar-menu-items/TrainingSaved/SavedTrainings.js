import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { tokens } from "../../../theme";
import SavedTrainingsView from "./SavedTrainingsView";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoNav from '../../../../Home/images/logonav.png';
import pesoLogo from '../../../../Home/images/pesoLogo.png';


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

const SavedTrainings = () => {
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
          (t.city_municipality && t.city_municipality.toLowerCase().includes(query.toLowerCase()))
      );
    }    // Sort options
    if (sortBy === "Most Recent") {
      updatedTrainings.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Cost") {
      updatedTrainings.sort(
        (a, b) => (b.estimated_cost_from || 0) - (a.estimated_cost_from || 0)
      );
    }

    setFilteredTrainings(updatedTrainings);
  }, [query, sortBy, savedTrainings]);

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <BookmarkIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Saved Trainings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your bookmarked trainings</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredTrainings.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Saved Programs</span>
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
              placeholder="Search saved trainings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >            <option value="">Sort</option>
            <option value="Most Recent">Recent</option>
            <option value="Cost">Cost</option>
          </select>
        </div>
      </div>            
      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Training List - Left Side */}
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
                  Loading Saved Trainings...
                </Typography>
              </div>
            ) : filteredTrainings.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No saved trainings found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard/training-search')}
                  style={{
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    textTransform: 'none',
                    marginTop: '8px',
                  }}
                >
                  Browse Trainings
                </Button>
              </div>
            ) : (
              filteredTrainings.map((training) => (
                <div
                  key={training.training_id}
                  onClick={() => handleTrainingClick(training.training_id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedTraining?.training_id === training.training_id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={training.providerImage || "http://bij.ly/4ib59B1"}
                        alt={training.training_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {training.title || training.training_title}
                          </h3>
                        </div>
                        {enrolledTrainings[training.training_id] && (
                          <div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              Enrolled
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {training.training_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {training.experience_level || "Any Level"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {training.city_municipality}, {training.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Training Details - Right Side */}
        {selectedTraining && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8 order-first lg:order-none">
            <SavedTrainingsView
              training={selectedTraining}
              onEnroll={() => handleEnroll(selectedTraining.training_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedTraining)}
              isEnrolled={enrolledTrainings[selectedTraining.training_id]}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrainings;
