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
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const response = await axios.get(`/api/approved-applicants`, {
        auth: { username: auth.token }
      });
      if (response.status === 200) {
        console.log("API Response:", response.data);
        const responseData = response.data;
        
        // Convert object to array if needed
        const applicantsData = responseData.approved_applicants ? 
          (Array.isArray(responseData.approved_applicants) ? 
            responseData.approved_applicants : 
            [responseData.approved_applicants]
          ) : [];

        // Map all user details from the database
        const formattedApplicants = applicantsData.map((applicant) => {
          try {
            const personalInfo = applicant.user_details?.personal_information || {};
            const preferredWork = applicant.user_details?.preferred_work_location || {};
            
            return {
              // Personal Information
              id: applicant.application_id,
              prefix: personalInfo.prefix || 'N/A',
              first_name: personalInfo.first_name || 'N/A',
              middle_name: personalInfo.middle_name || 'N/A', 
              last_name: personalInfo.last_name || 'N/A',
              suffix: personalInfo.suffix || 'N/A',
              sex: personalInfo.sex || 'N/A',
              date_of_birth: personalInfo.date_of_birth || 'N/A',
              place_of_birth: personalInfo.place_of_birth || 'N/A',
              civil_status: personalInfo.civil_status || 'N/A',
              height: personalInfo.height || 'N/A',
              weight: personalInfo.weight || 'N/A',
              region: personalInfo.region || 'N/A',
              country: personalInfo.permanent_country || 'N/A',
              province: personalInfo.permanent_province || 'N/A',
              municipality: personalInfo.permanent_municipality || 'N/A',
              zip_code: personalInfo.permanent_zip_code || 'N/A',
              barangay: personalInfo.permanent_barangay || 'N/A',
              street: personalInfo.permanent_house_street || 'N/A',
              cellphone_number: personalInfo.cellphone_number || 'N/A',

              // Preferred Work Location
              preferred_country: preferredWork.country || 'N/A',
              preferred_province: preferredWork.province || 'N/A',
              preferred_municipality: preferredWork.municipality || 'N/A',
              preferred_industry: preferredWork.industry || 'N/A',
              preferred_occupation: preferredWork.occupation || 'N/A',
              expected_salary: preferredWork.expected_salary || 'N/A',

              // Educational Background
              education: applicant.user_details?.educational_background?.map(edu => ({
                school_name: edu.school_name,
                date_from: edu.date_from,
                date_to: edu.date_to,
                degree: edu.degree_or_qualification,
                field_of_study: edu.field_of_study,
                program_duration: edu.program_duration
              })) || [],

              // Trainings
              trainings: applicant.user_details?.trainings?.map(training => ({
                course_name: training.course_name,
                start_date: training.start_date,
                end_date: training.end_date,
                institution: training.training_institution,
                certificate: training.certificate_received,
                hours: training.hours,
                skills: training.skills_acquired,
                credential_id: training.credential_id,
                credential_url: training.credential_url
              })) || [],

              // Professional License
              licenses: applicant.user_details?.professional_licenses?.map(license => ({
                type: license.license_type,
                name: license.license_name,
                date: license.date_received
              })) || [],

              // Work Experience
              work_experience: applicant.user_details?.work_experiences?.map(exp => ({
                company_name: exp.company_name,
                company_address: exp.company_address,
                position: exp.position,
                employment_status: exp.employment_status,
                date_start: exp.date_start,
                date_end: exp.date_end
              })) || [],

              // Other Skills
              other_skills: applicant.user_details?.other_skills?.map(skill => 
                skill.skills
              ) || [],

              // Application Details
              email: applicant.user_details?.email || 'N/A',
              cover_letter: applicant.cover_letter || 'No cover letter provided',
              application_date: applicant.applied_at,
              status: (applicant.application_status || 'pending').toLowerCase()
            };
          } catch (error) {
            console.error('Error formatting applicant data:', error);
            return null;
          }
        }).filter(Boolean);

        setJobApplicants(formattedApplicants);
        setApplicantsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      toast.error("Error loading applicants");
    }
  };

  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleHireApplicant = async (applicantId) => {
    try {
      // For demo, just update the state locally
      setJobApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'hired' } : app
        )
      );
      setSelectedApplicant(prev => ({ ...prev, status: 'hired' }));
      toast.success('Applicant hired successfully!');
    } catch (error) {
      console.error('Error hiring applicant:', error);
      toast.error('Error processing request');
    }
  };

  const handleRejectApplicant = async (applicantId) => {
    try {
      // For demo, just update the state locally
      setJobApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'rejected' } : app
        )
      );
      setSelectedApplicant(prev => ({ ...prev, status: 'rejected' }));
      toast.success('Applicant rejected');
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

  return (
    <Box sx={{ height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: "100%", position: "relative", display: "flex" }}>
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            p: 3,
            width: detailsPanelOpen ? "calc(100% - 400px)" : "100%",
            transition: "width 0.3s ease-in-out"
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Jobs Posted
            </Typography>
          </Box>
          <Box
            className={`p-6 grid gap-3 grid-cols-3`}
          >
            {jobs.map((job) => (
              <Paper
                key={job.id}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  cursor: "pointer",
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                  height: "100%"
                }}
                onClick={() => handleViewDetails(job)}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={job.logo}
                    alt={job.company || "Company"}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {job.job_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{job.company || "Company"}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {job.job_description || "No description provided"}
                </Typography>
                <Box sx={{ mt: "auto" }}>
                  <Typography variant="body2" color="text.secondary">
                    Vacancies: {job.no_of_vacancies || "Not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {job.expiration_date || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    Status:
                    <Button
                      variant="contained"
                      color={getStatusColor(job.status)}
                      sx={{
                        borderRadius: "4px",
                        padding: "2px 8px",
                        marginLeft: "8px",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        lineHeight: "1.5",
                        minWidth: "auto",
                        height: "24px",
                      }}
                    >
                      {job.status}
                    </Button>
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
        {/* Details Panel with slide animation */}
        <Slide direction="left" in={detailsPanelOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "400px",
              height: "100%",
              bgcolor: "background.paper",
              boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
              p: 3,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {selectedJob && (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                    {applicantsOpen ?
                      (showApplicantDetails ? "Applicant Details" : "Job Applicants") :
                      selectedJob.job_title}
                  </Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {/* Show job details when applicants section is closed */}
                {!applicantsOpen && !showApplicantDetails && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={selectedJob.logo}
                        alt={selectedJob.company}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{selectedJob.company}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedJob.job_type} • {selectedJob.experience_level}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Button
                        variant="contained"
                        color={getStatusColor(selectedJob.status)}
                        sx={{
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "0.875rem",
                          textTransform: "capitalize",
                          lineHeight: "1.5",
                          minWidth: "auto",
                        }}
                      >
                        {selectedJob.status}
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Vacancies Available</Typography>
                      <Typography variant="body1">{selectedJob.no_of_vacancies}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Salary Range</Typography>
                      <Typography variant="body1">
                        {selectedJob.estimated_salary_from} - {selectedJob.estimated_salary_to}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">
                        {selectedJob.city_municipality}, {selectedJob.country}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Expiration</Typography>
                      <Typography variant="body1">{selectedJob.expiration_date}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedJob.job_description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Required Skills</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedJob.other_skills || "Not specified"}
                      </Typography>
                    </Grid>
                    {selectedJob.tech_voc_training && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Technical/Vocational Training</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedJob.tech_voc_training}
                        </Typography>
                      </Grid>
                    )}
                    {selectedJob.courses && selectedJob.courses.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                          Training Courses
                        </Typography>
                        {selectedJob.courses.map((course, index) => (
                          <Paper sx={{ p: 2, mb: 2 }} key={index}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {course.course_name}
                            </Typography>
                            <Typography variant="body2">
                              Institution: {course.training_institution}
                            </Typography>
                            <Typography variant="body2">
                              Certificate: {course.certificate_received}
                            </Typography>
                            <Typography variant="body2">
                              Slots: {course.slots}
                            </Typography>
                          </Paper>
                        ))}
                      </Grid>
                    )}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PersonIcon />}
                        onClick={() => handleViewApplicants(selectedJob.id)}
                      >
                        View Applicants
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {/* Show applicants section when opened */}
                {applicantsOpen && !showApplicantDetails && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">
                        Applicants ({jobApplicants.length})
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setApplicantsOpen(false)}
                      >
                        Back to Details
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {jobApplicants.length === 0 ? (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                        No applicants yet
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {jobApplicants.map((applicant) => (
                          <Paper
                            key={applicant.id}
                            sx={{
                              p: 2,
                              mb: 2,
                              cursor: 'pointer',
                              '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => handleViewApplicantDetails(applicant)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={applicant.profile_pic}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              >
                                {applicant.first_name?.[0] || 'A'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {applicant.first_name} {applicant.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Applied: {new Date(applicant.application_date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  Status:
                                  <Button
                                    size="small"
                                    color={
                                      applicant.status === 'hired' ? 'success' :
                                        applicant.status === 'rejected' ? 'error' : 'primary'
                                    }
                                    sx={{ ml: 1, textTransform: 'capitalize', pointerEvents: 'none' }}
                                  >
                                    {applicant.status || 'Pending'}
                                  </Button>
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    )}
                  </>
                )}
                {/* Individual applicant details */}
                {showApplicantDetails && selectedApplicant && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">
                        Application Review
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowApplicantDetails(false)}
                      >
                        Back to Applicants
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar
                        src={selectedApplicant.profile_pic}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      >
                        {selectedApplicant.first_name?.[0] || 'A'}
                      </Avatar>
                      <Typography variant="h6">
                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedApplicant.email}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{selectedApplicant.phone_number || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                        <Typography variant="body1">{selectedApplicant.location || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                        <Typography variant="body1">{selectedApplicant.education || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                        <Typography variant="body1">{selectedApplicant.experience || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                        <Typography variant="body1">{selectedApplicant.skills || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Cover Letter</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedApplicant.cover_letter || 'No cover letter provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PersonIcon />}
                          onClick={handleViewFullDetails}
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          View Full Detail of Applicant
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Application Status</Typography>
                        {selectedApplicant.status !== 'hired' && selectedApplicant.status !== 'rejected' ? (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={() => handleHireApplicant(selectedApplicant.id)}
                            >
                              Hire Applicant
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              onClick={() => handleRejectApplicant(selectedApplicant.id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: 'center',
                              color: selectedApplicant.status === 'hired' ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            This applicant has been {selectedApplicant.status}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Box>
        </Slide>
      </Box>
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
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
              <Grid item xs={2}>
                <Typography>Prefix</Typography>
                <Typography>{selectedApplicant?.user_details?.personal_information?.prefix || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>First Name</Typography>
                <Typography>{selectedApplicant?.user_details?.personal_information?.first_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Middle Name</Typography>
                <Typography>{selectedApplicant?.user_details?.personal_information?.middle_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Last Name</Typography>
                <Typography>{selectedApplicant?.user_details?.personal_information?.last_name || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>PREFERRED WORK LOCATION</Typography>
            <Grid container spacing={2}>
              {/* Add preferred work location fields */}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>EDUCATIONAL BACKGROUND</Typography>
            {selectedApplicant?.user_details?.educational_background?.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {/* Add educational background fields */}
              </Box>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>TRAININGS</Typography>
            {selectedApplicant?.user_details?.trainings?.map((training, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {/* Add training fields */}
              </Box>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>PROFESSIONAL LICENSE</Typography>
            {selectedApplicant?.user_details?.professional_licenses?.map((license, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {/* Add license fields */}
              </Box>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>WORK EXPERIENCE</Typography>
            {selectedApplicant?.user_details?.work_experiences?.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {/* Add work experience fields */}
              </Box>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>OTHER SKILLS</Typography>
            <Box sx={{ mb: 2 }}>
              {selectedApplicant?.user_details?.other_skills?.map((skill, index) => (
                <Chip key={index} label={skill.skills} sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default PostedJob;