import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ComputerIcon from "@mui/icons-material/Computer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import logoNav from "../../../../Home/images/logonav.png";

const TrainingApplicationView = ({
  training,
  onWithdraw = () => {},
  isLoading = false
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading Training Details...
        </Typography>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
          Select a training to view details
        </Typography>
      </div>
    );
  }

  const canWithdraw = () => {
    if (!training?.enrollmentTime) return false;
    const now = new Date().getTime();
    const timeLeft = (training.enrollmentTime + 24 * 60 * 60 * 1000) - now;
    return timeLeft > 0;
  };

  const getTimeRemaining = () => {
    if (!training?.enrollmentTime) return null;
    const now = new Date().getTime();
    const timeLeft = (training.enrollmentTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section - Unified with JobView */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={training.companyImage || "http://bij.ly/4ib59B1"}
                alt={training.provider || training.title || training.training_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2">
                {training.title || training.training_title}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {training.provider || training.employer?.full_name}
              </Typography>
            </div>
          </div>
          {canWithdraw() && (
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
              <AccessTimeIcon className="w-4 h-4 mr-1.5" />
              <span className="text-xs sm:text-sm font-medium">{getTimeRemaining()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">        {/* Training Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.location || training.city_municipality}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ComputerIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.type || training.training_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">{training.experienceLevel || training.experience_level || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AccessTimeIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">Duration: {training.duration || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">Start Date: {training.startDate || training.start_date || "Not specified"}</span>
          </div>
        </div>

        <Divider className="my-4 sm:my-6" />

        {/* Training Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Training Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-xs sm:text-base">
          {training.description || training.training_description}
        </Typography>

        {/* Learning Outcomes/Skills Section */}
        {(training.learning_outcomes || training.required_skills) && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Learning Outcomes
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(training.learning_outcomes || training.required_skills).split(",").map((outcome, index) => (
                <span
                  key={index}
                  className="text-gray-600 dark:text-gray-300 text-xs sm:text-base bg-purple-100 dark:bg-purple-900 rounded px-2 py-1"
                >
                  {outcome.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      {canWithdraw() && (
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={onWithdraw}
            className="h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-xs sm:text-base"
          >
            Withdraw Application
          </Button>
          <Typography variant="caption" className="block text-center mt-2 text-gray-600 dark:text-gray-400">
            {getTimeRemaining()}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TrainingApplicationView;
