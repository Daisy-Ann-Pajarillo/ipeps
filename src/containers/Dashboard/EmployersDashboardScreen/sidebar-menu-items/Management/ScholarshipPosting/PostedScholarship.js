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
  TextField,
  InputLabel,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  useTheme
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { CloudUpload } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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


const scholarshipSchema = yup.object().shape({
  scholarship_title: yup.string().required("Scholarship Title is required"),
  scholarship_description: yup.string().required("Scholarship Description is required"),
  expiration_date: yup.date().required("Expiration Date is required"),
});


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
    <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
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
              Scholarship Posted
            </Typography>
          </Box>


          <Box
            className={`p-6 grid gap-3 grid-cols-3`}
          >
            {scholarships.map((scholarship) => (
              <Paper
                key={scholarship.id}
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
                onClick={() => handleViewDetails(scholarship)}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={scholarship.logo}
                    alt={scholarship.company || "Company"}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {scholarship.scholarship_title || scholarship.scholarship_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{scholarship.company || "Company"}</Typography>
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
                  {scholarship.scholarship_description || scholarship.description || "No description provided"}
                </Typography>


                <Box sx={{ mt: "auto" }}>
                  <Typography variant="body2" color="text.secondary">
                    Slots: {getSlotValue(scholarship)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {scholarship.expiration_date || scholarship.expiration || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    Status:
                    <Button
                      variant="contained"
                      color={getStatusColor(scholarship.status)}
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
                      {scholarship.status}
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
            {selectedScholarship && (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                    {applicantsOpen ?
                      (showApplicantDetails ? "Applicant Details" : "Scholarship Applicants") :
                      selectedScholarship.scholarship_title || selectedScholarship.scholarship_name}
                  </Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>


                <Divider sx={{ mb: 2 }} />


                {!applicantsOpen && !showApplicantDetails && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={selectedScholarship.logo}
                        alt={selectedScholarship.company}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{selectedScholarship.company}</Typography>
                      </Box>
                    </Grid>


                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Button
                        variant="contained"
                        color={getStatusColor(selectedScholarship.status)}
                        sx={{
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "0.875rem",
                          textTransform: "capitalize",
                          lineHeight: "1.5",
                          minWidth: "auto",
                        }}
                      >
                        {selectedScholarship.status}
                      </Button>
                    </Grid>


                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Slots Available</Typography>
                      <Typography variant="body1">{getSlotValue(selectedScholarship)}</Typography>
                    </Grid>


                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Expiration</Typography>
                      <Typography variant="body1">
                        {selectedScholarship.expiration_date || selectedScholarship.expiration || "Not specified"}
                      </Typography>
                    </Grid>


                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedScholarship.scholarship_description || selectedScholarship.description || "No description provided"}
                      </Typography>
                    </Grid>


                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PersonIcon />}
                        onClick={() => handleViewApplicants(selectedScholarship?.scholarship_id)}
                      >
                        View Applicants
                      </Button>
                    </Grid>
                  </Grid>
                )}


                {applicantsOpen && !showApplicantDetails && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">
                        Applicants ({scholarshipApplicants.length})
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


                    {scholarshipApplicants.length === 0 ? (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                        No applicants yet
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {scholarshipApplicants.map((applicant) => (
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
                                      applicant.status === 'approved' ? 'success' :
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


                {showApplicantDetails && selectedApplicant && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">Application Review</Typography>
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
                        <Typography variant="body1">{formatDataToMatch(selectedApplicant).educational_text}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                        <Typography variant="body1">{formatDataToMatch(selectedApplicant).experience_text}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                        <Typography variant="body1">{formatDataToMatch(selectedApplicant).skills_text}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mb: 2 }}
                          onClick={() => handleViewFullDetails(selectedApplicant)}
                        >
                          VIEW FULL DETAILS OF APPLICANT
                        </Button>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Application Status</Typography>
                        {selectedApplicant.status !== 'accepted' && selectedApplicant.status !== 'rejected' ? (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={() => handleApproveApplicant(selectedApplicant.id)}
                            >
                              Accept
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
                              color: selectedApplicant.status === 'accepted' ? 'success.main' : 'error.main',
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


      {/* Add the Dialog component at the end before ToastContainer */}
      {/* Full Details Modal */}
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
                <Typography color="text.secondary">Prefix</Typography>
                <Typography>{selectedApplicant?.personal_information?.prefix || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography color="text.secondary">First Name</Typography>
                <Typography>{selectedApplicant?.personal_information?.first_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Middle Name</Typography>
                <Typography>{selectedApplicant?.personal_information?.middle_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Last Name</Typography>
                <Typography>{selectedApplicant?.personal_information?.last_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Suffix</Typography>
                <Typography>{selectedApplicant?.personal_information?.suffix || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Sex</Typography>
                <Typography>{selectedApplicant?.personal_information?.sex || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Date of Birth</Typography>
                <Typography>{selectedApplicant?.personal_information?.date_of_birth || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Place of Birth</Typography>
                <Typography>{selectedApplicant?.personal_information?.place_of_birth || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Civil Status</Typography>
                <Typography>{selectedApplicant?.personal_information?.civil_status || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Phone Number</Typography>
                <Typography>{selectedApplicant?.personal_information?.cellphone_number || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="text.secondary">Religion</Typography>
                <Typography>{selectedApplicant?.personal_information?.religion || 'N/A'}</Typography>
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
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
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
              </Paper>
            ))}


            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>TRAININGS</Typography>
            {selectedApplicant?.trainings?.map((training, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
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
              </Paper>
            ))}


            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>PROFESSIONAL LICENSE</Typography>
            {selectedApplicant?.professional_licenses?.map((license, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
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
              </Paper>
            ))}


            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>WORK EXPERIENCE</Typography>
            {selectedApplicant?.work_experiences?.map((exp, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
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
              </Paper>
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


export default PostedScholarship;