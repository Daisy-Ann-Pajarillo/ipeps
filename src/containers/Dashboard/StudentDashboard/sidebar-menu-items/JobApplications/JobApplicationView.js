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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.company_name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {application.job_title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {application.company_name}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Application Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon fontSize="small" />
            <span>{application.city_municipality}, {application.country}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <WorkIcon fontSize="small" />
            <span>{application.job_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon fontSize="small" />
            <span>{application.experience_level || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <PaymentIcon fontSize="small" />
            <span>₱{application.estimated_salary_from?.toLocaleString()} - ₱{application.estimated_salary_to?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AccessTimeIcon fontSize="small" />
            <span>Status: {getTimeRemaining()}</span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Job Description */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
          Job Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">
          {application.job_description}
        </Typography>

        {/* Required Skills Section */}
        {application.other_skills && (
          <>
            <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
              Required Skills
            </Typography>
            <div className="flex flex-wrap gap-2">
              {application.other_skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6"                
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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={handleWithdraw}
            className="h-12 rounded-xl font-semibold bg-red-600 hover:bg-red-700"
          >
            Withdraw Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobApplicationView;