import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this import
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedJobsView from "./SavedJobsView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Button } from "@mui/material"; // Changed from @material-tailwind/react to @mui/material
import logoNav from '../../../../Home/images/logonav.png';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-lg flex flex-col items-center text-center">
        {/* To adjust header and search bar size for mobile, change px-4/py-6 and text sizes below */}
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          My Saved Jobs
        </Typography>
        <Typography variant="subtitle1" className="text-blue-100 mb-4 text-xs sm:text-base md:text-lg">
          Review and manage your bookmarked opportunities
        </Typography>

        {/* Search & Filter Section - Smaller */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-12 sm:-mb-16 md:-mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Salary">Salary</option>
              <option value="Company Name">Company Name</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row p-2 sm:p-4 md:p-8 pt-8 sm:pt-12 md:pt-14 gap-6 md:gap-8">
        {/* MOBILE: To adjust mobile layout, change p-2/sm:p-4 and gap-6 as needed */}
        {/* Job Details (top on mobile, right on desktop) */}
        {selectedJob && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <SavedJobsView
              job={selectedJob}
              isApplied={appliedJobIds.includes(selectedJob.employer_jobpost_id)}
              onApply={() => handleApplyJob(selectedJob.employer_jobpost_id)}
              onRemoveSaved={() => handleRemoveFromSaved(selectedJob.employer_jobpost_id)}
              onJobStatusChanged={() => {
                loadSavedJobs();
                loadAppliedJobs();
              }}
            />
          </div>
        )}
        {/* Job List */}
        <div className={`${selectedJob ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {sortedJobs.length} saved jobs
            </Typography>
          </div>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
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
      </div>
    </div>
  );
};

export default SavedJobs;