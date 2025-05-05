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
  Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "@mui/material";


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
        const formattedApplicants = response.data.applications.map(applicant => {
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
            // Just store place_of_birth directly as the location
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
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Admin Remarks</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedJob.remarks || "Not specified"}
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
                        onClick={() => handleViewApplicants(selectedJob?.job_id)}
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
                        <Typography variant="body1">
                          {selectedApplicant?.location}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                        <Typography variant="body1">
                          {selectedApplicant.educational_background && selectedApplicant.educational_background.length > 0
                            ? selectedApplicant.educational_background.map((edu, idx) =>
                              `${edu.degree_or_qualification || ''}${edu.field_of_study ? ' in ' + edu.field_of_study : ''}${edu.school_name ? ', ' + edu.school_name : ''}`
                            ).join('; ')
                            : 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                        <Typography variant="body1">
                          {selectedApplicant.work_experiences && selectedApplicant.work_experiences.length > 0
                            ? selectedApplicant.work_experiences.map((exp, idx) =>
                              `${exp.position || ''}${exp.company_name ? ' at ' + exp.company_name : ''}`
                            ).join('; ')
                            : 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                        <Typography variant="body1">
                          {selectedApplicant.other_skills && selectedApplicant.other_skills.length > 0
                            ? selectedApplicant.other_skills.map(skill => skill.skills).join(', ')
                            : 'Not provided'}
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
          </Box>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};


export default PostedJob;

