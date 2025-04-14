import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";

const JobApplications = ({ isCollapsed }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});
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
            console.log("API Applied Jobs:", response.data.applications);
            setAppliedJobs(response.data.applications)
            // Optionally handle data here (e.g., highlight jobs from server)
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

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {appliedJobs
        .filter(job =>
          job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(job => (
          <div
            key={job.job_posting_id}
            onClick={() => setSelectedApplication(job)}
            className={`border rounded-xl p-4 mb-4 shadow-sm cursor-pointer transition-all duration-300 ${selectedApplication?.job_posting_id === job.job_posting_id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:shadow-md'
              }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center bg-gray-200 rounded-lg w-16 h-16 text-xl font-bold text-gray-700 uppercase">
                {job.company_name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{job.job_title}</h3>
                <p className="text-gray-600 mb-2">{job.company_name}</p>
                <div className="flex flex-wrap gap-2 text-sm mb-2">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    {job.city_municipality}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    ₱{job.estimated_salary_from.toLocaleString()} - ₱{job.estimated_salary_to.toLocaleString()}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded ${canWithdraw(job.job_posting_id) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {getTimeRemaining(job.job_posting_id)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{job.job_description}</p>
              </div>
            </div>
          </div>
        ))}
    </Box>
  );
};

export default JobApplications;
