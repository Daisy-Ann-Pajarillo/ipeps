import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import TrainingApplicationView from './TrainingApplicationView';  // Import from same directory

const TrainingApplications = ({ isCollapsed }) => {
  const [appliedTrainings, setAppliedTrainings] = useState([]);
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
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedTrainings') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('trainingApplicationTimes') || '{}');
      const allTrainings = JSON.parse(localStorage.getItem('allTrainings') || '[]');

      const appliedTrainingsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('training-') && appliedItemsList[key])
        .map(key => {
          const trainingId = parseInt(key.replace('training-', ''));
          const training = allTrainings.find(training => training.id === trainingId);
          if (training) {
            return {
              ...training,
              applicationTime: applicationTimesList[`training-${trainingId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setAppliedTrainings(appliedTrainingsData);
      setApplicationTimes(applicationTimesList);
    };

    loadApplications();
    window.addEventListener('storage', loadApplications);
    return () => window.removeEventListener('storage', loadApplications);
  }, []);

  useEffect(() => {
    const loadAppliedTrainings = async () => {
      try {
        if (auth.token) {
          const response = await axios.get("/api/get-applied-trainings", {
            auth: { username: auth.token },
          });

          if (response.data.success && Array.isArray(response.data.applications)) {
            setAppliedTrainings(response.data.applications);
            // Auto-select first training application
            if (response.data.applications.length > 0) {
              setSelectedApplication(response.data.applications[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching applied trainings:", error);
      }
    };

    loadAppliedTrainings();
  }, [auth.token]);

  const canWithdraw = (trainingId) => {
    const applicationTime = applicationTimes[`training-${trainingId}`];
    if (!applicationTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const getTimeRemaining = (trainingId) => {
    const applicationTime = applicationTimes[`training-${trainingId}`];
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application submitted';
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdrawal = (trainingId) => {
    setAppliedTrainings(prev => prev.filter(training => training.training_posting_id !== trainingId));
    setSelectedApplication(null);
    const appliedItems = JSON.parse(localStorage.getItem('appliedTrainings') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('trainingApplicationTimes') || '{}');
    delete appliedItems[`training-${trainingId}`];
    delete applicationTimes[`training-${trainingId}`];
    localStorage.setItem('appliedTrainings', JSON.stringify(appliedItems));
    localStorage.setItem('trainingApplicationTimes', JSON.stringify(applicationTimes));
  };

  return (
    <Box className="flex h-screen">
      {/* Left Panel - Applications List */}
      <Box className="w-3/5 p-4 overflow-y-auto">
        <SearchData
          placeholder="Find a training application..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />
        {appliedTrainings
          .filter(training =>
            training.training_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            training.company_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(training => (
            <div
              key={training.training_posting_id}
              onClick={() => setSelectedApplication(training)}
              className={`border rounded-xl p-4 mb-4 shadow-sm cursor-pointer transition-all duration-300 ${selectedApplication?.training_posting_id === training.training_posting_id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:shadow-md'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center bg-gray-200 rounded-lg w-16 h-16 text-xl font-bold text-gray-700 uppercase">
                  {training.company_name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{training.training_title}</h3>
                  <p className="text-gray-600 mb-2">{training.company_name}</p>
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      Status: {training.status}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      Slots: {training.occupied_slots}/{training.slots}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded ${canWithdraw(training.training_posting_id) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {getTimeRemaining(training.training_posting_id)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{training.training_description}</p>
                </div>
              </div>
            </div>
          ))}
      </Box>

      {/* Right Panel - Application View */}
      <Box className="w-2/5 border-l border-gray-200">
        <TrainingApplicationView
          application={selectedApplication}
          onWithdraw={handleWithdrawal}
        />
      </Box>
    </Box>
  );
};

export default TrainingApplications;