import React, { useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Button } from "@mui/material";

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
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full">
      {/* Header Section - Unified */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-100 dark:bg-teal-900 rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={scholarship.logo || "http://bij.ly/4ib59B1"}
                alt={scholarship.scholarship_title}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            <div>
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base"
              >
                {scholarship.scholarship_title}
              </Typography>
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm"
              >
                {scholarship.employer?.full_name}
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
        {/* Scholarship Description */}
        <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
          Scholarship Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4 sm:mb-6 text-xs sm:text-base">
          {scholarship.scholarship_description || "No description available"}
        </Typography>

        {/* Scholarship Details */}
        {(scholarship.scholarship_type ||
          scholarship.experience_level ||
          scholarship.deadline) && (
          <div className="mb-4 sm:mb-6">
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Scholarship Details
            </Typography>
            <div className="space-y-2">
              {scholarship.scholarship_type && (
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                  <span className="font-medium">Type:</span>{" "}
                  {scholarship.scholarship_type}
                </div>
              )}
              {scholarship.experience_level && (
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                  <span className="font-medium">Level:</span>{" "}
                  {scholarship.experience_level}
                </div>
              )}
              {scholarship.deadline && (
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Section (if available) */}
        {scholarship.eligibility && (
          <div className="mb-4 sm:mb-6">
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Eligibility Criteria
            </Typography>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {scholarship.eligibility.split(",").map((criteria, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs sm:text-base"
                >
                  {criteria.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          disabled={isLoading || scholarshipStatus.is_applied}
          className={`h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base ${
            scholarshipStatus.is_applied
              ? "bg-green-500 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Loading..." : scholarshipStatus.is_applied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipView;
