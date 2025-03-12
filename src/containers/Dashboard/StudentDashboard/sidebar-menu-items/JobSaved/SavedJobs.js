import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedJobsView from "./SavedJobsView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedJobs = () => {
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
      toast.error(error.response?.data?.message || "Failed to load saved jobs");
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

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <ToastContainer />

      {/* Search Bar */}
      <SearchData
        placeholder="Search saved jobs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          {
            title: "Sort By",
            options: ["", "Most Recent", "Salary", "Company Name"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setSortBy(value);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - Job List */}
        <div
          className={`${
            selectedJob ? "w-3/5" : "w-full"
          } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700`}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {sortedJobs.length} saved jobs
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                Loading saved jobs...
              </p>
            </div>
          ) : sortedJobs.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No saved jobs found
              </p>
            </div>
          ) : (
            sortedJobs.map((job) => (
              <div
                key={job.saved_job_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${
                  selectedJob?.saved_job_id === job.saved_job_id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() => handleSelectJob(job)}
              >
                <div className="flex gap-3">
                  {/* Company Logo */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={job.companyImage || "http://bij.ly/4ib59B1"}
                      alt={job.job_title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {job.job_title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {job.country} • {job.city_municipality}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {job.job_type} • {job.experience_level}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      💰 {job.estimated_salary_from} - {job.estimated_salary_to}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="text-red-500 hover:text-red-700 self-start"
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

        {/* Right Panel - Job Details */}
        {selectedJob && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <SavedJobsView
              job={selectedJob}
              isApplied={appliedJobIds.includes(
                selectedJob.employer_jobpost_id
              )}
              onApply={() => handleApplyJob(selectedJob.employer_jobpost_id)}
              onRemoveSaved={() =>
                handleRemoveFromSaved(selectedJob.employer_jobpost_id)
              }
              onJobStatusChanged={() => {
                loadSavedJobs();
                loadAppliedJobs();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
