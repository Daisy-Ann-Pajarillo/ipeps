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

  // Format salary with commas for better readability
  const formatSalary = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };

  // Load authentication state
  useEffect(() => {
    console.log("Auth effect running");
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      console.log("Auth token available, loading data");
      loadSavedJobs();
      loadAppliedJobs();
    } else {
      console.log("No auth token yet");
    }
  }, [auth.token]);

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
        console.log("Fetching saved jobs");
        const response = await axios.get("/api/get-saved-jobs", {
          auth: { username: auth.token },
        });

        console.log("Saved jobs response:", response.data);

        if (response.data.success && Array.isArray(response.data.jobs)) {
          console.log("Processing jobs array:", response.data.jobs);
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
              full_name: job.employer?.full_name || job.employer?.first_name + " " + job.employer?.last_name,
              company_name: job.employer?.company_name
            },
          }));

          console.log("Transformed jobs:", jobs);
          setSavedJobs(jobs);
          // Only auto-select first job on desktop
          const isDesktop = window.innerWidth >= 1024;
          if (jobs.length > 0 && !selectedJob && isDesktop) {
            console.log("Auto-selecting first job:", jobs[0]);
            setSelectedJob(jobs[0]);
          }
        } else {
          console.log("No saved jobs found or invalid response format");
          setSavedJobs([]);
          setSelectedJob(null);
        }
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
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
      
      {/* Header Section */}      
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20 flex-shrink-0">
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

      {/* Search Section */}
      <div className="flex-shrink-0 w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e]">
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
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="Most Recent">Recent</option>
          <option value="Salary">Salary</option>
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden">
        {/* Job List Section */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4" style={{ height: 'calc(100vh - 180px)' }}>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2">
                <img src={logoNav} alt="IPEPS Logo" className="w-16 h-16 sm:w-24 sm:h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Loading saved jobs...
                </Typography>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2">
                <BookmarkIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                <Typography variant="h6" className="text-gray-600 dark:text-gray-400">
                  No saved jobs found
                </Typography>
                <Typography variant="body2" className="text-gray-500 dark:text-gray-500">
                  {searchQuery ? "Try adjusting your search" : "Start saving jobs you're interested in"}
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Job Cards */}
                {filteredJobs.map((job) => (
                  <div
                    key={job.saved_job_id}
                    onClick={() => handleSelectJob(job)}
                    className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex gap-3 items-center ${
                      selectedJob?.saved_job_id === job.saved_job_id ? 'ring-2 ring-blue-400 border-blue-500' : ''
                    }`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={job.companyImage || 'http://bij.ly/4ib59B1'}
                        alt={job.job_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{job.job_title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{job.country} • {job.city_municipality}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{job.job_type} • {job.experience_level}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">💰 {formatSalary(job.estimated_salary_from)} - {formatSalary(job.estimated_salary_to)}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">🏢 {job.employer?.company_name || 'Unknown Company'}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">👤 {job.employer?.full_name || 'N/A'}</div>
                    </div>
                    {appliedJobIds.includes(job.employer_jobpost_id) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        Applied
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Job View */}
        {selectedJob && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 sticky top-4" 
               style={{ zIndex: 1000 }}>
            <SavedJobsView 
              job={selectedJob} 
              onClose={() => setSelectedJob(null)} 
              onRemoveSaved={() => handleRemoveFromSaved(selectedJob.saved_job_id)}
              isApplied={appliedJobIds.includes(selectedJob.employer_jobpost_id)}
              onApply={() => handleApplyJob(selectedJob.employer_jobpost_id)}
              onJobStatusChanged={loadAppliedJobs}
            />
          </div>
        )}

        {/* Mobile Job View */}
        {selectedJob && (
          <div 
            className="lg:hidden fixed inset-0"
            style={{ zIndex: Number.MAX_SAFE_INTEGER }}
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              style={{ 
                position: 'fixed',
                zIndex: Number.MAX_SAFE_INTEGER,
                pointerEvents: 'auto'
              }}
            >
              <div className="fixed inset-0 overflow-hidden">
                <div className="fixed inset-0" onClick={() => setSelectedJob(null)} />
                <div 
                  className="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0"
                  style={{ 
                    zIndex: Number.MAX_SAFE_INTEGER,
                    pointerEvents: 'auto'
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                    <div 
                      className="absolute right-4 top-4"
                      style={{ zIndex: Number.MAX_SAFE_INTEGER }}
                    >
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <SavedJobsView
                      job={selectedJob}
                      isMobile={true}
                      onClose={() => setSelectedJob(null)}
                      onRemoveSaved={() => handleRemoveFromSaved(selectedJob.saved_jobpost_id)}
                      isApplied={appliedJobIds.includes(selectedJob.employer_jobpost_id)}
                      onApply={() => handleApplyJob(selectedJob.employer_jobpost_id)}
                      onJobStatusChanged={loadAppliedJobs}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;