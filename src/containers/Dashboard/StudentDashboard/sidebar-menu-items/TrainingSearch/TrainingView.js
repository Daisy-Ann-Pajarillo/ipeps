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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full">
      {/* Colored Header Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-t-xl" />
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg overflow-hidden">
              <img
                src={training.providerImage || "http://bij.ly/4ib59B1"}
                alt={training.provider || training.training_title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 dark:text-white"
              >
                {training.training_title}
              </Typography>
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-400"
              >
                {training.provider}
              </Typography>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={`min-w-[100px] ${
              isSaved
                ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Training Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon fontSize="small" />
            <span>
              {training.city_municipality}, {training.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ComputerIcon fontSize="small" />
            <span>{training.training_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon fontSize="small" />
            <span>{training.experience_level || "Not specified"}</span>
          </div>

          {training.expiration_date && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CalendarTodayIcon fontSize="small" />
              <span>
                Expires:{" "}
                {new Date(training.expiration_date).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AccessTimeIcon fontSize="small" />
            <span>Duration: {training.duration || "Not specified"}</span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Training Description */}
        <Typography
          variant="h6"
          className="font-semibold mb-3 text-gray-900 dark:text-white"
        >
          Training Description
        </Typography>
        <Typography className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">
          {training.training_description}
        </Typography>

        {/* Learning Outcomes/Skills Section */}
        {training.learning_outcomes && (
          <>
            <Typography
              variant="h6"
              className="font-semibold mb-3 text-gray-900 dark:text-white"
            >
              Learning Outcomes
            </Typography>
            <div className="flex flex-wrap gap-2">
              {training.learning_outcomes.split(",").map((outcome, index) => (
                <span
                  key={index}
                  className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm px-4 py-1.5 rounded-full"
                >
                  {outcome.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleEnroll}
          disabled={isLoading || isEnrolled}
          className={`h-12 rounded-xl font-semibold ${
            isEnrolled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLoading
            ? "Loading..."
            : isEnrolled
            ? "Enrolled"
            : "Enroll Now"}
        </Button>
      </div>
    </div>
  );
};

export default TrainingView;
