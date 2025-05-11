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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full flex flex-col">
      {/* Colored Header Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-t-xl" />
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={training.companyImage || "http://bij.ly/4ib59B1"}
                alt={training.provider}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {training.title || training.training_title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {training.provider || training.employer?.full_name}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Training Details Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon fontSize="small" />
            <span>{training.location || training.city_municipality}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon fontSize="small" />
            <span>{training.experienceLevel || training.experience_level || "Not specified"}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CalendarTodayIcon fontSize="small" />
            <span>Start Date: {training.startDate || training.start_date || "Not specified"}</span>
          </div>

          {/* Training Type */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ComputerIcon fontSize="small" />
            <span>{training.type || training.training_type || "Not specified"}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AccessTimeIcon fontSize="small" />
            <span>Duration: {training.duration || "Not specified"}</span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Training Description */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
          Training Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">
          {training.description || training.training_description}
        </Typography>

        {/* Learning Outcomes/Skills Section */}
        {(training.learning_outcomes || training.required_skills) && (
          <>
            <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
              Learning Outcomes
            </Typography>
            <div className="flex flex-wrap gap-2">
              {(training.learning_outcomes || training.required_skills).split(",").map((outcome, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-4 py-1.5 rounded-full"
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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={onWithdraw}
            className="h-12 rounded-xl font-semibold bg-red-600 hover:bg-red-700"
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
