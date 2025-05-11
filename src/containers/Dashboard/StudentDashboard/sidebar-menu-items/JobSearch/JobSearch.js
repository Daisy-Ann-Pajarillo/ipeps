import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import JobView from "./JobView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material"; // Changed from @material-tailwind/react to @mui/material
import logoNav from '../../../../Home/images/logonav.png';

const styles = `
  @keyframes pulse-zoom {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }

  .loading-logo {
    animation: pulse-zoom 1.5s ease-in-out infinite;
  }
`;

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

          console.log("🔍 Full API Response:", response.data);

          if (
            response.data &&
            Array.isArray(response.data.job_postings)
          ) {
            const jobsData = response.data.job_postings;

            console.log("📋 Jobs Data:", jobsData);

            // Extract full_name from the API response
            const fullName =
              response.data.full_name || "Unknown Company";

            console.log("👤 Employer Full Name:", fullName);
            console.log("🏢 Employer Raw Array:", response.data.employer);

            setEmployerName(fullName);
            setJobs(jobsData);

            if (jobsData.length > 0 && !selectedJob) {
              setSelectedJob(jobsData[0]);
              console.log("✅ Default selected job set:", jobsData[0]);
            }
          } else {
            setJobs([]);
            toast.error("No jobs found or invalid response format");
          }

          await loadAppliedJobs();
        }
      } catch (error) {
        console.error("❌ Error fetching job postings:", error);
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

      {/* Centered Header Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 px-8 py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h3" className="text-white font-bold mb-3">
          Find Your Next Opportunity
        </Typography>
        <Typography variant="h6" className="text-blue-100 mb-8">
          Browse through job postings from top employers in Iloilo
        </Typography>

        {/* Modern Search & Filter Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <select
              value={entryLevel}
              onChange={(e) => setEntryLevel(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="">Experience Level</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid-level">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full Time</option>
              <option value="Part-time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section with adjusted padding for overlapping search box */}
      <div className="flex p-8 pt-14">
        {/* Job List */}
        <div className={`${selectedJob ? "w-3/5" : "w-full"} pr-6`}>
          <div className="flex justify-between items-center mb-6">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400">
              {filteredJobs.length} jobs found
            </Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Salary">Salary</option>
            </select>
          </div>

          <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-4">
                <img 
                  src={logoNav} 
                  alt="IPEPS Logo" 
                  className="w-24 h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Loading Jobs...
                </Typography>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.job_id}
                  onClick={() => handleJobClick(job.job_id)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border ${
                    selectedJob?.job_id === job.job_id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
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
                        💰 {formatSalary(job.estimated_salary_from)} - {formatSalary(job.estimated_salary_to)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        🏢 {job.employer?.company_name ?? 'Unknown Company'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        👤 Posted By: {job.employer?.full_name ?? 'N/A'}
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
        </div>

        {/* Job Details */}
        {selectedJob && (
          <div className="w-2/5">
            <JobView job={selectedJob} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;