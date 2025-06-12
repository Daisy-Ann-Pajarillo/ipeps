import React from 'react';
import { Box, Button, Typography, Chip, Divider } from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
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

const ScholarshipApplicationView = ({ application, onWithdraw, isMobile }) => {
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

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-900 ${
      isMobile 
        ? 'h-[85vh] w-full' 
        : 'rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-180px)] w-full'
    }`}>
      <div className={`flex-shrink-0 ${isMobile ? 'pt-12' : ''} px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">            
          <div className="flex gap-2 sm:gap-3 min-w-0">
            <div className={`${isMobile ? 'w-16 h-16' : 'w-10 h-10'} sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0`}>
              <img
                src={application?.companyImage || "http://bij.ly/4ib59B1"}
                alt={application?.scholarship_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>            
            <div className="flex flex-col justify-center min-w-0">
              <Typography 
                variant="h5" 
                className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2 truncate"
              >
                {application?.scholarship_title}
              </Typography>
              <Typography 
                variant="body1" 
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate"
              >
                {application?.company_name}
              </Typography>
            </div>
          </div>

          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
            application?.status === 'approved'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : application?.status === 'pending'
              ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {application?.status?.charAt(0).toUpperCase() + application?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section - Adjust height for mobile */}
      <div className={`p-3 sm:p-4 md:p-6 overflow-y-auto ${
        isMobile 
          ? 'h-[calc(100%-180px)]' 
          : 'h-[calc(100%-120px)]'
      }`}>
        {/* Application Details Section */}        
       <div className="space-y-3 sm:space-y-4 mb-6">
          {/*  {application?.city_municipality && application?.country && (
                <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
              <span className="truncate">{application.city_municipality}, {application.country}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <SchoolIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">{application?.scholarship_type || "Not specified"}</span> 
          </div>
               */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">Available Slots: {application?.slots || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">Applied: {new Date(application?.applied_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">Expiration: {application?.expiration_date ? new Date(application.expiration_date).toLocaleDateString() : "Not specified"}</span>
          </div>
        </div>

        {/* Application Status Card */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
            Application Details
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="overflow-hidden">
              <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {application?.application_id}
              </p>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {new Date(application?.updated_at).toLocaleDateString()}
              </p>
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
      </div>

      {/* Footer Action */}
      {application?.status === 'pending' && (
        <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={() => onWithdraw(application.scholarship_posting_id)}
            className={`h-12 rounded-xl font-semibold text-sm bg-red-600 hover:bg-red-700 ${isMobile ? 'mb-safe' : ''}`}
          >
            Withdraw Application
          </Button>
          <Typography variant="caption" className="block text-center mt-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            You can withdraw your application while it's pending
          </Typography>
        </div>
      )}
      
      <style>{styles}</style>
    </div>
  );
};

export default ScholarshipApplicationView;