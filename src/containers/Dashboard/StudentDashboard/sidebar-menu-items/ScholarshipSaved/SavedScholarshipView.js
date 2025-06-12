import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import logoNav from '../../../../Home/images/logonav.png';
import { Typography, Button, Divider } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentIcon from "@mui/icons-material/Payment";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Add styles for loading animation
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

const SavedScholarshipView = ({
  scholarship = {},
  isApplied = false,
  onApply = () => {},
  onRemoveSaved = () => {},
  onScholarshipStatusChanged = () => {},
  isMobile = false,
}) => {
  const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved scholarship
  const [isScholarshipApplied, setIsScholarshipApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipStatus, setScholarshipStatus] = useState({
    is_saved: true,
    is_applied: false,
    application_status: null,
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Initialize state when component mounts or scholarship changes
  useEffect(() => {
    setScholarshipStatus({
      is_saved: true, // Always true for saved scholarships
      is_applied: isApplied || false,
      application_status: null,
    });
  }, [scholarship.employer_scholarshippost_id]);

  // Update applied status when props change
  useEffect(() => {
    setIsScholarshipApplied(isApplied);
    setScholarshipStatus(prev => ({
      ...prev,
      is_applied: isApplied
    }));
  }, [isApplied]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading Scholarship Details...
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
                src={scholarship.provider_logo || scholarship.companyImage || "http://bij.ly/4ib59B1"}
                alt={scholarship.scholarship_title || scholarship.title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>            
            <div className="flex flex-col justify-center min-w-0">
              <Typography 
                variant="h5" 
                className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2 truncate"
              >
                {scholarship.scholarship_title || scholarship.title}
              </Typography>
              <Typography 
                variant="body1" 
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate"
              >
                {scholarship.company_name || scholarship.provider}
              </Typography>
            </div>
          </div>

          {/* Desktop Remove Button */}
          {!isMobile && (
            <Button
              onClick={onRemoveSaved}
              disabled={isLoading}
              className="min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100"
              startIcon={<BookmarkIcon />}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Content Section - Adjust height for mobile */}
      <div className={`p-3 sm:p-4 md:p-6 overflow-y-auto ${
        isMobile 
          ? 'h-[calc(100%-180px)]' 
          : 'h-[calc(100%-120px)]'
      }`}>
        {/* Scholarship Details Section */}
        <div className="space-y-3 sm:space-y-4 mb-6">

          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span>Available Slots: {scholarship.slots || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            <span>Expiration: {scholarship.expiration_date ? new Date(scholarship.expiration_date).toLocaleDateString() : "Not specified"}</span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Scholarship Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Scholarship Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {scholarship.scholarship_description || scholarship.description}
        </Typography>

        {/* Requirements Section */}
        {(scholarship.requirements || scholarship.requirements_details) && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Requirements
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(scholarship.requirements || scholarship.requirements_details).split(",").map((requirement, index) => (
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
      <div className="sticky bottom-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onApply}
          disabled={isLoading || scholarshipStatus.is_applied}
          className={`h-12 rounded-xl font-semibold text-sm ${
            scholarshipStatus.is_applied
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-purple-600 hover:bg-purple-700'
          } ${isMobile ? 'mb-safe' : ''}`}
        >
          {isLoading ? 'Loading...' : scholarshipStatus.is_applied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
      
      <style>{styles}</style>
    </div>
  );
};

export default SavedScholarshipView;
