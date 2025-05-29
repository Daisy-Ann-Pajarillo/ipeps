import React, { useState, useEffect } from "react";
import axios from "../../../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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


const scholarshipSchema = yup.object().shape({
  scholarship_title: yup.string().required("Scholarship Title is required"),
  scholarship_description: yup.string().required("Scholarship Description is required"),
  expiration_date: yup.date().required("Expiration Date is required"),
});


const ScholarshipCard = ({ scholarship, onClick, selected }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex flex-col sm:flex-row gap-3 mb-4 ${selected ? 'ring-2 ring-blue-400 border-blue-500' : ''}`}
  >
    <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
      <img
        src={scholarship.logo || "http://bij.ly/4ib59B1"}
        alt={scholarship.company || "Scholarship"}
        className="w-full h-full object-contain p-2"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
        {scholarship.scholarship_title || scholarship.scholarship_name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
        {scholarship.company}
      </p>
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
        {/* Add scholarship tags if you want */}
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
          🧑 Slots: {scholarship.slots}
        </span>
        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
          📅 {scholarship.expiration_date || scholarship.expiration}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
          scholarship.status?.toLowerCase() === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {scholarship.status}
        </span>
      </div>
    </div>
  </div>
);


const PostedScholarship = () => {
  const theme = useTheme();
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [images, setImages] = useState([]);
  const maxImages = 5;
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [scholarshipApplicants, setScholarshipApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);


  // chipStyles definition
  const chipStyles = {
    m: 0.5,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  };


  // Add this helper function after chipStyles
  const formatDataToMatch = (applicant) => {
    return {
      ...applicant,
      educational_text: applicant.educational_background?.map(edu => {
        const degree = edu.degree_or_qualification || edu.degree || 'Bachelor of Science';
        const field = edu.field_of_study || edu.field || 'Field';
        const school = edu.school_name || edu.institution || edu.school || 'School';
        return `${degree} in ${field}, ${school}`;
      }).join('; ') || 'Not provided',
      experience_text: applicant.work_experiences?.map(work =>
        `${work.position || 'N/A'} at ${work.company_name || work.company || 'N/A'}`
      ).join('; ') || 'Not provided',
      skills_text: applicant.other_skills?.map(skill =>
        typeof skill === 'object' ? skill.skills : skill
      ).join(', ') || 'Not provided'
    };
  };


  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);


  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);


  // Initialize form with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scholarshipSchema),
  });


  useEffect(() => {
    // Fetch scholarship postings from the API
    const fetchScholarships = async () => {
      try {
        const response = await axios.get('/api/get-scholarship-postings', {
          auth: { username: auth.token }
        });


        if (response.status === 200) {
          const responseData = response.data;
          const data = Array.isArray(responseData.scholarship_postings)
            ? responseData.scholarship_postings
            : [];


          setScholarships(data);
        } else {
          console.error('Failed to fetch scholarship postings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching scholarship postings:', error);
      }
    };


    fetchScholarships();
  }, [auth.token]);


  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailsPanelOpen(true);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };


  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
  };


  const handleViewApplicants = async (scholarshipId) => {
    try {
      if (!scholarshipId) {
        console.error('Scholarship ID is undefined:', selectedScholarship);
        toast.error('Invalid scholarship ID');
        return;
      }

      console.log("Attempting to fetch applicants with ID:", scholarshipId); // Debug log


      const response = await axios.get(`/api/get-applied-scholarships/${scholarshipId}`, {
        auth: { username: auth.token }
      });


      if (response.data && Array.isArray(response.data.applications)) {
        const formattedApplicants = response.data.applications.map(applicant => {
          const personalInfo = applicant.user_details?.personal_information || {};
          return {
            id: applicant.application_id,
            application_date: applicant.created_at,
            status: applicant.status || 'pending',
            first_name: personalInfo.first_name || 'N/A',
            last_name: personalInfo.last_name || 'N/A',
            email: applicant.user_details?.email || 'N/A',
            phone_number: personalInfo.cellphone_number || 'N/A',
            location: personalInfo.place_of_birth || 'Not provided',
            educational_background: applicant.user_details?.educational_background || [],
            trainings: applicant.user_details?.trainings || [],
            professional_licenses: applicant.user_details?.professional_licenses || [],
            work_experiences: applicant.user_details?.work_experiences || [],
            other_skills: applicant.user_details?.other_skills || [],
            job_preference: applicant.user_details?.job_preference || {},
            personal_information: personalInfo,
            // 🔥 Safely include user_id from user_details
            user_id: applicant.user_details?.user_id || null
          };

        });


        setScholarshipApplicants(formattedApplicants);
        setApplicantsOpen(true);


        if (formattedApplicants.length === 0) {
          toast.info("No applicants found for this scholarship");
        }
      }
    } catch (error) {
      console.error('Error fetching scholarship applicants:', error);
      toast.error('Error loading applicants. Please try again later.');
    }
  };


  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleApproveApplicant = async (applicantId) => {
    try {
      const applicant = scholarshipApplicants.find(app => app.id === applicantId);
      if (!applicant || !applicant.user_id) {
        toast.error('Applicant data is incomplete');
        return;
      }

      const payload = {
        application_id: applicantId,
        status: 'approved',
        user_id: applicant.user_id,
      };

      console.log('Sending payload:', payload);

      const response = await axios.put('/api/update-scholarship-status', payload, {
        auth: { username: auth.token },
      });

      if (response.status === 200) {
        setScholarshipApplicants(prevApplicants =>
          prevApplicants.map(app =>
            app.id === applicantId ? { ...app, status: 'accepted' } : app
          )
        );

        setSelectedApplicant(prev => ({ ...prev, status: 'accepted' }));
        toast.success('Applicant accepted successfully!');
      } else {
        toast.error('Failed to approve applicant');
      }
    } catch (error) {
      console.error('Error accepting applicant:', error);
      toast.error('Error processing request');
    }
  };


  const handleRejectApplicant = async (applicantId) => {
    try {
      const applicant = scholarshipApplicants.find(app => app.id === applicantId);
      if (!applicant || !applicant.user_id) {
        toast.error('Applicant data is incomplete');
        return;
      }

      const payload = {
        application_id: applicantId,
        status: 'rejected',
        user_id: applicant.user_id,
      };

      console.log('Sending payload:', payload);

      const response = await axios.put('/api/update-scholarship-status', payload, {
        auth: { username: auth.token },
      });

      if (response.status === 200) {
        setScholarshipApplicants(prevApplicants =>
          prevApplicants.map(app =>
            app.id === applicantId ? { ...app, status: 'rejected' } : app
          )
        );

        setSelectedApplicant(prev => ({ ...prev, status: 'rejected' }));
        toast.success('Applicant rejected');
      } else {
        toast.error('Failed to reject applicant');
      }
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      toast.error('Error processing request');
    }
  };


  const getSlotValue = (scholarship) => {
    return scholarship.slots;
  };


  const handleViewFullDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setOpenDetailDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
  };


  return (
    <div className="h-screen w-full flex flex-col">
      <ToastContainer />

      {/* Modern Thin Header */}      
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 flex-none z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900">
            <SchoolIcon className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Scholarship Postings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your scholarship posts</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{scholarships.length}</span>
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
            placeholder="Search scholarship postings..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
      </div>

      {/* Full Details Dialog - Moved to top level and increased z-index */}
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
          {selectedApplicant && (
            <Box sx={{ p: 2 }}>
              {/* About Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>About</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                    <Typography variant="body1">
                      {selectedApplicant.first_name} {selectedApplicant.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{selectedApplicant.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
                    <Typography variant="body1">{selectedApplicant.phone_number}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                    <Typography variant="body1">{selectedApplicant.location}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Educational Background Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Educational Background</Typography>
                {selectedApplicant.educational_background?.map((edu, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {edu.degree_or_qualification || edu.degree}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {edu.school_name || edu.institution}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Field: {edu.field_of_study || edu.field}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Trainings Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Trainings</Typography>
                {selectedApplicant.trainings?.map((training, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {training.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {training.institution}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Professional Licenses Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Professional Licenses</Typography>
                {selectedApplicant.professional_licenses?.map((license, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {license.license_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {license.issuing_body}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Work Experience Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Work Experience</Typography>
                {selectedApplicant.work_experiences?.map((exp, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {exp.position || exp.job_title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {exp.company_name || exp.company}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Other Skills Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedApplicant.other_skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.skills}
                      sx={chipStyles}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Main Content: Scholarship List & Details */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden relative">
        {/* Scholarship List Section */}        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${detailsPanelOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4 pb-20 lg:pb-4 h-full">
            {scholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onClick={() => handleViewDetails(scholarship)}
                selected={selectedScholarship?.id === scholarship.id}
              />
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
                    (showApplicantDetails ? "Applicant Details" : "Scholarship Applicants") :
                    "Scholarship Details"
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
                {/* Details view for selected scholarship */}
                {!applicantsOpen && !showApplicantDetails && selectedScholarship && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-start gap-3 lg:gap-4 pb-4 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-16 h-16 lg:w-24 lg:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img
                          src={selectedScholarship.logo || "http://bij.ly/4ib59B1"}
                          alt={selectedScholarship.company}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {selectedScholarship.scholarship_title || selectedScholarship.scholarship_name}
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2">
                          {selectedScholarship.company}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(selectedScholarship.status)}
                            className="rounded-full text-xs lg:text-sm"
                          >
                            {selectedScholarship.status}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Expiration Date
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          {selectedScholarship.expiration_date || selectedScholarship.expiration}
                        </p>
                      </div>
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Slots
                        </p>
                        <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                          {selectedScholarship.slots}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {selectedScholarship.scholarship_description || selectedScholarship.description}
                      </p>
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={<PersonIcon />}
                      onClick={() => handleViewApplicants(selectedScholarship?.scholarship_id)}
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
                        Applicants ({scholarshipApplicants.length})
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
                      {scholarshipApplicants.length === 0 ? (
                        <div className="text-center py-8">
                          <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
                            No applicants yet
                          </Typography>
                        </div>
                      ) : scholarshipApplicants.map((applicant) => (
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
                                  applicant.status === 'accepted'
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
                        onClick={() => handleViewFullDetails(selectedApplicant)}
                        className="mb-4"
                      >
                        View Full Profile
                      </Button>

                      {selectedApplicant.status !== 'accepted' && selectedApplicant.status !== 'rejected' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApproveApplicant(selectedApplicant.id)}
                            fullWidth
                          >
                            Accept
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
                      {(selectedApplicant.status === 'accepted' || selectedApplicant.status === 'rejected') && (
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: 'center',
                            color: selectedApplicant.status === 'accepted' ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          This applicant has been {selectedApplicant.status}
                        </Typography>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>          </>
        )}
      </div>
    </div>
  );
};


export default PostedScholarship;