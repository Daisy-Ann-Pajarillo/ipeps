import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import ScholarshipApplicationView from './ScholarshipApplicationView';  // Import from same directory

const ScholarshipApplications = ({ isCollapsed }) => {
  const [appliedScholarships, setAppliedScholarships] = useState([]);
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
    <Box className="flex h-screen">
      {/* Left Panel - Applications List */}
      <Box className="w-3/5 p-4 overflow-y-auto">
        <SearchData
          placeholder="Find a scholarship application..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />
        {appliedScholarships
          .filter(scholarship =>
            scholarship.scholarship_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scholarship.company_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(scholarship => (
            <div
              key={scholarship.scholarship_posting_id}
              onClick={() => setSelectedApplication(scholarship)}
              className={`border rounded-xl p-4 mb-4 shadow-sm cursor-pointer transition-all duration-300 ${selectedApplication?.scholarship_posting_id === scholarship.scholarship_posting_id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:shadow-md'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center bg-gray-200 rounded-lg w-16 h-16 text-xl font-bold text-gray-700 uppercase">
                  {scholarship.company_name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{scholarship.scholarship_title}</h3>
                  <p className="text-gray-600 mb-2">{scholarship.company_name}</p>
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      Status: {scholarship.status}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      Slots: {scholarship.occupied_slots}/{scholarship.slots}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded ${canWithdraw(scholarship.scholarship_posting_id) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {getTimeRemaining(scholarship.scholarship_posting_id)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{scholarship.scholarship_description}</p>
                </div>
              </div>
            </div>
          ))}
      </Box>

      {/* Right Panel - Application View */}
      <Box className="w-2/5 border-l border-gray-200">
        <ScholarshipApplicationView
          application={selectedApplication}
          onWithdraw={handleWithdrawal}
        />
      </Box>
    </Box>
  );
};

export default ScholarshipApplications;