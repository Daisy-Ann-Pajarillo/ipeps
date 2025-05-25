import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';
import logoNav from '../../../../Home/images/logonav.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

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

const JobApplicationView = ({ application, onWithdraw, isLoading, isMobile = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    // Check if application is within 24 hours
    const checkWithdrawalEligibility = () => {
      const applicationTime = new Date(application.applied_at).getTime();
      const now = new Date().getTime();
      const timeDiff = now - applicationTime;
      const canStillWithdraw = timeDiff <= 24 * 60 * 60 * 1000;
      
      setCanWithdraw(canStillWithdraw);

      if (canStillWithdraw) {
        const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        setTimeRemaining(`${hours}h ${minutes}m remaining to withdraw`);
      } else {
        setTimeRemaining('Application submitted');
      }
    };

    checkWithdrawalEligibility();
    const interval = setInterval(checkWithdrawalEligibility, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [application?.applied_at]);

  // Loading state with animation
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading Application Details...
        </Typography>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
          Select an application to view details
        </Typography>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${
      isMobile 
        ? 'h-[85vh] w-full' 
        : 'rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] w-full'
    }`}>
      {/* Header Section */}
      <div className={`${isMobile ? 'pt-12' : ''} px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">            
          <div className="flex gap-2 sm:gap-3">            
            <div className={`${isMobile ? 'w-16 h-16' : 'w-10 h-10'} sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden`}>
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.company_name || application.job_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>            
            <div className="flex flex-col justify-center">
              <Typography 
                variant="h5" 
                className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl"
              >
                {application.job_title}
              </Typography>
              <Typography 
                variant="body1" 
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
              >
                {application.company_name}
              </Typography>
              {/* Application Status Badge */}
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                  ${application.status === 'approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : application.status === 'declined'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  <PendingActionsIcon className="w-3 h-3" />
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Adjust height for mobile */}
      <div className={`p-3 sm:p-4 md:p-6 overflow-y-auto ${
        isMobile 
          ? 'h-[calc(100%-180px)]' 
          : 'h-[calc(100%-120px)]'
      }`}>
        {/* Application Details Section */}
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
            <BusinessCenterIcon fontSize="small" />
            <span>Vacancies: {application.no_of_vacancies || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon fontSize="small" />
            <span>₱{application.estimated_salary_from?.toLocaleString()} - ₱{application.estimated_salary_to?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <AccessTimeIcon fontSize="small" />
            <span>Applied: {new Date(application.applied_at).toLocaleString()}</span>
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

        {/* Withdrawal Time Info */}
        {canWithdraw && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2" className="font-medium">
                {timeRemaining}
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {canWithdraw ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => onWithdraw(application.application_id)}
            disabled={isLoading}
            className="h-12 rounded-xl font-semibold text-sm bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Processing...' : 'Withdraw Application'}
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            disabled={true}
            className="h-12 rounded-xl font-semibold text-sm bg-gray-400"
          >
            Cannot Withdraw
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobApplicationView;