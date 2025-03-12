import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

const JobView = ({
  job,
  initialIsSaved = false,
  initialIsApplied = false,
  canWithdraw = false,
  applicationTime = null,
  onSave,
  onApply,
  job_id,
}) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isApplied, setIsApplied] = useState(initialIsApplied);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const getTimeRemaining = () => {
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = applicationTime + 24 * 60 * 60 * 1000 - now;
    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleApply = async () => {
    try {
      const response = await axios.post("/api/saved-jobs", {
        employer_jobpost_id: job_id,
      });
      setIsApplied(true);
      toast.success("Job application submitted successfully!");
      onApply?.();
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply for job.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "/api/saved-jobs",
        {
          employer_jobpost_id: job_id,
        },
        {
          auth: { username: auth.token },
        }
      );

      setIsSaved(
        response.data.message === "Saved job added successfully" ? true : false
      );
      console.log(isSaved, "is saved", response, "response");
      toast.success(
        isSaved ? "Job saved successfully!" : "Job removed from saved jobs!"
      );
      onSave?.();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(
        "Error saving job: " + (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      try {
        const response = await axios.post(
          "/api/check-already-applied",
          { job_id: job_id },
          { auth: { username: auth.token } }
        );
        setIsSaved(response.data.already_saved);
        setIsApplied(response.data.already_applied);
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    };

    if (job_id) checkAlreadyApplied();
  }, [job_id, auth.token]);

  console.log(isSaved);
  return (
    <div className="h-full relative dark:bg-gray-900">
      <ToastContainer />
      <div className="h-full overflow-y-auto p-6">
        {/* Company Logo */}
        <div className="flex justify-center items-center mb-6 h-72 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg">
          <img
            src={job.companyImage || "default-company-image.png"}
            alt={job.company}
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* Job Details */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          {job.job_title}
        </h2>
        <h3 className="text-xl font-medium mb-4 text-blue-600 dark:text-blue-400">
          {job.country}
        </h3>

        <div className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
          <p>📍 {job.city_municipality}</p>
          <p>💼 {job.job_type}</p>
          <p>👥 Vacancies: {job.no_of_vacancies}</p>
          <p>
            💰 {job.estimated_salary_from} - {job.estimated_salary_to}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mb-6">
          {/* Apply Button */}
          <button
            onClick={handleApply}
            className={`flex-1 px-4 py-2 text-white rounded-lg ${
              isApplied
                ? canWithdraw
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isApplied
              ? canWithdraw
                ? "Withdraw Application"
                : "Already Applied"
              : "Apply"}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {isSaved ? (
              <BookmarkBorder className="text-gray-500 mr-2" />
            ) : (
              <Bookmark className="text-blue-500 mr-2" />
            )}
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {/* Time Remaining */}
        {isApplied && canWithdraw && (
          <p className="text-center text-sm text-red-500">
            {getTimeRemaining()}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 my-6" />

        {/* Job Description */}
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          Work Description
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {job.job_description}
        </p>
      </div>
    </div>
  );
};

export default JobView;
