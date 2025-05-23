import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import JobApplicationView from './JobApplicationView';  // Import from same directory
import logoNav from '../../../../Home/images/logonav.png';
import { ToastContainer } from 'react-toastify';
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";



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

const JobApplications = ({ isCollapsed }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const loadApplications = () => {
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedItems') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
      const allJobs = JSON.parse(localStorage.getItem('allJobs') || '[]');

      const appliedJobsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('job-') && appliedItemsList[key])
        .map(key => {
          const jobId = parseInt(key.replace('job-', ''));
          const job = allJobs.find(job => job.id === jobId);
          if (job) {
            return {
              ...job,
              applicationTime: applicationTimesList[`job-${jobId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setAppliedJobs(appliedJobsData);
      setApplicationTimes(applicationTimesList);
      setIsLoading(false);
    };

    loadApplications();
    window.addEventListener('storage', loadApplications);
    return () => window.removeEventListener('storage', loadApplications);
  }, []);

  useEffect(() => {
    const loadAppliedJobs = async () => {
      try {
        if (auth.token) {
          const response = await axios.get("/api/get-applied-jobs", {
            auth: { username: auth.token },
          });

          if (response.data.success && Array.isArray(response.data.applications)) {
            setAppliedJobs(response.data.applications);
            // Auto-select first job application
            if (response.data.applications.length > 0) {
              setSelectedApplication(response.data.applications[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    loadAppliedJobs();
  }, [auth.token]);

  const canWithdraw = (jobId) => {
    const applicationTime = applicationTimes[`job-${jobId}`];
    if (!applicationTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const getTimeRemaining = (jobId) => {
    const applicationTime = applicationTimes[`job-${jobId}`];
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application submitted';
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdrawal = (jobId) => {
    setAppliedJobs(prev => prev.filter(job => job.id !== jobId));
    setSelectedApplication(null);
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
    delete appliedItems[`job-${jobId}`];
    delete applicationTimes[`job-${jobId}`];
    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />      {/* Modern Header with Icons and Stats */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          {/* Main Header Row */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/50">
                <WorkIcon className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white text-lg">My Applications</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your job applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  {appliedJobs.length} applications
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>      {/* Unified Filter/Search Row */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e]">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
      </div>

      {/* Main Content: Applications List & Application View */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Applications List Section - vertical scroll, mobile friendly */}
        <div className="flex-1 flex flex-col min-w-0">          <div className="flex justify-between items-center mb-2 px-1">
           {/* {filteredJobs.length} jobs found */}
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4" style={{maxHeight: 'calc(100vh - 180px)', paddingBottom: selectedApplication ? '10px' : '0' }}>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Applications...
                </Typography>
              </div>
            ) : (
              appliedJobs
                .filter(job =>
                  job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(job => (
                  <div                    key={job.job_posting_id}
                    onClick={() => setSelectedApplication(job)}
                    className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex gap-3 items-center ${selectedApplication?.job_posting_id === job.job_posting_id ? 'ring-2 ring-blue-400 border-blue-500' : ''}`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={job.companyImage || "http://bij.ly/4ib59B1"}
                        alt={job.job_title}
                        className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{job.job_title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{job.company_name}</p>
                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {job.required_skills?.split(',').slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            📍 {job.city_municipality}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            💰 ₱{job.estimated_salary_from?.toLocaleString()} - ₱{job.estimated_salary_to?.toLocaleString()}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                            canWithdraw(job.job_posting_id)
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {getTimeRemaining(job.job_posting_id)}
                          </span>
                        </div>
                      </div>
                    </div>
               
                ))
            )}
          </div>
        </div>        {/* Application Details Section */}
        {selectedApplication && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8">
            <JobApplicationView application={selectedApplication} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
