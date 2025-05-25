import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Button } from "@mui/material";
import logoNav from "../../../../Home/images/logonav.png";
import ScholarshipApplicationView from "./ScholarshipApplicationView";

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

  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    if (auth.token) {
      loadApplications();
    }
  }, [auth.token]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get-applied-scholarships", {
        auth: { username: auth.token },
      });

      if (response.data.success && Array.isArray(response.data.applications)) {
        setAppliedScholarships(response.data.applications);
        if (response.data.applications.length > 0) {
          setSelectedApplication(response.data.applications[0]);
        }

        // Save application times for withdrawal window calculations
        const times = {};
        response.data.applications.forEach(application => {
          times[application.scholarship_posting_id] = new Date(application.applied_at);
        });
        setApplicationTimes(times);
      }
    } catch (error) {
      console.error("Error fetching scholarship applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const canWithdraw = (scholarshipId) => {
    const applicationTime = applicationTimes[scholarshipId];
    if (!applicationTime) return false;

    const now = new Date();
    const timeDiff = now.getTime() - applicationTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  };

  const getTimeRemaining = (scholarshipId) => {
    const applicationTime = applicationTimes[scholarshipId];
    if (!applicationTime) return '';

    const now = new Date();
    const timeDiff = (applicationTime.getTime() + (24 * 60 * 60 * 1000)) - now.getTime();
    const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursRemaining}h ${minutesRemaining}m left to withdraw`;
  };

  const handleWithdrawal = async (scholarshipId) => {
    if (!canWithdraw(scholarshipId)) {
      toast.error("Withdrawal period has expired");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        "/api/withdraw-scholarship-application",
        { scholarship_posting_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setAppliedScholarships(prev => prev.filter(app => app.scholarship_posting_id !== scholarshipId));
      if (selectedApplication?.scholarship_posting_id === scholarshipId) {
        setSelectedApplication(null);
      }
      toast.success("Application withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error(error.response?.data?.message || "Failed to withdraw application");
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
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">
              Scholarship Applications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your scholarship submissions
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {appliedScholarships.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Active Applications
          </span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full bg-[#1a237e] dark:bg-[#0d1544] shadow-lg sm:shadow-xl py-4 px-2 sm:px-4">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex flex-row items-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
            <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Applications List */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
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
            ) : appliedScholarships.length === 0 ? (
              <div className="flex justify-center items-center h-32 sm:h-40">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No applications found
                </p>
              </div>
            ) : (
              appliedScholarships.filter(scholarship =>
                scholarship.scholarship_title?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(scholarship => (
                <div
                  key={scholarship.scholarship_posting_id}
                  onClick={() => setSelectedApplication(scholarship)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedApplication?.scholarship_posting_id === scholarship.scholarship_posting_id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={scholarship.companyImage || "http://bij.ly/4ib59B1"}
                        alt={scholarship.scholarship_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">                      
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {scholarship.scholarship_title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                            {scholarship.company_name}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            scholarship.status === 'approved'
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : scholarship.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {scholarship.scholarship_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {scholarship.city_municipality}, {scholarship.country}
                        </span>
                      </div>
                      
                      {canWithdraw(scholarship.scholarship_posting_id) && (
                        <div className="mt-2">
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            {getTimeRemaining(scholarship.scholarship_posting_id)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Details - Desktop View */}
        {selectedApplication && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0">
            <ScholarshipApplicationView
              application={selectedApplication}
              onWithdraw={(id) => handleWithdrawal(id)}
              isMobile={false}
            />
          </div>
        )}

        {/* Application Details - Mobile Modal View */}
        {selectedApplication && (
          <div className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0" onClick={() => setSelectedApplication(null)} />
              <div className="absolute inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0">
                <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                  <div className="absolute right-4 top-4 z-10">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <ScholarshipApplicationView
                    application={selectedApplication}
                    onWithdraw={(id) => handleWithdrawal(id)}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipApplications;