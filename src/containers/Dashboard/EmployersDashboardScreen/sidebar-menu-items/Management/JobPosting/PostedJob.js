//PostedJob.js
import React, { useState, useEffect } from "react";
import axios from "../../../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Slide,
  IconButton,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  TextField
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';

// JobCard component definition
const JobCard = ({ job, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex flex-col sm:flex-row gap-3 mb-4"
  >
    <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
      <img
        src={job.logo || "http://bij.ly/4ib59B1"}
        alt={job.company}
        className="w-full h-full object-contain p-2"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{job.job_title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{job.company}</p>
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
        {job.other_skills?.split(',').slice(0, 3).map((skill, index) => (
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
          job.status?.toLowerCase() === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {job.status}
        </span>
      </div>
    </div>
  </div>
);

// Function to map status to MUI color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    case 'draft':
      return 'info';
    default:
      return 'default';
  }
};

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

const PostedJob = ({ createJobOpen }) => {
  const theme = useTheme();
  // Define chipStyles using MUI theme directly
  const chipStyles = {
    m: 0.5,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  };


  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);


  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);


  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);


  useEffect(() => {
    // Fetch job postings from the API
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/get-job-postings', {
          auth: { username: auth.token }
        });
        if (response.status === 200) {
          console.log("responeseeee", response)
          const responseData = response.data;
          // Handle the response as an array
          const data = Array.isArray(responseData.job_postings)
            ? responseData.job_postings
            : [];
          console.log('Job Data:', data); // Log the job data
          setJobs(data);
        } else {
          console.error('Failed to fetch job postings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };
    fetchJobs();
  }, [auth.token]);


  // Debug log to check first job record structure
  useEffect(() => {
    if (jobs.length > 0) {
      console.log("First job record:", jobs[0]);
    }
  }, [jobs]);


  const handleViewDetails = (job) => {
    console.log("adddmind remarks", job)
    setSelectedJob(job);
    setDetailsPanelOpen(true);
    // Reset applicant views when showing a new job
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };


  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
  };

  const handleViewApplicants = async (jobId) => {
    try {
      if (!jobId) {
        console.error('Job ID is undefined');
        toast.error('Invalid job ID');
        return;
      }

      const response = await axios.get(`/api/get-applied-jobs/${jobId}`, {
        auth: { username: auth.token }
      });
      if (response.data && Array.isArray(response.data.applications)) {
        const formattedApplicants = response.data.applications
          .filter(applicant => applicant.status && applicant.status.toLowerCase() !== 'pending')
          .map(applicant => {
            const personalInfo = applicant.user_details?.personal_information || {};
            return {
              id: applicant.application_id,
              application_date: applicant.created_at,
              status: applicant.status || 'pending',
              first_name: personalInfo.first_name || 'N/A',
              last_name: personalInfo.last_name || 'N/A',
              email: applicant.user_details?.email || 'N/A',
              remarks: applicant.user_details?.admin_remarks || 'N/A',
              phone_number: personalInfo.cellphone_number || 'N/A',
              location: personalInfo.place_of_birth || 'Not provided',
              educational_background: applicant.user_details?.educational_background || [],
              trainings: applicant.user_details?.trainings || [],
              professional_licenses: applicant.user_details?.professional_licenses || [],
              work_experiences: applicant.user_details?.work_experiences || [],
              other_skills: applicant.user_details?.other_skills || [],
              job_preference: applicant.user_details?.job_preference || {},
              personal_information: personalInfo,
              user_id: applicant.user_details?.user_id || null
            };
          });

        setJobApplicants(formattedApplicants);
        setApplicantsOpen(true);

        if (formattedApplicants.length === 0) {
          toast.info("No applicants found for this job");
        }
      }
    } catch (error) {
      console.error('Error fetching job applicants:', error);
      toast.error('Error loading applicants. Please try again later.');
    }
  };


  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleHireApplicant = async (applicantId) => {
    try {
      console.log('handleHireApplicant called with ID:', applicantId); // Debug entry point

      const applicant = jobApplicants.find((app) => app.id === applicantId);
      console.log('Found applicant:', applicant); // Debug applicant result

      if (!applicant) {
        toast.error('Applicant not found');
        return;
      }

      if (!applicant.user_id) {
        toast.error('Applicant user ID is missing');
        return;
      }

      const payload = {
        application_id: applicantId,
        status: 'hired',
        user_id: applicant.user_id,
      };

      console.log('Payload to be sent:', payload);
      console.log('Payload details:', JSON.stringify(payload, null, 2));

      const response = await axios.put('/api/update-job-status', payload, {
        auth: { username: auth.token },
      });

      if (response.status === 200) {
        setJobApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === applicantId ? { ...app, status: 'hired' } : app
          )
        );
        setSelectedApplicant((prev) => ({ ...prev, status: 'hired' }));
        toast.success('Applicant hired successfully!');
      } else {
        toast.error('Failed to update applicant status');
      }
    } catch (error) {
      console.error('Error hiring applicant:', error);
      toast.error('Error processing request');
    }
  };

  // Reject Applicant (Updated to hit API too)
  const handleRejectApplicant = async (applicantId) => {
    try {
      const applicant = jobApplicants.find((app) => app.id === applicantId);

      if (!applicant) {
        toast.error('Applicant not found');
        return;
      }

      if (!applicant.user_id) {
        toast.error('Applicant user ID is missing');
        return;
      }

      const payload = {
        application_id: applicantId,
        status: 'rejected',
        user_id: applicant.user_id,
      };

      // Log the payload for debugging
      console.log('Reject Payload to be sent:', payload);

      const response = await axios.put('/api/update-job-status', payload, {
        auth: { username: auth.token },
      });

      if (response.status === 200) {
        setJobApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === applicantId ? { ...app, status: 'rejected' } : app
          )
        );
        setSelectedApplicant((prev) => ({ ...prev, status: 'rejected' }));
        toast.success('Applicant rejected successfully!');
      } else {
        toast.error('Failed to reject applicant');
      }
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      toast.error('Error processing request');
    }
  };

  const handleViewFullDetails = () => {
    setOpenDetailDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
  };


  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);
  return (
    <div className="h-screen w-full flex flex-col">
      <ToastContainer />

      {/* Modern Thin Header */}      
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 flex-none z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900">
            <WorkIcon className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Job Postings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your job posts</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{jobs.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Active Postings</span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e] flex-none">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search job postings..."
            onChange={(e) => {
              // Add search functionality here if needed
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
      </div>      {/* Main Content: Jobs List & Job Details */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden relative">
        {/* Jobs List Section */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${detailsPanelOpen ? 'hidden lg:flex' : ''}`}>
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4 pb-20 lg:pb-4 h-full">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleViewDetails(job)}
                className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex flex-col sm:flex-row gap-3 ${
                  selectedJob?.id === job.id ? 'ring-2 ring-blue-400 border-blue-500' : ''
                }`}
              >
                <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={job.logo || "http://bij.ly/4ib59B1"}
                    alt={job.company}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{job.job_title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {job.other_skills?.split(',').slice(0, 3).map((skill, index) => (
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
                      job.status?.toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {detailsPanelOpen && (
          <>
            {/* Dark overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden" 
              style={{ zIndex: Number.MAX_SAFE_INTEGER - 1 }} 
              onClick={handleCloseDetails} 
            />
            
            {/* Details Panel */}
            <div className="fixed inset-0 lg:relative lg:inset-auto w-full lg:w-[600px] xl:w-[800px] bg-white dark:bg-gray-900 rounded-t-2xl lg:rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto" 
                 style={{ 
                   zIndex: Number.MAX_SAFE_INTEGER,
                   top: 'auto',
                   maxHeight: '90vh',
                   transform: 'translateY(0)',
                   transition: 'transform 300ms ease-out'
                 }}>
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <Typography variant="h5" className="font-bold text-gray-900 dark:text-white text-base lg:text-lg xl:text-xl">
                  {applicantsOpen ? 
                    (showApplicantDetails ? "Applicant Details" : "Job Applicants") : 
                    "Job Details"
                  }
                </Typography>
                <IconButton 
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  size="small"
                >
                  <CloseIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </IconButton>
              </div>
              
              <div className="p-4 lg:p-6">
                {/* Job Details View */}
                {!applicantsOpen && !showApplicantDetails && (
                  <div className="space-y-4 lg:space-y-6">
                    {/* Job Header */}
                    <div className="flex items-start gap-3 lg:gap-4 pb-4 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-16 h-16 lg:w-24 lg:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img
                          src={selectedJob.logo || "http://bij.ly/4ib59B1"}
                          alt={selectedJob.company}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {selectedJob.job_title}
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2">
                          {selectedJob.company}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {selectedJob.job_type}
                          </span>
                          <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {selectedJob.experience_level}
                          </span>
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(selectedJob.status)}
                            className="rounded-full text-xs lg:text-sm"
                          >
                            {selectedJob.status}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Location
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          {selectedJob.city_municipality}, {selectedJob.country}
                        </p>
                      </div>
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Salary Range
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          ₱{selectedJob.estimated_salary_from?.toLocaleString()} - ₱{selectedJob.estimated_salary_to?.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Vacancies
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          {selectedJob.no_of_vacancies}
                        </p>
                      </div>
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Expiration Date
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          {selectedJob.expiration_date}
                        </p>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {selectedJob.job_description}
                      </p>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.other_skills?.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Applicants Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={<PersonIcon />}
                      onClick={() => handleViewApplicants(selectedJob?.job_id)}
                      className="mt-4"
                    >
                      View Applicants
                    </Button>
                  </div>
                )}

                {/* Applicants List View */}
                {applicantsOpen && !showApplicantDetails && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                        Applicants ({jobApplicants.length})
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setApplicantsOpen(false)}
                        startIcon={<CloseIcon />}
                      >
                        Back
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                      {jobApplicants.length === 0 ? (
                        <div className="text-center py-8">
                          <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
                            No applicants yet
                          </Typography>
                        </div>
                      ) : jobApplicants
                          .filter(applicant => applicant.status !== "pending")
                          .map((applicant) => (
                            <div
                              key={applicant.id}
                              onClick={() => handleViewApplicantDetails(applicant)}
                              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all hover:shadow-md"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar
                                  src={applicant.profile_pic}
                                  className="w-12 h-12"
                                >
                                  {applicant.first_name?.[0] || 'A'}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {applicant.first_name} {applicant.last_name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Applied: {new Date(applicant.application_date).toLocaleDateString()}
                                  </p>
                                  <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      applicant.status === 'hired'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : applicant.status === 'rejected'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    }`}>
                                      {applicant.status || 'Pending'}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRightIcon className="text-gray-400" />
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                )}

                {/* Applicant Details View */}
                {showApplicantDetails && selectedApplicant && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowApplicantDetails(false)}
                        startIcon={<ArrowBackIcon />}
                      >
                        Back to Applicants
                      </Button>
                    </div>

                    <div className="text-center mb-6">
                      <Avatar
                        src={selectedApplicant.profile_pic}
                        className="w-24 h-24 mx-auto mb-4"
                      >
                        {selectedApplicant.first_name?.[0] || 'A'}
                      </Avatar>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {selectedApplicant.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedApplicant.phone_number || 'Not provided'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedApplicant.location || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.other_skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {skill.skills}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleViewFullDetails}
                        className="mb-4"
                      >
                        View Full Profile
                      </Button>

                      {selectedApplicant.status !== 'hired' && selectedApplicant.status !== 'rejected' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleHireApplicant(selectedApplicant.id)}
                            fullWidth
                          >
                            Hire Applicant
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRejectApplicant(selectedApplicant.id)}
                            fullWidth
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Full Details Dialog */}
        <Dialog
          open={openDetailDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              zIndex: Number.MAX_SAFE_INTEGER + 1000
            }
          }}
          style={{
            zIndex: Number.MAX_SAFE_INTEGER + 1000
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Applicant Full Details
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>ABOUT</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Prefix</Typography>
                  <Typography>{selectedApplicant?.personal_information?.prefix || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">First Name</Typography>
                  <Typography>{selectedApplicant?.personal_information?.first_name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Middle Name</Typography>
                  <Typography>{selectedApplicant?.personal_information?.middle_name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Last Name</Typography>
                  <Typography>{selectedApplicant?.personal_information?.last_name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Height</Typography>
                  <Typography>{selectedApplicant?.personal_information?.height || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Weight</Typography>
                  <Typography>{selectedApplicant?.personal_information?.weight || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Sex</Typography>
                  <Typography>{selectedApplicant?.personal_information?.sex || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Date of Birth</Typography>
                  <Typography>{selectedApplicant?.personal_information?.date_of_birth || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Place of Birth</Typography>
                  <Typography>{selectedApplicant?.personal_information?.place_of_birth || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Civil Status</Typography>
                  <Typography>{selectedApplicant?.personal_information?.civil_status || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Phone Number</Typography>
                  <Typography>{selectedApplicant?.personal_information?.cellphone_number || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Religion</Typography>
                  <Typography>{selectedApplicant?.personal_information?.religion || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary Country</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary Province</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_province || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary Municipality</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_municipality || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary Zip Code</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_zip_code || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary Barangay</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_barangay || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Temporary House No./Street Village</Typography>
                  <Typography>{selectedApplicant?.personal_information?.temporary_house_no_street_village || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent Country</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent Province</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_province || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent Municipality</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_municipality || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent Zip Code</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_zip_code || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent Barangay</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_barangay || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Permanent House No./Street Village</Typography>
                  <Typography>{selectedApplicant?.personal_information?.permanent_house_no_street_village || 'N/A'}</Typography>
                </Grid>
              </Grid>


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>PREFERRED WORK LOCATION</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Country</Typography>
                  <Typography>{selectedApplicant?.job_preference?.country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Province</Typography>
                  <Typography>{selectedApplicant?.job_preference?.province || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Municipality/City</Typography>
                  <Typography>{selectedApplicant?.job_preference?.municipality || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Industry</Typography>
                  <Typography>{selectedApplicant?.job_preference?.industry || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Preferred Occupation</Typography>
                  <Typography>{selectedApplicant?.job_preference?.preferred_occupation || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Salary Range</Typography>
                  <Typography>
                    {selectedApplicant?.job_preference?.salary_from || 'N/A'} - {selectedApplicant?.job_preference?.salary_to || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>EDUCATIONAL BACKGROUND</Typography>
              {selectedApplicant?.educational_background?.map((edu, index) => (
                //     <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">School Name</Typography>
                    <Typography>{edu.school_name || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Field of Study</Typography>
                    <Typography>{edu.field_of_study || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Degree/Qualification</Typography>
                    <Typography>{edu.degree_or_qualification || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Program Duration</Typography>
                    <Typography>{edu.program_duration ? `${edu.program_duration} years` : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Date From</Typography>
                    <Typography>{edu.date_from || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Date To</Typography>
                    <Typography>{edu.date_to || 'N/A'}</Typography>
                  </Grid>
                </Grid>
                //     </Paper>
              ))}


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>TRAININGS</Typography>
              {selectedApplicant?.trainings?.map((training, index) => (
                //      <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Training Title</Typography>
                    <Typography>{training.course_name || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Training Institution</Typography>
                    <Typography>{training.training_institution || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Skills Acquired</Typography>
                    <Typography>{training.skills_acquired || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Hours of Training</Typography>
                    <Typography>{training.hours_of_training || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Start Date</Typography>
                    <Typography>{training.start_date ? new Date(training.start_date).toLocaleDateString() : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">End Date</Typography>
                    <Typography>{training.end_date ? new Date(training.end_date).toLocaleDateString() : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Certificate Received</Typography>
                    <Typography>{training.certificates_received || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Credential ID</Typography>
                    <Typography>{training.credential_id || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="text.secondary">Credential URL</Typography>
                    <Typography>
                      {training.credential_url ? (
                        <a href={training.credential_url} target="_blank" rel="noopener noreferrer">
                          {training.credential_url}
                        </a>
                      ) : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                //     </Paper>
              ))}


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>PROFESSIONAL LICENSE</Typography>
              {selectedApplicant?.professional_licenses?.map((license, index) => (
                //  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">License Name</Typography>
                    <Typography>{license.name || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">License Type</Typography>
                    <Typography>{license.license || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Valid Until</Typography>
                    <Typography>
                      {/* Debug: Show raw value */}
                      {/* {JSON.stringify(license.validity)} */}
                      {
                        license.validity && typeof license.validity === 'string' && /^\d{4}-\d{2}-\d{2}/.test(license.validity)
                          ? new Date(license.validity + 'T00:00:00').toLocaleDateString()
                          : 'N/A'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Rating</Typography>
                    <Typography>{license.rating || 'N/A'}</Typography>
                  </Grid>
                </Grid>
                //      </Paper>
              ))}


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>WORK EXPERIENCE</Typography>
              {selectedApplicant?.work_experiences?.map((exp, index) => (
                //   <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Company Name</Typography>
                    <Typography>{exp.company_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Position</Typography>
                    <Typography>{exp.position}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="text.secondary">Job Description</Typography>
                    <Typography>{exp.job_description}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Start Date</Typography>
                    <Typography>
                      {
                        exp.date_start
                          ? (() => {
                            // Accept both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:mm:ss' formats
                            const d = new Date(exp.date_start);
                            return isNaN(d.getTime())
                              ? (
                                /^\d{4}-\d{2}-\d{2}$/.test(exp.date_start)
                                  ? new Date(exp.date_start + 'T00:00:00').toLocaleDateString()
                                  : 'N/A'
                              )
                              : d.toLocaleDateString();
                          })()
                          : 'N/A'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">End Date</Typography>
                    <Typography>
                      {
                        exp.date_end
                          ? (() => {
                            const d = new Date(exp.date_end);
                            return isNaN(d.getTime())
                              ? (
                                /^\d{4}-\d{2}-\d{2}$/.test(exp.date_end)
                                  ? new Date(exp.date_end + 'T00:00:00').toLocaleDateString()
                                  : 'N/A'
                              )
                              : d.toLocaleDateString();
                          })()
                          : 'Present'
                      }
                    </Typography>
                  </Grid>
                </Grid>
                //    </Paper>
              ))}


              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>OTHER SKILLS</Typography>
              <Box sx={{ mb: 2 }}>
                {selectedApplicant?.other_skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill.skills}
                    sx={chipStyles}
                  />
                ))}
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                SALARY
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  defaultValue="20,000 - 30,000"
                  variant="outlined"
                />
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                <b>Hired:</b>  {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Job Card Component - Mobile */}
        <div className="lg:hidden w-full max-w-md mx-auto py-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleViewDetails(job)}
            />
          ))}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-4 right-4 lg:hidden">
          <Button
            variant="contained"
            color="primary"
            onClick={createJobOpen}
            className="rounded-full shadow-md"
            size="large"
          >
            <WorkIcon />
          </Button>
        </div>
      </div>
  
    </div>
  );
};


export default PostedJob;

