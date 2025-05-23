import React, { useEffect, useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ComputerIcon from "@mui/icons-material/Computer";
import * as actions from "../../../../../store/actions/index";
import { toast } from "react-toastify";
import axios from "../../../../../axios";
import logoNav from '../../../../Home/images/logonav.png';

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

const TrainingView = ({ training }) => {
  const [isSaved, setIsSaved] = useState();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log("training: ", training.training_id);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const handleEnroll = async () => {
    // Don't proceed if already enrolled
    if (isEnrolled) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/apply-training",
        {
          employer_trainingpost_id: training.training_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );
      console.log("respnse: ", response.data);

      setIsEnrolled(true);
      toast.success(
        response.data.message || "Successfully enrolled in the training"
      );
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_applied) {
        setIsEnrolled(true);
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

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
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

      // Toggle saved state locally regardless of response
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      newSavedState
        ? toast.success(response.data.message || "Training saved successfully")
        : toast.info(
            response.data.message || "Training removed from saved items"
          );
    } catch (error) {
      console.error("Error saving training:", error);
      toast.error(
        error.response?.data?.message || "Failed to save the training"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkTrainingStatus = async () => {
      if (!training?.training_id || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check training status
        const statusResponse = await axios.post(
          "/api/check-training-status",
          { employer_trainingpost_id: training.training_id },
          { auth: { username: auth.token } }
        );

        setIsSaved(statusResponse.data.is_saved);
        setIsEnrolled(statusResponse.data.is_applied);
      } catch (error) {
        console.error("Error checking training status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTrainingStatus();
  }, [training.training_id, auth.token]);

  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  // Add loading state check at the beginning of render
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading Training...
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section - Unified with JobView */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={training.providerImage || "http://bij.ly/4ib59B1"}
                alt={training.provider || training.training_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2">
                {training.training_title}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {training.provider}
              </Typography>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={`min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm ${
              isSaved
                ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Training Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.city_municipality}, {training.country}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ComputerIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.training_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.experience_level || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AccessTimeIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">Duration: {training.duration || "Not specified"}</span>
          </div>
          {training.expiration_date && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
              <span className="text-sm sm:text-base">Expires: {new Date(training.expiration_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Divider className="my-6" />

        {/* Training Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Training Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {training.training_description}
        </Typography>

        {/* Learning Outcomes/Skills Section */}
        {training.learning_outcomes && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Learning Outcomes
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {training.learning_outcomes.split(",").map((outcome, index) => (
                <span
                  key={index}
                  className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm bg-purple-50 dark:bg-purple-900/30 rounded-full px-3 py-1"
                >
                  {outcome.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleEnroll}
          disabled={isLoading || isEnrolled}
          className={`h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base ${
            isEnrolled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? 'Loading...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </Button>
      </div>
    </div>
  );
};

export default TrainingView;

// To adjust mobile view sizes, change text-[15px], px-3, py-3, gap-1.5, etc. above. Look for sm: and md: classes for desktop/tablet.
