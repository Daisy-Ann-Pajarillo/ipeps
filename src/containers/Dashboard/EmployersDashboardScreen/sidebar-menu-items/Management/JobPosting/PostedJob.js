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
  CardMedia 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer } from 'react-toastify';
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
  };

  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
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
                    {selectedJob.job_title}
                  </Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
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
                </Grid>
              </>
            )}
          </Box>
        </Slide>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default PostedJob;
