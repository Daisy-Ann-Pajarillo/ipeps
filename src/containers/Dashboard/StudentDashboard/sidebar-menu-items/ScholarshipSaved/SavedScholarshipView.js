import React, { useState, useEffect } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as actions from "../../../../../store/actions/index";
import { toast } from "react-toastify";
import axios from "../../../../../axios";
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

const SavedScholarshipsView = ({
  scholarship = {},
  isApplied = false,
  onApply = () => {},
  onRemoveSaved = () => {},
  onScholarshipStatusChanged = () => {},
}) => {
  const [isSaved, setIsSaved] = useState(true);
  const [isScholarshipApplied, setIsScholarshipApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    setIsScholarshipApplied(isApplied);
  }, [isApplied]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={logoNav}
          alt="IPEPS Logo"
          className="w-24 h-24 loading-logo"
        />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading Scholarship...
        </Typography>
      </div>
    );
  }

  const handleApply = async () => {
    if (isScholarshipApplied) {
      toast.info("You have already applied for this scholarship", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await onApply();
      setIsScholarshipApplied(true);
      onScholarshipStatusChanged("applied");
    } catch (error) {
      console.error("Error applying for scholarship:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setIsLoading(true);
      await onRemoveSaved();
      setIsSaved(false);
    } catch (error) {
      console.error("Error removing scholarship:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={scholarship.logo || "http://bij.ly/4ib59B1"}
                alt={scholarship.scholarship_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center min-h-[80px]">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl">
                {scholarship.scholarship_title}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-0.5">
                {scholarship.employer?.full_name}
              </Typography>
            </div>
          </div>
          <Button
            onClick={handleUnsave}
            disabled={isLoading}
            className={`min-w-[80px] sm:min-w-[90px] text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100`}
            startIcon={<BookmarkIcon />}
          >
            Saved
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        
        {/* Scholarship Details Section */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span>{scholarship.city_municipality}, {scholarship.country}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <SchoolIcon fontSize="small" />
            <span>{scholarship.scholarship_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
            <PaymentIcon fontSize="small" />
            <span>{scholarship.reward_type || "Not specified"}</span>
          </div>
          {scholarship.deadline && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
              <CalendarTodayIcon fontSize="small" />
              <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Divider className="my-6" />

        {/* Scholarship Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Scholarship Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {scholarship.scholarship_description}
        </Typography>

        {/* Requirements Section */}
        {scholarship.requirements && (
          <>
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Requirements
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {scholarship.requirements.split(",").map((requirement, index) => (
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
      <div className="px-3 sm:px-4 md:px-3 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          disabled={isLoading || isScholarshipApplied}
          className={`h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base ${
            isScholarshipApplied
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? 'Loading...' : isScholarshipApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

export default SavedScholarshipsView;
