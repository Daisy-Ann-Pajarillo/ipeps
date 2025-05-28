import React from 'react';
import {
  Button, Typography, Box, Avatar, Tabs, Tab, Chip, IconButton
} from '@mui/material';
import { LocationOn, Language, People } from '@mui/icons-material';
import Rating from '@mui/material/Rating';

const CompanyModal = ({ 
  company, 
  onClose, 
  isMobile = false 
}) => {
  if (!company) return null;

  return (
    <div 
      className={`bg-white dark:bg-gray-900 flex flex-col ${
        isMobile
          ? 'h-[85vh] w-full'
          : 'rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-180px)] w-full'
      }`}
      style={{ 
        overflow: isMobile ? 'hidden' : 'auto',
        position: isMobile ? 'relative' : 'static',
        zIndex: isMobile ? Number.MAX_SAFE_INTEGER : 'auto'
      }}
    >
      {/* Close Button for Mobile */}
      {isMobile && (
        <div 
          className="absolute right-4 top-4"
          style={{ zIndex: Number.MAX_SAFE_INTEGER }}
        >
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className={`${isMobile ? 'pt-12' : ''} px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className={`${isMobile ? 'w-16 h-16' : 'w-10 h-10'} sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden`}>
              <img
                src={company.logo || "http://bij.ly/4ib59B1"}
                alt={company.name}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2">
                {company.name}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {company.industry}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
        {/* Company Details */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <LocationOn className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <Language className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span className="truncate">{company.website}</span>
          </div>
        </div>

        {/* Description Section */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          About Company
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {company.description}
        </Typography>

        {/* Additional company information sections */}
      </div>

      {/* Optional Footer Section */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        {/* Add any footer actions here */}
      </div>
    </div>
  );
};

export default CompanyModal;