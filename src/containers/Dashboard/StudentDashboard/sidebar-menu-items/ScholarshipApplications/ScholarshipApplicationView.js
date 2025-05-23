import React from 'react';
import { Box, Button, Typography, Chip, Divider } from '@mui/material';
import { LocationOn as LocationOnIcon, School as SchoolIcon, Payment as PaymentIcon, CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
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

const ScholarshipApplicationView = ({ application, onWithdraw }) => {
  if (!application) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
          Select an application to view details
        </Typography>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.scholarship_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center min-h-[80px]">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl">
                {application.scholarship_title}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-0.5">
                {application.company_name}
              </Typography>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
            application.status === 'approved'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : application.status === 'pending'
              ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-64px)]">
        {/* Application Details */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span>{application.city_municipality}, {application.country}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <SchoolIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span>{application.scholarship_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span>{application.reward_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span>Applied: {formatDate(application.applied_at)}</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
            Application Details
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{application.application_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(application.updated_at)}</p>
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Scholarship Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Scholarship Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {application.scholarship_description}
        </Typography>

        {/* Requirements Section */}
        {application.requirements && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Requirements
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {application.requirements.split(",").map((requirement, index) => (
                <span
                  key={index}
                  className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm bg-purple-50 dark:bg-purple-900/30 rounded-full px-3 py-1"
                >
                  {requirement.trim()}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Footer Action - Moved inside content section */}
        {application.status === 'pending' && (
          <div className="mt-6 px-0 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="contained"
              fullWidth
              onClick={() => onWithdraw(application.scholarship_posting_id)}
              className="h-10 lg:h-12 text-sm lg:text-base rounded-lg lg:rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white"
              sx={{
                textTransform: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Withdraw Application
            </Button>
            <Typography variant="caption" className="block text-center mt-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
              You can withdraw your application while it's pending
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipApplicationView;