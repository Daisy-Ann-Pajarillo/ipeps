import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this import
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedJobsView from "./SavedJobsView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Button } from "@mui/material"; // Changed from @material-tailwind/react to @mui/material
import logoNav from '../../../../Home/images/logonav.png';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';

// Add loading animation styles
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

const SavedJobs = () => {
  const navigate = useNavigate(); // Add this hook
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load applied jobs to check which jobs the user has already applied for
  const loadAppliedJobs = async () => {
    try {
      if (auth.token) {
        const response = await axios.get("/api/get-applied-jobs", {
          auth: { username: auth.token },
        });
        if (
          response.data.success &&
          Array.isArray(response.data.applications)
        ) {
          // Extract just the job IDs from applied jobs
          const appliedIds = response.data.applications.map(
            (app) => app.job_posting_id
          );
          setAppliedJobIds(appliedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  // Load saved jobs
  const loadSavedJobs = async () => {
    try {
      setIsLoading(true);
      if (auth.token) {
        const response = await axios.get("/api/get-saved-jobs", {
          auth: { username: auth.token },
        });

        if (response.data.success && Array.isArray(response.data.jobs)) {
          // Map backend data to component format
          const jobs = response.data.jobs.map((job) => ({
            saved_job_id: job.saved_job_id,
            employer_jobpost_id: job.employer_jobpost_id,
            job_id: job.employer_jobpost_id, // Add job_id field for compatibility
            job_title: job.job_title,
            job_description: job.job_description,
            job_type: job.job_type,
            experience_level: job.experience_level,
            estimated_salary_from: job.estimated_salary_from,
            estimated_salary_to: job.estimated_salary_to,
            no_of_vacancies: job.no_of_vacancies,
            country: job.country,
            city_municipality: job.city_municipality,
            other_skills: job.other_skills,
            created_at: job.created_at,
            expiration_date: job.expiration_date,
            company: job.employer?.company_name || "N/A",
            companyImage: job.employer?.logo_url || "http://bij.ly/4ib59B1",
            employer: {
              full_name: job.employer?.full_name || "Unknown Employer",
            },
          }));

          setSavedJobs(jobs);
          if (jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs[0]);
          }
        } else {
          setSavedJobs([]);
          setSelectedJob(null);
        }
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadSavedJobs();
      loadAppliedJobs();
    }
  }, [auth.token]);

  // Filter jobs based on search query
  const filteredJobs = savedJobs.filter(
    (job) =>
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city_municipality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort jobs based on selected option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "Company Name") {
      return (a.company || "").localeCompare(b.company || "");
    } else if (sortBy === "Salary") {
      return (b.estimated_salary_from || 0) - (a.estimated_salary_from || 0);
    }
    return 0;
  });

  // Handle job application
  const handleApplyJob = async (jobId) => {
    try {
      const response = await axios.post(
        "/api/apply-job",
        {
          employer_jobpost_id: jobId,
        },
        {
          auth: { username: auth.token },
        }
      );
      if (response.data.success) {
        toast.success("Successfully applied to job");
        // Update the applied jobs list
        setAppliedJobIds([...appliedJobIds, jobId]);
        // Refresh saved jobs to get updated status
        loadSavedJobs();
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  // Handle job removal from saved jobs
  const handleRemoveFromSaved = async (jobId) => {
    try {
      await axios.post(
        "/api/saved-jobs",
        {
          employer_jobpost_id: jobId,
        },
        {
          auth: { username: auth.token },
        }
      );
      const updatedJobs = savedJobs.filter(
        (job) => job.employer_jobpost_id !== jobId
      );
      setSavedJobs(updatedJobs);
      if (selectedJob?.employer_jobpost_id === jobId) {
        setSelectedJob(updatedJobs[0] || null);
      }
      toast.success("Job removed from saved");
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove job from saved list"
      );
    }
  };

  // Handle job selection for detailed view
  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  // Add styles to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (      
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}      
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <BookmarkIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Saved Jobs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your bookmarked jobs</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Saved Jobs</span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}      
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e]">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="Most Recent">Recent</option>
          <option value="Salary">Salary</option>
        </select>
      </div>      {/* Main Content: Job List & Job View */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Job List Section - vertical scroll, mobile friendly */}
        <div className="flex-1 flex flex-col min-w-0">

         
          <div className="flex justify-between items-center mb-2 px-1">
             {/*
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {sortedJobs.length} saved jobs
            </Typography>

            */}
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4" style={{maxHeight: 'calc(100vh - 180px)', paddingBottom: selectedJob ? '10px' : '0' }}>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Saved Jobs...
                </Typography>
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No saved jobs found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard/job-search')}
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-base"
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              sortedJobs.map((job) => (
                <div
                  key={job.saved_job_id}
                  onClick={() => handleSelectJob(job)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedJob?.saved_job_id === job.saved_job_id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    {/* Company Logo */}
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={job.companyImage || "http://bit.ly/4ib59B1"}
                        alt={job.job_title}
                        className="w-full h-full object-contain p-1 sm:p-2"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "8px",
                        }}
                      />
                    </div>
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {job.job_title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {job.country} • {job.city_municipality}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {job.job_type} • {job.experience_level}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        💰 {job.estimated_salary_from} - {job.estimated_salary_to}
                      </div>
                      {/* Posted By Employer */}
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {"Posted By: " + (job.employer?.full_name || "N/A")}
                      </div>
                    </div>
                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-red-700 self-start text-base sm:text-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(job.employer_jobpost_id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>        
        {/* Job Details Section - Matching JobView.js */}        
        {selectedJob && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8">
            <SavedJobsView job={selectedJob} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;