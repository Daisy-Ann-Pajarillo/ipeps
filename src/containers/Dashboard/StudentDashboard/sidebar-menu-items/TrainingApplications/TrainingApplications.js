import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";
import TrainingApplicationView from './TrainingApplicationView';
import logoNav from '../../../../Home/images/logonav.png';
import { ToastContainer } from 'react-toastify';

// Add loading animation styles
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

const TrainingApplications = ({ isCollapsed }) => {
  const [appliedTrainings, setAppliedTrainings] = useState([]);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadAppliedTrainings();
  }, [auth.token]);

  const canWithdraw = (trainingId) => {
    const enrollmentTime = applicationTimes[`training-${trainingId}`];
    if (!enrollmentTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - enrollmentTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const getTimeRemaining = (trainingId) => {
    const enrollmentTime = applicationTimes[`training-${trainingId}`];
    if (!enrollmentTime) return null;
    const now = new Date().getTime();
    const timeLeft = (enrollmentTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Enrollment confirmed';

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };
  const handleWithdrawal = async (trainingId) => {
    try {
      await axios.post("/api/withdraw-training", 
        { employer_trainingpost_id: trainingId },
        { auth: { username: auth.token } }
      );

      setAppliedTrainings(prev => prev.filter(training => training.training_id !== trainingId));
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error withdrawing application:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Centered Header Section */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-800 dark:to-purple-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          My Training Applications
        </Typography>
        <Typography variant="subtitle1" className="text-purple-100 mb-4 text-xs sm:text-base md:text-lg">
          Track and manage your training applications
        </Typography>

        {/* Search Section - Unified */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-12 sm:-mb-16 md:-mb-20 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Content Section with responsive layout */}
      <div className="flex flex-col lg:flex-row p-2 sm:p-4 md:p-8 pt-8 sm:pt-12 md:pt-14 gap-6 md:gap-8">
        {/* Application Details (top on mobile, right on desktop) */}
        {selectedApplication && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <TrainingApplicationView
              training={selectedApplication}
              onWithdraw={() => handleWithdrawal(selectedApplication.training_id)}
              isLoading={isLoading}
            />
          </div>
        )}
        {/* Applications List */}
        <div className={`${selectedApplication ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            {appliedTrainings.length} applications
          </Typography>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
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
              appliedTrainings
                .filter(training =>
                  (training?.training_title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                  (training?.employer?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                )
                .map(training => (
                  <div
                    key={training.training_id}
                    onClick={() => setSelectedApplication(training)}
                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                      selectedApplication?.training_id === training.training_id
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                  >
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={training.companyImage || "http://bij.ly/4ib59B1"}
                          alt={training.training_title}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {training.training_title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                          {training.employer?.full_name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            📍 {training.city_municipality}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-lg">
                            Application Status: Active
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

export default TrainingApplications;
