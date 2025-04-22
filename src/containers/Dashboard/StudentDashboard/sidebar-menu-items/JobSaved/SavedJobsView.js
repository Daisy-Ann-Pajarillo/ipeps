import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SavedJobsView = ({
  job = {},
  isApplied = false,
  onApply = () => { },
  onRemoveSaved = () => { },
  onJobStatusChanged = () => { },
}) => {
  const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved job
  const [isJobApplied, setIsJobApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Update isJobApplied when the isApplied prop changes
  useEffect(() => {
    setIsJobApplied(isApplied);
  }, [isApplied]);

  // Check if job is already applied
  useEffect(() => {
    const checkJobStatus = async () => {
      if (!job?.employer_jobpost_id || !auth?.token) return;

      try {
        setIsLoading(true);

        // Check if job is applied
        const appliedResponse = await axios.post(
          "/api/check-already-applied",
          { job_id: job.employer_jobpost_id },
          { auth: { username: auth.token } }
        );

        setIsJobApplied(appliedResponse.data.already_applied);
      } catch (error) {
        console.error("Error checking job application status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkJobStatus();
  }, [job.employer_jobpost_id, auth.token]);

  // Format salary with commas for better readability
  const formatSalary = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };

  const handleApply = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/apply-job",
        {
          employer_jobpost_id: job.employer_jobpost_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsJobApplied(true);

      onApply(); // Call the parent component's onApply function
      onJobStatusChanged(); // Notify parent that job status changed

      toast.success(response.data.message || "Successfully applied to job");
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error.response?.data?.is_applied) {
        setIsJobApplied(true);
        toast.info("You have already applied for this job");
      } else {
        toast.error(error.response?.data?.message || "Failed to apply for job");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setIsLoading(true);

      await axios.post(
        "/api/saved-jobs",
        {
          employer_jobpost_id: job.employer_jobpost_id,
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
      console.error("Error removing saved job:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove saved job"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <ToastContainer />

      {/* Company Image */}
      <div className="h-64 bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
        <img
          src={job.companyImage || "http://bij.ly/4ib59B1"}
          alt={`Logo of ${job.company || "Company"}`}
          className="w-full h-full object-contain p-4"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "16px",
          }}
        />
      </div>

      <div className="p-6">
        {/* Job Title and Company */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          {job.job_title || "Job Title"}
        </h2>
        <h3 className="text-xl text-blue-600 dark:text-blue-400 mb-3">
          {job.company || job.employer?.company_name || "Company"}
        </h3>
        <h4 className="text-lg text-gray-700 dark:text-gray-300 mb-3">
          {job.country || "Country"}, {job.city_municipality || "City"}
        </h4>

        {/* Job Details */}
        <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <p>💼 {job.job_type || "Job Type"}</p>
          <p>🧠 {job.experience_level || "Experience Level"}</p>
          <p>👥 Vacancies: {job.no_of_vacancies || 0}</p>
          <p>
            💰 ${formatSalary(job.estimated_salary_from)} - $
            {formatSalary(job.estimated_salary_to)}
          </p>
          {job.expiration_date && (
            <p>
              📅 Expires: {new Date(job.expiration_date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleApply}
            disabled={isLoading || isJobApplied}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-white transition ${isJobApplied
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? "Loading..."
              : isJobApplied
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

        {/* Work Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Work Description
          </h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {job.job_description || "No description available"}
          </p>
        </div>

        {/* Skills Section (if available) */}
        {job.other_skills && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.other_skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsView;
