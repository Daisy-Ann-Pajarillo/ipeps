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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden">
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

            </div>
          </div>

          <Button
            onClick={onSave}
            disabled={isLoading}
            className={`min-w-[100px] ${
              isSaved
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isSaved ? "Saved" : "Save"}
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
        {(scholarship.scholarship_type ||
          scholarship.experience_level ||
          scholarship.deadline) && (
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
              {scholarship.experience_level && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Level:</span>{" "}
                  {scholarship.experience_level}
                </p>
              )}
              {scholarship.deadline && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Section (if available) */}
        {scholarship.eligibility && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eligibility Criteria
            </h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.eligibility.split(",").map((criteria, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm"
                >
                  {criteria.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action - Only Apply Button */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={onApply}
          disabled={isLoading || isApplied}
          className={`h-12 rounded-xl font-semibold ${
            isApplied
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Loading..." : isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipView;
