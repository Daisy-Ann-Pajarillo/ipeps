import React from "react";
import { Typography, Button, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
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
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full">
      {/* Header Section - Unified */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={training.companyImage || "http://bij.ly/4ib59B1"}
                alt={training.provider || training.title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {training.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                {training.provider}
              </Typography>
            </div>
          </div>
          <Button
            onClick={onRemoveSaved}
            disabled={isLoading}
            className="min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100"
            startIcon={<BookmarkIcon />}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Training Details Section */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <LocationOnIcon fontSize="small" />
            <span>{training.city_municipality}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <SchoolIcon fontSize="small" />
            <span>{training.experience_level || "Not specified"}</span>
          </div>
          {training.expiration && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
              <CalendarTodayIcon fontSize="small" />
              <span>Expires: {new Date(training.expiration).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Divider className="my-4 sm:my-6" />

        {/* Training Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Training Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-xs sm:text-base">
          {training.description}
        </Typography>
      </div>

      {/* Footer Action */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onEnroll}
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

export default SavedTrainingsView;
