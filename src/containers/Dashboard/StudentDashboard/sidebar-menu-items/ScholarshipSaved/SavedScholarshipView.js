import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Typography, Button } from "@mui/material";

const SavedScholarshipsView = ({
  scholarship = {},
  isApplied = false,
  onApply = () => {},
  onRemoveSaved = () => {},
  onScholarshipStatusChanged = () => {},
}) => {
  const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved scholarship
  const [isScholarshipApplied, setIsScholarshipApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Update isScholarshipApplied when the isApplied prop changes
  useEffect(() => {
    if (isApplied !== undefined) {
      setIsScholarshipApplied(isApplied);
    }
  }, [isApplied]);

  // Check if scholarship is already applied
  useEffect(() => {
    const checkScholarshipStatus = async () => {
      if (!scholarship?.employer_scholarshippost_id || !auth?.token) return;

      try {
        setIsLoading(true);

        // Check scholarship status using the correct endpoint
        const response = await axios.post(
          "/api/check-scholarship-status",
          {
            employer_scholarshippost_id:
              scholarship.employer_scholarshippost_id,
          },
          { auth: { username: auth.token } }
        );

        if (response.data.success) {
          // Update application status without changing saved status
          setIsScholarshipApplied(response.data.is_applied);
          setApplicationStatus(response.data.application_status);
        }
      } catch (error) {
        console.error("Error checking scholarship application status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkScholarshipStatus();
  }, [scholarship.employer_scholarshippost_id, auth.token]);

  // Format amount with commas for better readability
  const formatAmount = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };

  const handleApply = async () => {
    if (isScholarshipApplied) {
      toast.info("You have already applied for this scholarship");
      return;
    }

    try {
      setIsLoading(true);

      // Check scholarship status first to prevent duplicate applications
      const checkResponse = await axios.post(
        "/api/check-scholarship-status",
        {
          employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
        },
        { auth: { username: auth.token } }
      );

      if (checkResponse.data.is_applied) {
        setIsScholarshipApplied(true);
        toast.info("You have already applied for this scholarship");
        return;
      }

      // Apply for the scholarship
      const response = await axios.post(
        "/api/apply-scholarships",
        {
          employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
        },
        { auth: { username: auth.token } }
      );

      setIsScholarshipApplied(true);
      onApply(); // Call the parent component's onApply function
      onScholarshipStatusChanged(); // Notify parent that scholarship status changed

      toast.success("Successfully applied to scholarship");
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      if (
        error.response?.data?.error ===
        "You have already applied for this scholarship"
      ) {
        setIsScholarshipApplied(true);
        toast.info("You have already applied for this scholarship");
      } else {
        toast.error(
          error.response?.data?.error || "Failed to apply for scholarship"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setIsLoading(true);

      // Use the save-scholarship endpoint which toggles saved status
      await axios.post(
        "/api/save-scholarship",
        {
          employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
        },
        { auth: { username: auth.token } }
      );

      setIsSaved(false);
      onRemoveSaved(); // Call the parent's remove function
      // No toast here - the parent component will handle showing the toast
    } catch (error) {
      console.error("Error removing saved scholarship:", error);
      toast.error(
        error.response?.data?.error || "Failed to remove saved scholarship"
      );
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
              {scholarship.amount && (
                <Typography
                  variant="body2"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Amount: ₱{scholarship.amount?.toLocaleString()}
                </Typography>
              )}
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm"
              >
                {scholarship.employer?.full_name}
              </Typography>
            </div>
          </div>
          <Button
            onClick={onRemoveSaved}
            disabled={isLoading}
            className="min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100"
            startIcon={<BookmarkIcon />}
          >
            Remove
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
        {(scholarship.scholarship_type || scholarship.deadline) && (
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
              {scholarship.deadline && (
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
              )}
              {scholarship.application_status && (
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                  <span className="font-medium">Application Status:</span>{" "}
                  <span
                    className={
                      scholarship.application_status === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {scholarship.application_status.charAt(0).toUpperCase() +
                      scholarship.application_status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Information */}
        {(scholarship.country || scholarship.city_municipality) && (
          <div className="mb-4 sm:mb-6">
            <Typography variant="h6" className="font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
              Location
            </Typography>
            <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-base">
              {[scholarship.city_municipality, scholarship.country]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
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
              ? "bg-green-500 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Loading..." : isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default SavedScholarshipsView;
