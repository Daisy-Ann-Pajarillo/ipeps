import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SavedScholarshipsView = ({
  scholarship = {},
  isApplied = false,
  onApply = () => { },
  onRemoveSaved = () => { },
  onScholarshipStatusChanged = () => { },
}) => {
  const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved scholarship
  const [isScholarshipApplied, setIsScholarshipApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Update isScholarshipApplied when the isApplied prop changes
  useEffect(() => {
    setIsScholarshipApplied(isApplied);
  }, [isApplied]);

  // Check if scholarship is already applied
  useEffect(() => {
    const checkScholarshipStatus = async () => {
      if (!scholarship?.employer_scholarshippost_id || !auth?.token) return;

      try {
        setIsLoading(true);

        // Check if scholarship is applied
        const appliedResponse = await axios.post(
          "/api/check-already-applied-scholarship",
          { scholarship_id: scholarship.employer_scholarshippost_id },
          { auth: { username: auth.token } }
        );

        setIsScholarshipApplied(appliedResponse.data.already_applied);
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
    try {
      setIsLoading(true);

      const response = await axios.post(
        "/api/apply-scholarship",
        {
          employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsScholarshipApplied(true);

      onApply(); // Call the parent component's onApply function
      onScholarshipStatusChanged(); // Notify parent that scholarship status changed

      toast.success(response.data.message || "Successfully applied to scholarship");
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      if (error.response?.data?.is_applied) {
        setIsScholarshipApplied(true);
        toast.info("You have already applied for this scholarship");
      } else {
        toast.error(error.response?.data?.message || "Failed to apply for scholarship");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setIsLoading(true);

      await axios.post(
        "/api/saved-scholarships",
        {
          employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsSaved(false);
      onRemoveSaved(); // Call the parent's remove function
    } catch (error) {
      console.error("Error removing saved scholarship:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove saved scholarship"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <ToastContainer />

      {/* Scholarship Logo */}
      <div className="h-64 bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
        <img
          src={scholarship.logo || "http://bij.ly/4ib59B1"}
          alt={`Logo of ${scholarship.scholarship_title || "Scholarship"}`}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-6">
        {/* Scholarship Title and Organization */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          {scholarship.scholarship_title || "Scholarship Title"}
        </h2>
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleApply}
            disabled={isLoading || isScholarshipApplied}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-white transition ${isScholarshipApplied
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? "Loading..."
              : isScholarshipApplied
                ? "Already Applied"
                : "Apply"}
          </button>

          <button
            onClick={handleUnsave}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {isLoading ? (
              "..."
            ) : (
              <>
                <BookmarkIcon className="w-5 h-5 text-blue-500" />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 dark:border-gray-600 mb-6" />

        {/* Scholarship Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Scholarship Description
          </h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {scholarship.scholarship_description || "No description available"}
          </p>
        </div>

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
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {criteria.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedScholarshipsView;