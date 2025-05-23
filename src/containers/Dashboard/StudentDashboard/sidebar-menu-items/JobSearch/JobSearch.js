import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import JobView from "./JobView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material"; // Changed from @material-tailwind/react to @mui/material
import pesoLogo from '../../../../Home/images/pesoLogo.png';
import logoNav from '../../../../Home/images/logonav.png';
import WorkIcon from '@mui/icons-material/Work'; // Add this import for the job icon
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'; // Add this import for the job icon

import SearchIcon from '@mui/icons-material/Search'; // Add this import for the search icon

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


   {/*
  // Add modern gradient + SVG overlay background to body
  useEffect(() => {
    const prevBg = document.body.style.background;
    // Abstract SVG overlay (subtle circles) as data URI
    const svgBg = `url('data:image/svg+xml;utf8,<svg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"30%\" cy=\"20%\" r=\"120\" fill=\"%23ffffff11\"/><circle cx=\"80%\" cy=\"70%\" r=\"180\" fill=\"%230e5fd811\"/><circle cx=\"60%\" cy=\"10%\" r=\"90\" fill=\"%230e5fd822\"/></svg>')`;
    document.body.style.background = `linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%), ${svgBg}`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover, cover';
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
      document.body.style.background = prevBg;
    };
  }, []);
*/}
  return (
    <div className="min-h-screen w-full">
      <ToastContainer />      {/* Modern Thin Header */}      
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <TravelExploreOutlinedIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Job Search</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find your next opportunity</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Available Jobs</span>
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
            placeholder="Search jobs, companies, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
        <select
          value={entryLevel}
          onChange={(e) => setEntryLevel(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Experience</option>
          <option value="Entry">Entry</option>
          <option value="Mid-level">Mid</option>
          <option value="Senior">Senior</option>
        </select>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Type</option>
          <option value="Full-time">Full Time</option>
          <option value="Part-time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
        >
          <option value="">Sort</option>
          <option value="Most Recent">Recent</option>
          <option value="Salary">Salary</option>
        </select>
      </div>

      {/* Main Content: Job List & Job View */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Job List Section - vertical scroll, mobile friendly */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-2 px-1">
      
        {/*    <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {filteredJobs.length} jobs found
            </Typography>*/}
            
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4" style={{maxHeight: 'calc(100vh - 180px)', paddingBottom: selectedJob ? '10px' : '0' }}>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2">
                <img 
                  src={logoNav} 
                  alt="IPEPS Logo" 
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-base">
                  Loading Jobs...
                </Typography>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 dark:text-gray-400 text-base">No jobs found matching your criteria</p>
              </div>
            ) : (
              <>
                {filteredJobs.map((job) => (
                  <div
                    key={job.job_id}
                    onClick={() => handleJobClick(job.job_id)}
                    className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex gap-3 items-center ${selectedJob?.job_id === job.job_id ? 'ring-2 ring-blue-400 border-blue-500' : ''}`}
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
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">🏢 {job.employer?.company_name ?? 'Unknown Company'}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">👤 {job.employer?.full_name ?? 'N/A'}</div>
                    </div>
                    {appliedJobIds.includes(job.job_id) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        Applied
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex justify-center items-center mt-2 mb-1">
                  <Typography variant="subtitle2" className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  {/*  {filteredJobs.length} jobs found*/} 
                  </Typography>
                </div>
              </>
            )}
          </div>
        </div>        {/* Job Details Section */}
        {selectedJob && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8">
            <JobView job={selectedJob} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;