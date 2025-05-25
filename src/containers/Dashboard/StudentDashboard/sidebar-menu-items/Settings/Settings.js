import React from 'react';
import {
  Typography,
  IconButton,
} from '@mui/material';
import {
  PersonOutline,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Settings = () => {
  return (
    <div className="w-full p-2 sm:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <SettingsIcon className="text-gray-800 dark:text-white w-6 h-6 sm:w-7 sm:h-7" />
        <Typography variant="h4" className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Settings
        </Typography>
      </div>
      <hr className="border-gray-300 dark:border-gray-700 mb-4 sm:mb-6" />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Settings Menu */}
        <div className="w-full lg:w-2/3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <a
            href="/user-application-form?click_from=profile"
            className="block text-blue-500 hover:underline text-sm sm:text-base p-2"
          >
            Profile Information
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;