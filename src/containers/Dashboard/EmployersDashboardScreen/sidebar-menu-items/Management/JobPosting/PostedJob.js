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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "@mui/material";
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import SearchIcon from '@mui/icons-material/Search';

// Function to map status to MUI color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'closed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};


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
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);


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


  // Filter and sort jobs
  useEffect(() => {
    let updatedJobs = [...jobs];

    // Text search filter
    if (query) {
      updatedJobs = updatedJobs.filter(
        (j) =>
          j.job_title?.toLowerCase().includes(query.toLowerCase()) ||
          j.job_description?.toLowerCase().includes(query.toLowerCase()) ||
          j.city_municipality?.toLowerCase().includes(query.toLowerCase()) ||
          j.country?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Job type filter
    if (jobType) {
      updatedJobs = updatedJobs.filter((j) => j.job_type === jobType);
    }

    // Experience level filter
    if (experienceLevel) {
      updatedJobs = updatedJobs.filter((j) => j.experience_level === experienceLevel);
    }

    // Sort options
    if (sortBy === "Most Recent") {
      updatedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "Salary") {
      updatedJobs.sort((a, b) => (b.estimated_salary_from || 0) - (a.estimated_salary_from || 0));
    }

    setFilteredJobs(updatedJobs);
  }, [jobs, query, jobType, experienceLevel, sortBy]);


  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <TravelExploreOutlinedIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Posted Jobs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your job postings</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</span>
        </div>
      </header>

      {/* Search Bar Section */}
      <div className="w-full bg-[#1a237e] dark:bg-[#0d1544] shadow-lg sm:shadow-xl py-4 px-2 sm:px-4">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex flex-row items-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
            <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Job Type</option>
            <option value="Full-Time">Full Time</option>
            <option value="Part-Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Experience Level</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Sort By</option>
            <option value="Most Recent">Most Recent</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <Box sx={{ height: "100%", position: "relative", display: "flex" }}>
        {/* Jobs List */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none p-4">
          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-180px)] overflow-y-auto">
            {jobs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No jobs posted yet.
                </Typography>
              </Paper>
            ) : filteredJobs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No jobs found matching your criteria.
                </Typography>
              </Paper>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.job_id}
                  onClick={() => handleViewDetails(job)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                    selectedJob?.job_id === job.job_id
                      ? "border-blue-500 ring-2 ring-blue-400"
                      : "border-gray-200 dark:border-gray-700"
                  } p-4`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={job.logo || "http://bij.ly/4ib59B1"}
                        alt={job.job_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.city_municipality}, {job.country}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.job_type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Panel - Similar to JobView */}
        {selectedJob && (
          <Slide direction="left" in={detailsPanelOpen} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: "fixed",
                right: 0,
                top: 0,
                width: "600px",
                height: "100%",
                bgcolor: "background.paper",
                boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
                overflowY: "auto",
                zIndex: 1200,
              }}
            >
              {/* Copy the structure from JobView component here */}
              {/* ... */}
            </Box>
          </Slide>
        )}
      </Box>
    </div>
  );
};


export default PostedJob;

