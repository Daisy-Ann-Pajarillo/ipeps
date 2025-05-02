import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import JobView from "./JobView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobSearch = ({ isCollapsed }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [employerName, setEmployerName] = useState(""); // Store employer full name

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load applied jobs to know which jobs user has applied to
  const loadAppliedJobs = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-applied-jobs", {
        auth: { username: auth.token },
      });

      if (response.data.success && Array.isArray(response.data.applications)) {
        const appliedIds = response.data.applications.map(
          (application) => application.job_posting_id
        );
        setAppliedJobIds(appliedIds);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        if (auth.token) {
          const response = await axios.get("/api/all-job-postings", {
            auth: { username: auth.token },
          });

          if (
            response.data &&
            Array.isArray(response.data.job_postings)
          ) {
            const jobsData = response.data.job_postings;

            // Extract full_name from the API response
            const fullName =
              response.data.full_name || "Unknown Company";

            setEmployerName(fullName);
            setJobs(jobsData);

            if (jobsData.length > 0 && !selectedJob) {
              setSelectedJob(jobsData[0]);
            }
          } else {
            setJobs([]);
            toast.error("No jobs found or invalid response format");
          }

          await loadAppliedJobs();
        }
      } catch (error) {
        console.error("Error fetching job postings:", error);
        toast.error("Failed to load job postings");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [auth.token]);

  // Filter and sort jobs
  useEffect(() => {
    let updatedJobs = [...jobs];

    // Text search filter
    if (query) {
      updatedJobs = updatedJobs.filter(
        (j) =>
          j.job_title.toLowerCase().includes(query.toLowerCase()) ||
          j.job_description.toLowerCase().includes(query.toLowerCase()) ||
          (j.company &&
            j.company.toLowerCase().includes(query.toLowerCase())) ||
          (j.country &&
            j.country.toLowerCase().includes(query.toLowerCase())) ||
          (j.city_municipality &&
            j.city_municipality.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Experience level filter
    if (entryLevel) {
      updatedJobs = updatedJobs.filter(
        (j) => j.experience_level === entryLevel
      );
    }

    // Job type filter
    if (jobType) {
      updatedJobs = updatedJobs.filter((j) => j.job_type === jobType);
    }

    // Sort options
    if (sortBy === "Most Recent") {
      updatedJobs.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Salary") {
      updatedJobs.sort(
        (a, b) =>
          (b.estimated_salary_from || 0) - (a.estimated_salary_from || 0)
      );
    }

    setFilteredJobs(updatedJobs);

    // If the currently selected job is no longer in the filtered list,
    // either clear the selection or select the first available job
    if (
      selectedJob &&
      !updatedJobs.some((job) => job.job_id === selectedJob.job_id)
    ) {
      if (updatedJobs.length > 0) {
        setSelectedJob(updatedJobs[0]);
      } else {
        setSelectedJob(null);
      }
    }
  }, [query, entryLevel, jobType, sortBy, jobs, selectedJob]);

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j.job_id === jobId);
    setSelectedJob(job);
  };

  // Format salary for display
  const formatSalary = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };

  return (
    <div className="">
      <ToastContainer />

      {/* Search */}
      <SearchData
        placeholder="Find a job..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={3}
        componentData={[
          {
            title: "Experience Level",
            options: ["", "Entry", "Mid-level", "Senior"],
          },
          {
            title: "Job Type",
            options: ["", "Full-time", "Part-time", "Contract", "Internship"],
          },
          {
            title: "Sort By",
            options: ["", "Most Recent", "Salary"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setEntryLevel(value);
          if (index === 1) setJobType(value);
          if (index === 2) setSortBy(value);
        }}
      />

      <div className="flex mt-4">
        {/* Job List */}
        <div
          className={`${selectedJob ? "w-3/5" : "w-full"
            } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700 `}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {filteredJobs.length} jobs found
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                Loading jobs...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No jobs found matching your criteria
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.job_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedJob?.job_id === job.job_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() => handleJobClick(job.job_id)}
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
                      💰 {formatSalary(job.estimated_salary_from)} -{" "}
                      {formatSalary(job.estimated_salary_to)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {"Posted By: " + (job.employer.full_name || 'N/A')}
                    </div>
                  </div>

                  {/* Application Status Indicator */}
                  {appliedJobIds.includes(job.job_id) && (
                    <div className="flex items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Applied
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Job Details View */}
        {selectedJob && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <JobView
              job={selectedJob}
              isApplied={appliedJobIds.includes(selectedJob.job_id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;