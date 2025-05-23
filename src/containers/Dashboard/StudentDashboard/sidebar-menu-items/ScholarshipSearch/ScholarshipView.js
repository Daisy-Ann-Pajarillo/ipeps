import React, { useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Button, Divider } from "@mui/material";

const ScholarshipView = ({
  scholarship,
  isSaved,
  isApplied,
  onSave,
  onApply,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipStatus, setScholarshipStatus] = useState({
    is_saved: false,
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
      is_saved: isSaved || false,
      is_applied: isApplied || false,
      application_status: null,
    });
  }, [scholarship.employer_scholarshippost_id]);

  // Update saved status when props change
  useEffect(() => {
    setScholarshipStatus((prev) => ({
      ...prev,
      is_saved: isSaved || false,
    }));
  }, [isSaved]);

  // Update applied status when props change
  useEffect(() => {
    setScholarshipStatus((prev) => ({
      ...prev,
      is_applied: isApplied || false,
    }));
  }, [isApplied]);

  // Check scholarship status from the backend
  useEffect(() => {
    const checkScholarshipStatus = async () => {
      if (!scholarship?.employer_scholarshippost_id || !auth?.token) return;

      try {
        const response = await axios.post(
          "/api/check-scholarship-status",
          {
            employer_scholarshippost_id:
              scholarship.employer_scholarshippost_id,
          },
          { auth: { username: auth.token } }
        );

        if (response.data.success) {
          setScholarshipStatus((prev) => ({
            ...prev,
            is_applied: response.data.is_applied,
            application_status: response.data.application_status,
          }));
        }
      } catch (error) {
        console.error("Error checking scholarship status:", error);
      }
    };

    checkScholarshipStatus();
  }, [scholarship.employer_scholarshippost_id, auth.token]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(); // Use the parent's save handler
      // No toast notification here - let the parent component handle it
    } catch (error) {
      console.error("Error saving scholarship:", error);
      toast.error(
        error.response?.data?.message || "Failed to save the scholarship",
        {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (scholarshipStatus.is_applied) {
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
      await onApply(); // Use the parent's apply handler

      // Update local state immediately for UI responsiveness
      setScholarshipStatus((prev) => ({
        ...prev,
        is_applied: true,
      }));
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      toast.error("Failed to apply for scholarship", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-160px)] overflow-hidden w-full">
      {/* Header Section - Unified with JobView */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-100 dark:bg-teal-900/30 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={scholarship.companyImage || "http://bij.ly/4ib59B1"}
                alt={scholarship.scholarship_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Typography
                variant="h5"
                className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mt-2"
              >
                {scholarship.scholarship_title}
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1"
              >
                {scholarship.company_name}
              </Typography>
            </div>
          </div>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className={`min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm ${
              isSaved
                ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Scholarship Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">
              {scholarship.city_municipality}, {scholarship.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">
              {scholarship.scholarship_type || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <PaymentIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">
              {scholarship.reward_type || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CalendarTodayIcon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <span className="text-sm sm:text-base">
              {scholarship.deadline
                ? `Deadline: ${new Date(scholarship.deadline).toLocaleDateString()}`
                : "No deadline specified"}
            </span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Scholarship Description */}
        <Typography
          variant="h6"
          className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg"
        >
          Scholarship Description
        </Typography>
        <Typography className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-sm sm:text-base">
          {scholarship.scholarship_description}
        </Typography>

        {/* Requirements Section */}
        {scholarship.requirements && (
          <>
            <Typography
              variant="h6"
              className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg"
            >
              Requirements
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {scholarship.requirements.split(",").map((requirement, index) => (
                <span
                  key={index}
                  className="text-teal-700 dark:text-teal-300 text-xs sm:text-sm bg-teal-50 dark:bg-teal-900/30 rounded-full px-3 py-1"
                >
                  {requirement.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onApply}
          disabled={isLoading || isApplied}
          className={`h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base ${
            isApplied
              ? "bg-green-600 hover:bg-green-700"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {isLoading ? "Loading..." : isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipView;
