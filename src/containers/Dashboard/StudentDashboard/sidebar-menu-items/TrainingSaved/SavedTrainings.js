import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledTrainings, setEnrolledTrainings] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
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

      // Handle the response data
      if (response.data.success && Array.isArray(response.data.trainings)) {
        const transformedTrainings = response.data.trainings.map((training) => ({
          id: training.saved_training_id,
          training_id: training.employer_trainingpost_id || training.training_id,
          title: training.training_title,
          description: training.training_description,
          companyImage: training.providerImage || "https://bit.ly/3Qgevzn",
          expiration: training.expiration_date,
          provider: training.provider || "Unknown Provider",
          city_municipality: training.city_municipality,
          training_type: training.training_type,
          experience_level: training.experience_level,
        }));

        setSavedTrainings(transformedTrainings);
        // Only auto-select first training on desktop
        const isDesktop = window.innerWidth >= 1024;
        if (transformedTrainings.length > 0 && !selectedTraining && isDesktop) {
          setSelectedTraining(transformedTrainings[0]);
        }

        // Check enrollment status for all trainings
        checkEnrollmentStatuses(transformedTrainings);
      }
    } catch (error) {
      console.error("Error fetching saved trainings:", error);
      toast.error("Failed to load saved trainings");
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
          console.error(`Error checking status for training ${training.training_id}:`, error);
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

      toast.success(response.data.message || "Successfully enrolled in the training");
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_applied) {
        setEnrolledTrainings((prev) => ({
          ...prev,
          [trainingId]: true,
        }));
        toast.info("You have already enrolled in this training");
      } else {
        toast.error(error.response?.data?.message || "Failed to enroll in the training");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromSaved = async (training) => {
    setIsLoading(true);
    try {
      await axios.post(
        "/api/save-training",
        {
          employer_trainingpost_id: training.training_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      const updatedTrainings = savedTrainings.filter((t) => t.training_id !== training.training_id);
      setSavedTrainings(updatedTrainings);

      if (selectedTraining?.training_id === training.training_id) {
        setSelectedTraining(updatedTrainings[0] || null);
      }

      toast.info("Training removed from saved items");
    } catch (error) {
      console.error("Error removing saved training:", error);
      toast.error("Failed to remove training from saved items");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort trainings
  const filteredTrainings = savedTrainings.filter((training) =>
    training.title?.toLowerCase().includes(query.toLowerCase()) ||
    training.description?.toLowerCase().includes(query.toLowerCase()) ||
    training.provider?.toLowerCase().includes(query.toLowerCase()) ||
    training.city_municipality?.toLowerCase().includes(query.toLowerCase())
  );

  // Sort trainings
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      
      {/* Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <BookmarkIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Saved Trainings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your bookmarked trainings</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{sortedTrainings.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Saved Items</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e] border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search saved trainings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="Most Recent">Recent</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2">
          {/* Training List */}
          <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
            <div className="flex flex-col gap-3 h-[calc(100vh-180px)] overflow-y-auto lg:pr-4">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-40 gap-2">
                  <img 
                    src={logoNav} 
                    alt="IPEPS Logo" 
                    className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                  />
                  <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-base">
                    Loading Trainings...
                  </Typography>
                </div>
              ) : sortedTrainings.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                  <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    No saved trainings found
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard/training-search')}
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-base"
                  >
                    Browse Trainings
                  </Button>
                </div>
              ) : (
                sortedTrainings.map((training) => (
                  <div
                    key={training.training_id}
                    onClick={() => setSelectedTraining(training)}
                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                      selectedTraining?.training_id === training.training_id
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="flex gap-2 sm:gap-3 min-w-0"> {/* Added min-w-0 */}
                      <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={training.companyImage || "http://bij.ly/4ib59B1"}
                          alt={training.provider || training.title}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
                        <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {training.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {training.city_municipality}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {training.training_type} • {training.experience_level}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {training.provider}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 self-start text-base sm:text-lg flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSaved(training);
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

          {/* Desktop View */}
          {selectedTraining && (
            <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8 order-first lg:order-none">
              <SavedTrainingsView 
                training={selectedTraining} 
                onEnroll={() => handleEnroll(selectedTraining.training_id)}
                onRemoveSaved={() => handleRemoveFromSaved(selectedTraining)}
                isEnrolled={enrolledTrainings[selectedTraining.training_id]}
                isLoading={isLoading}
                isMobile={false}
              />
            </div>
          )}

          {/* Mobile View */}
          {selectedTraining && (
            <div 
              className="lg:hidden fixed inset-0" 
              style={{ 
                position: 'fixed', 
                zIndex: Number.MAX_SAFE_INTEGER,
                isolation: 'isolate',
                pointerEvents: 'auto'
              }}
            >
              <div 
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                style={{ 
                  position: 'fixed', 
                  zIndex: Number.MAX_SAFE_INTEGER,
                  pointerEvents: 'auto'
                }}
              >
                <div className="fixed inset-0 overflow-hidden">
                  <div className="fixed inset-0" onClick={() => setSelectedTraining(null)} />
                  <div 
                    className="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0"
                    style={{ 
                      zIndex: Number.MAX_SAFE_INTEGER,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                      <div 
                        className="absolute right-4 top-4"
                        style={{ zIndex: 999999999 }}
                      >
                        <button
                          onClick={() => setSelectedTraining(null)}
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <SavedTrainingsView 
                        training={selectedTraining}
                        onEnroll={() => handleEnroll(selectedTraining.training_id)}
                        onRemoveSaved={() => handleRemoveFromSaved(selectedTraining)}
                        isEnrolled={enrolledTrainings[selectedTraining.training_id]}
                        isLoading={isLoading}
                        isMobile={true}
                        onClose={() => setSelectedTraining(null)}
                      />
                    </div>
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

export default SavedTrainings;
