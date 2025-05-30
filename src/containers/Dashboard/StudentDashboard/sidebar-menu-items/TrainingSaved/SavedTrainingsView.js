import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import logoNav from '../../../../Home/images/logonav.png';
import { Typography, Button, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";

const SavedTrainingsView = ({
  training = {},
  isEnrolled = false,
  onEnroll = () => {},
  onRemoveSaved = () => {},
  onTrainingStatusChanged = () => {},
  isMobile = false,
}) => {
  const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved training
  const [isTrainingEnrolled, setIsTrainingEnrolled] = useState(isEnrolled);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Update isTrainingEnrolled when the isEnrolled prop changes
  useEffect(() => {
    setIsTrainingEnrolled(isEnrolled);
  }, [isEnrolled]);

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
    <div className={`flex flex-col bg-white dark:bg-gray-900 ${
      isMobile 
        ? 'h-[85vh] w-full' 
        : 'rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-180px)] w-full'
    }`}>
      {/* Header Section - flex-shrink-0 */}
      <div className={`flex-shrink-0 ${isMobile ? 'pt-12' : ''} px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">            
          <div className="flex gap-2 sm:gap-3 min-w-0">  {/* Added min-w-0 */}           
            <div className={`${isMobile ? 'w-16 h-16' : 'w-10 h-10'} sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0`}>
              <img
                src={training.companyImage || "http://bij.ly/4ib59B1"}
                alt={training.provider || training.title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>            
            <div className="flex flex-col justify-center min-h-[80px] min-w-0"> {/* Added min-w-0 */}
              <Typography 
                variant="h5" 
                className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2 truncate"
              >
                {training.title}
              </Typography>
              <Typography 
                variant="body1" 
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate"
              >
                {training.provider}
              </Typography>
            </div>
          </div>

          {/* Desktop Remove Button */}
          {!isMobile && (
            <Button
              onClick={onRemoveSaved}
              disabled={isLoading}
              className="min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100 flex-shrink-0 ml-2"
              startIcon={<BookmarkIcon />}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Content Section - flex-1 and overflow-y-auto */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        {/* Training Details Section */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {/* Employer Details */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Employer: {training.employer?.company_name}</span>
          </div>

          {/* Vacancies */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Vacancies: {training.slots || "Not specified"}</span>
          </div>

          {/* Expiration Date */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <CalendarTodayIcon fontSize="small" />
            <span>Expires: {training.expiration_date ? new Date(training.expiration_date).toLocaleDateString() : "Not specified"}</span>
          </div>
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

      {/* Footer Action - flex-shrink-0 */}
      <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onEnroll}
          disabled={isLoading || isTrainingEnrolled}
          className={`h-12 rounded-xl font-semibold text-sm ${
            isTrainingEnrolled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } ${isMobile ? 'mb-safe' : ''}`}
        >
          {isLoading ? 'Loading...' : isTrainingEnrolled ? 'Enrolled' : 'Enroll Now'}
        </Button>
      </div>
    </div>
  );
};

export default SavedTrainingsView;
