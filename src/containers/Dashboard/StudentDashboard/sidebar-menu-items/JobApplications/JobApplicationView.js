import React from 'react';
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

const JobApplicationView = ({ application, onWithdraw }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!application) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Select an Application...
        </Typography>
      </div>
    );
  }

  const canWithdraw = () => {
    if (!application?.applicationTime) return false;
    const now = new Date().getTime();
    const timeLeft = (application.applicationTime + 24 * 60 * 60 * 1000) - now;
    return timeLeft > 0;
  };

  const getTimeRemaining = () => {
    if (!application?.applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (application.applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application confirmed';

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdraw = () => {
    if (!canWithdraw()) return;

    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`job-${application.id}`];
    delete applicationTimes[`job-${application.id}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    // Call parent's onWithdraw to update the list and clear selection
    onWithdraw(application.id);

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full">
      {/* MOBILE: To adjust mobile layout, change rounded-lg, shadow-lg, and paddings below as needed */}
      {/* Header Section - Smaller for all screens */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        {/* To adjust header size, change px-2/py-2 for mobile here */}
        <div className="flex gap-2 sm:gap-4 items-start justify-between">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.company_name}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {application.job_title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                {application.company_name}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Application Details */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
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

      {/* Footer Action */}
      {canWithdraw() && (
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={handleWithdraw}
            className="h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base bg-red-600 hover:bg-red-700"
          >
            Withdraw Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobApplicationView;