import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import TrainingApplicationView from './TrainingApplicationView';
import logoNav from '../../../../Home/images/logonav.png';
import { ToastContainer, toast } from 'react-toastify';
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";

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
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

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
            // Only auto-select first application on desktop
            const isDesktop = window.innerWidth >= 1024;
            if (response.data.applications.length > 0 && isDesktop) {
              setSelectedApplication(response.data.applications[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching applied trainings:", error);
        toast.error("Failed to load training applications");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppliedTrainings();
  }, [auth.token]);

  const handleWithdrawal = async (trainingId) => {
    try {
      setIsLoading(true);
      await axios.post("/api/withdraw-training", 
        { employer_trainingpost_id: trainingId },
        { auth: { username: auth.token } }
      );

      setAppliedTrainings(prev => prev.filter(training => training.training_id !== trainingId));
      setSelectedApplication(null);
      toast.success("Successfully withdrawn from training");
    } catch (error) {
      console.error("Error withdrawing training:", error);
      toast.error(error.response?.data?.message || "Failed to withdraw from training");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <SchoolIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Training Applications</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your training enrollment status</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{appliedTrainings.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Active Applications</span>
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
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
      </div>

      {/* Main Content: Applications List & Application View */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Applications List Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col gap-3 h-[calc(100vh-180px)] overflow-y-auto lg:pr-4">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-base">
                  Loading Applications...
                </Typography>
              </div>
            ) : appliedTrainings.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 sm:h-40 gap-2 sm:gap-4">
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  No training applications found.
                </Typography>
              </div>
            ) : (
              appliedTrainings                
              .filter(training =>
                  training.training_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  training.employer?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(training => (
                  <div
                    key={training.training_id}
                    onClick={() => setSelectedApplication(training)}
                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                      selectedApplication?.training_id === training.training_id
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 dark:border-gray-700"
                    } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="flex gap-2 sm:gap-3 min-w-0">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={training.providerImage || "http://bij.ly/4ib59B1"}
                          alt={training.provider || training.training_title}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">                        
                        <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {training.training_title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {training.employer?.company_name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          Vacancies: {training.slots}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          Expires: {training.expiration_date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Application Details - Desktop View */}
        {selectedApplication && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8">
            <TrainingApplicationView 
              training={selectedApplication} 
              onWithdraw={() => handleWithdrawal(selectedApplication.training_id)}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Application Details - Mobile Modal View */}
        {selectedApplication && (
          <div 
            className="lg:hidden fixed inset-0" 
            style={{ 
              position: 'fixed', 
              zIndex: Number.MAX_SAFE_INTEGER,
              isolation: 'isolate',
              pointerEvents: 'auto'
            }}
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              style={{ 
                position: 'fixed', 
                zIndex: Number.MAX_SAFE_INTEGER,
                pointerEvents: 'auto'
              }}
            >
              <div className="fixed inset-0 overflow-hidden">
                <div className="fixed inset-0" onClick={() => setSelectedApplication(null)} />
                <div 
                  className="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0"
                  style={{ 
                    zIndex: Number.MAX_SAFE_INTEGER,
                    pointerEvents: 'auto'
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                    <div 
                      className="absolute right-4 top-4"
                      style={{ zIndex: 999999999 }}
                    >
                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <TrainingApplicationView 
                      training={selectedApplication} 
                      onWithdraw={() => handleWithdrawal(selectedApplication.training_id)}
                      isLoading={isLoading}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingApplications;
