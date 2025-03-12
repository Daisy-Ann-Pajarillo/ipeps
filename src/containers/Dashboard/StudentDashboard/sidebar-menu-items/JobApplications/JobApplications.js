import React, { useState, useEffect } from 'react';
import JobApplicationView from './JobApplicationView';
import SearchData from '../../../components/layout/Search';

const JobApplications = ({ isCollapsed }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});

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

  const canWithdraw = (jobId) => {
    const applicationTime = applicationTimes[`job-${jobId}`];
    if (!applicationTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours
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
    <div className="flex flex-col w-full">
      {/* Search */}
      <SearchData
        placeholder="Find a training..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4"
      />

      <div 
        className={`flex fixed top-[72px] transition-all left-${isCollapsed ? '20' : '64'} right-0 bottom-0`}
      >
        {/* Applications List */}
        <div className="w-[60%] overflow-y-auto border-r border-gray-200">
          {appliedJobs.map((job) => (
            <div key={job.id} className="border-b p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <img 
                  src={job.companyImage} 
                  alt={job.company} 
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-500">{job.company} — {job.location}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{job.type}</span>
                    <span>|</span>
                    <span>{job.experienceLevel}</span>
                  </div>
                  <p className="mt-2 text-gray-800">{job.salary}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {getTimeRemaining(job.id)}
                  </p>
                </div>
              </div>

              {canWithdraw(job.id) && (
                <button
                  onClick={() => handleWithdrawal(job.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Selected Application Details */}
        <div className="w-[40%] overflow-y-auto">
          {selectedApplication ? (
            <JobApplicationView application={selectedApplication} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
