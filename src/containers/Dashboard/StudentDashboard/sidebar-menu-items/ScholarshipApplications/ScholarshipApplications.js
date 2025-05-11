import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import ScholarshipApplicationView from './ScholarshipApplicationView';  // Import from same directory
import { ToastContainer } from 'react-toastify';
import logoNav from '../../../../Home/images/logonav.png';

const ScholarshipApplications = ({ isCollapsed }) => {
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const loadApplications = () => {
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedScholarships') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('scholarshipApplicationTimes') || '{}');
      const allScholarships = JSON.parse(localStorage.getItem('allScholarships') || '[]');

      const appliedScholarshipsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('scholarship-') && appliedItemsList[key])
        .map(key => {
          const scholarshipId = parseInt(key.replace('scholarship-', ''));
          const scholarship = allScholarships.find(scholarship => scholarship.id === scholarshipId);
          if (scholarship) {
            return {
              ...scholarship,
              applicationTime: applicationTimesList[`scholarship-${scholarshipId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setAppliedScholarships(appliedScholarshipsData);
      setApplicationTimes(applicationTimesList);
    };

    loadApplications();
    window.addEventListener('storage', loadApplications);
    return () => window.removeEventListener('storage', loadApplications);
  }, []);

  useEffect(() => {
    const loadAppliedScholarships = async () => {
      setIsLoading(true);
      try {
        if (auth.token) {
          const response = await axios.get("/api/get-applied-scholarships", {
            auth: { username: auth.token },
          });

          if (response.data.success && Array.isArray(response.data.applications)) {
            setAppliedScholarships(response.data.applications);
            // Auto-select first scholarship application
            if (response.data.applications.length > 0) {
              setSelectedApplication(response.data.applications[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching applied scholarships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppliedScholarships();
  }, [auth.token]);

  const canWithdraw = (scholarshipId) => {
    const applicationTime = applicationTimes[`scholarship-${scholarshipId}`];
    if (!applicationTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const getTimeRemaining = (scholarshipId) => {
    const applicationTime = applicationTimes[`scholarship-${scholarshipId}`];
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application submitted';
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdrawal = (scholarshipId) => {
    setAppliedScholarships(prev => prev.filter(scholarship => scholarship.scholarship_posting_id !== scholarshipId));
    setSelectedApplication(null);
    const appliedItems = JSON.parse(localStorage.getItem('appliedScholarships') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('scholarshipApplicationTimes') || '{}');
    delete appliedItems[`scholarship-${scholarshipId}`];
    delete applicationTimes[`scholarship-${scholarshipId}`];
    localStorage.setItem('appliedScholarships', JSON.stringify(appliedItems));
    localStorage.setItem('scholarshipApplicationTimes', JSON.stringify(applicationTimes));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Hero Section - Updated gradient colors */}
      <section className="w-full bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400 dark:from-teal-900 dark:to-teal-700 px-8 py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h3" className="text-white font-bold mb-3">
          My Scholarship Applications
        </Typography>
        <Typography variant="h6" className="text-teal-100 mb-8">
          Track and manage your scholarship applications
        </Typography>

        {/* Search Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mb-20 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>
      </section>

      {/* Content Section */}
      <div className="flex p-8 pt-14">
        {/* Applications List */}
        <div className={`${selectedApplication ? "w-3/5" : "w-full"} pr-6`}>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-4">
            {appliedScholarships.length} applications
          </Typography>

          <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-4">
                <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse">
                  Loading Applications...
                </Typography>
              </div>
            ) : (
              appliedScholarships
                .filter(scholarship =>
                  scholarship.scholarship_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  scholarship.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(scholarship => (
                  <div
                    key={scholarship.scholarship_posting_id}
                    onClick={() => setSelectedApplication(scholarship)}
                    className={`bg-white dark:bg-gray-900 rounded-xl border ${
                      selectedApplication?.scholarship_posting_id === scholarship.scholarship_posting_id
                        ? "border-teal-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={scholarship.companyImage || "http://bij.ly/4ib59B1"}
                          alt={scholarship.scholarship_title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {scholarship.scholarship_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {scholarship.company_name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            Status: {scholarship.status}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            Slots: {scholarship.occupied_slots}/{scholarship.slots}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                            canWithdraw(scholarship.scholarship_posting_id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {getTimeRemaining(scholarship.scholarship_posting_id)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Application Details */}
        {selectedApplication && (
          <div className="w-2/5">
            <ScholarshipApplicationView
              application={selectedApplication}
              onWithdraw={handleWithdrawal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipApplications;