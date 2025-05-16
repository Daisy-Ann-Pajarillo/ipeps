import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import JobApplicationView from './JobApplicationView';  // Import from same directory
import logoNav from '../../../../Home/images/logonav.png';
import { ToastContainer } from 'react-toastify';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-lg flex flex-col items-center text-center">
        {/* To adjust header and search bar size for mobile, change px-4/py-6 and text sizes below */}
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          My Applications
        </Typography>
        <Typography variant="subtitle1" className="text-blue-100 mb-4 text-xs sm:text-base md:text-lg">
          Track and manage your job applications
        </Typography>

        {/* Search Section - Smaller */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-12 sm:-mb-16 md:-mb-20 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row p-2 sm:p-4 md:p-8 pt-8 sm:pt-12 md:pt-14 gap-6 md:gap-8">
        {/* MOBILE: To adjust mobile layout, change p-2/sm:p-4 and gap-6 as needed */}
        {/* Application Details (top on mobile, right on desktop) */}
        {selectedApplication && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <JobApplicationView
              application={selectedApplication}
              onWithdraw={handleWithdrawal}
            />
          </div>
        )}
        {/* Applications List */}
        <div className={`${selectedApplication ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-4 text-sm sm:text-base">
            {appliedJobs.length} applications
          </Typography>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
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
                  <div
                    key={job.job_posting_id}
                    onClick={() => setSelectedApplication(job)}
                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                      selectedApplication?.job_posting_id === job.job_posting_id
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="flex gap-2 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={job.companyImage || "http://bij.ly/4ib59B1"}
                          alt={job.job_title}
                          className="w-full h-full object-contain p-1 sm:p-2"
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
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
