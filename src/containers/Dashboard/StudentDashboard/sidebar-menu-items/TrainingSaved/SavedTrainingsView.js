import React from "react";
import { Typography, Button, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import logoNav from '../../../../Home/images/logonav.png';

const SavedTrainingsView = ({
  training = {},
  isEnrolled = false,
  onEnroll = () => {},
  onRemoveSaved = () => {},
  isLoading = false
}) => {
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] w-full flex flex-col">
      {/* Colored Header Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-t-xl" />
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={training.companyImage}
                alt={training.provider}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {training.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {training.provider}
              </Typography>
            </div>
          </div>
          
          <Button
            onClick={onRemoveSaved}
            disabled={isLoading}
            className="min-w-[100px] bg-red-50 text-red-600 hover:bg-red-100"
            startIcon={<BookmarkIcon />}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Training Details Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon fontSize="small" />
            <span>{training.city_municipality}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon fontSize="small" />
            <span>{training.experience_level || "Not specified"}</span>
          </div>

          {training.expiration && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CalendarTodayIcon fontSize="small" />
              <span>Expires: {new Date(training.expiration).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Divider className="my-6" />

        {/* Training Description */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
          Training Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">
          {training.description}
        </Typography>
      </div>

      {/* Footer Action */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onEnroll}
          disabled={isLoading || isEnrolled}
          className={`h-12 rounded-xl font-semibold ${
            isEnrolled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </Button>
      </div>
    </div>
  );
};

export default SavedTrainingsView;
