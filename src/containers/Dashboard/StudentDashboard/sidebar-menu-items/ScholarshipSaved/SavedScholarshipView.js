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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full flex flex-col">
      {/* Colored Header Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-t-xl" />

      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={scholarship.logo || "http://bij.ly/4ib59B1"}
                alt={scholarship.scholarship_title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 dark:text-white"
              >
                {scholarship.scholarship_title}
              </Typography>
              {scholarship.amount && (
                <Typography
                  variant="body2"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Amount: ₱{formatAmount(scholarship.amount)}
                </Typography>
              )}
            </div>
          </div>

          <Button
            onClick={handleUnsave}
            disabled={isLoading}
            className="min-w-[100px] bg-red-50 text-red-600 hover:bg-red-100"
            startIcon={<BookmarkIcon />}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Scholarship Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Scholarship Description
          </h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {scholarship.scholarship_description || "No description available"}
          </p>
        </div>

        {/* Scholarship Details */}
        {(scholarship.scholarship_type || scholarship.deadline) && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Scholarship Details
            </h4>
            <div className="space-y-2">
              {scholarship.scholarship_type && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Type:</span>{" "}
                  {scholarship.scholarship_type}
                </p>
              )}
              {scholarship.deadline && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </p>
              )}
              {applicationStatus && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Application Status:</span>{" "}
                  <span
                    className={
                      applicationStatus === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {applicationStatus.charAt(0).toUpperCase() +
                      applicationStatus.slice(1)}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Location Information */}
        {(scholarship.country || scholarship.city_municipality) && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Location
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {[scholarship.city_municipality, scholarship.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Footer Action - Only Apply Button */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          disabled={isLoading || isScholarshipApplied}
          className={`h-12 rounded-xl font-semibold ${
            isScholarshipApplied
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Loading..." : isScholarshipApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default SavedScholarshipsView;
