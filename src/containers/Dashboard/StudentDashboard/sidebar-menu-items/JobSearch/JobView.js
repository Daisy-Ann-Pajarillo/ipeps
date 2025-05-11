import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../../../axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const JobView = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Reset states when job changes
  useEffect(() => {
    if (job) {
      setIsSaved(false);
      setIsApplied(false);
      setIsLoading(true);
    }
  }, [job?.job_id]);

  // Check job status
  useEffect(() => {
    const checkJobStatus = async () => {
      if (!job?.job_id || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if job is saved
        const savedResponse = await axios.post(
          "/api/check-already-saved",
          { employer_jobpost_id: job.job_id },
          { auth: { username: auth.token } }
        );
        setIsSaved(savedResponse.data.is_saved);

        // Check if job is applied
        const appliedResponse = await axios.post(
          "/api/check-already-applied",
          { job_id: job.job_id },
          { auth: { username: auth.token } }
        );
        setIsApplied(appliedResponse.data.already_applied);
      } catch (error) {
        console.error("Error checking job status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkJobStatus();
  }, [job?.job_id, auth?.token]);

  // Render loading or no job selected state
  if (!job) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No job selected
        </Typography>
      </Box>
    );
  }

  const handleApply = async () => {
    // Don't proceed if already applied
    if (isApplied) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/apply-job",
        {
          employer_jobpost_id: job.job_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsApplied(true);
      toast.success(response.data.message || "Successfully applied to the job");
    } catch (error) {
      console.error("Error applying job:", error);
      if (error.response?.data?.is_applied) {
        setIsApplied(true);
        toast.info("You have already applied for this job");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to apply for the job"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/saved-jobs",
        {
          employer_jobpost_id: job.job_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsSaved(response.data.is_saved);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(error.response?.data?.message || "Failed to save the job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={job.companyImage || "http://bij.ly/4ib59B1"}
                alt={job.company || job.job_title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {job.job_title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {job.employer?.company_name}
              </Typography>
            </div>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={`min-w-[100px] ${
              isSaved 
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Job Details Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <LocationOnIcon fontSize="small" />
            <span>{job.city_municipality}, {job.country}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <WorkIcon fontSize="small" />
            <span>{job.job_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <SchoolIcon fontSize="small" />
            <span>{job.experience_level || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <BusinessCenterIcon fontSize="small" />
            <span>Vacancies: {job.no_of_vacancies || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <PaymentIcon fontSize="small" />
            <span>₱{job.estimated_salary_from?.toLocaleString()} - ₱{job.estimated_salary_to?.toLocaleString()}</span>
          </div>
          {job.expiration_date && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CalendarTodayIcon fontSize="small" />
              <span>Expires: {new Date(job.expiration_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Divider className="my-6" />

        {/* Job Description */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
          Job Description
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">
          {job.job_description}
        </Typography>

        {/* Required Skills Section */}
        {job.other_skills && (
          <>
            <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
              Required Skills
            </Typography>
            <div className="flex flex-wrap gap-2">
              {job.other_skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6"                
                  >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Action */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          disabled={isLoading || isApplied}
          className={`h-12 rounded-xl font-semibold ${
            isApplied
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : isApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

export default JobView;
