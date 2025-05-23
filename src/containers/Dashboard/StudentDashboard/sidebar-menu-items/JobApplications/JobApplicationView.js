import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Stack,
  IconButton,

} from '@mui/material';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Unselected state
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Selected state
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';
import logoNav from '../../../../Home/images/logonav.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Loading state styles
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

const JobApplicationView = ({ application, onWithdraw, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const getTimeRemaining = () => {
    if (!application?.created_at) return 'Application submitted';
    const applicationDate = new Date(application.created_at);
    const now = new Date();
    const diffInHours = Math.floor((now - applicationDate) / (1000 * 60 * 60));
    
    if (diffInHours >= 24) {
      return 'Application confirmed';
    }
    
    const hoursLeft = 24 - diffInHours;
    const minutesLeft = 60 - Math.floor((now - applicationDate) / (1000 * 60)) % 60;
    return `${hoursLeft}h ${minutesLeft}m remaining to withdraw`;
  };

  // Loading state with animation
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src={logoNav}
            alt="IPEPS Logo"
            className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
          />
          <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
            Loading Job Application...
          </Typography>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src={logoNav}
            alt="IPEPS Logo"
            className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
          />
          <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
            Select an Application...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section - Smaller for all screens */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.company_name}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center min-h-[80px]">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2">
                {application.job_title}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {application.company_name}
              </Typography>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
            <AccessTimeIcon className="w-4 h-4 mr-1.5" />
            <span className="text-xs sm:text-sm font-medium">{getTimeRemaining()}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Application Details */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <LocationOnIcon fontSize="small" />
            <span>{application.city_municipality}, {application.country}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <WorkIcon fontSize="small" />
            <span>{application.job_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <SchoolIcon fontSize="small" />
            <span>{application.experience_level || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon fontSize="small" />
            <span>₱{application.estimated_salary_from?.toLocaleString()} - ₱{application.estimated_salary_to?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <AccessTimeIcon fontSize="small" />
            <span>Status: {getTimeRemaining()}</span>
          </div>
        </div>

        <Divider className="my-4 sm:my-6" />

        {/* Job Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Job Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-xs sm:text-base">
          {application.job_description}
        </Typography>

        {/* Required Skills Section */}
        {application.other_skills && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Required Skills
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {application.other_skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="text-gray-600 dark:text-gray-300 text-xs sm:text-base bg-gray-100 dark:bg-gray-800 rounded px-2 py-1"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action - Always show the button */}
      <div className="px-3 sm:px-4 md:px-3 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onWithdraw}
          disabled={isLoading}
          className="h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base bg-red-600 hover:bg-red-700"
        >
          {isLoading ? 'Processing...' : 'Withdraw Application'}
        </Button>
      </div>
    </div>
  );
};

export default JobApplicationView;