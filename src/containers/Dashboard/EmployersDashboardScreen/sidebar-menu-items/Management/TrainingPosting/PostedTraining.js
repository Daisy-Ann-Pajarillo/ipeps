import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Slide,
  IconButton,
  Grid,
  Divider,
  Card,
  CardMedia,
  TextField,
  InputLabel,
  Avatar,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import axios from '../../../../../../axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CloudUpload } from '@mui/icons-material';


import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import AddIcon from '@mui/icons-material/Add';
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


const schema = yup.object().shape({
  training_title: yup.string().required('Training title is required'),
  training_description: yup.string().required('Training description is required'),
  expiration_date: yup.date().required('Expiration date is required'),
});


const PostedTraining = () => {
  const theme = useTheme();
  const [trainingData, setTrainingData] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createTrainingOpen, setCreateTrainingOpen] = useState(false);
  const [images, setImages] = useState([]);
  const maxImages = 3;
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [trainingApplicants, setTrainingApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);
  const [fullDetailsOpen, setFullDetailsOpen] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);


  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  // Load authentication state


  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });


  // Add this to watch the slots value
  const watchedSlots = watch("slots");


  // Log when the slots value changes
  useEffect(() => {
    console.log("Current slots value:", watchedSlots);
  }, [watchedSlots]);


  //Get Training Data
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get('/api/get-training-postings', {
          auth: { username: auth.token }
        });
        const data = Array.isArray(response.data.training_postings) ? response.data.training_postings : [];
        console.log('Training Data from API:', data); // Debug log
        setTrainingData(data);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };


    fetchTrainingData();
  }, [auth.token]);


  // More thorough debug log to check training record structure
  useEffect(() => {
    if (trainingData.length > 0) {
      console.log("First training record:", trainingData[0]);
      console.log("All field names in training record:", Object.keys(trainingData[0]));
    }
  }, [trainingData]);


  const handleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const handleTrainingClick = (training) => {
    console.log("Selected training:", training); // Debug log
    setSelectedTraining(training);
    setDetailsOpen(true);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };


  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
  };


  const handleCreateTraining = () => {
    setCreateTrainingOpen(true);
  };


  const handleCloseCreateTraining = () => {
    setCreateTrainingOpen(false);
  };


  const onSubmit = async (data) => {
    console.log("Form data on submit:", data);
    console.log("Slots value on submit:", data.slots);


    const formattedData = {
      training_title: data.training_title,
      training_description: data.training_description,
      expiration_date: data.expiration_date instanceof Date
        ? data.expiration_date.toISOString().split('T')[0]
        : data.expiration_date,
      slots: data.slots // Ensure slots is included in the submission
    };


    console.log("Formatted data being sent:", formattedData);


    try {
      const response = await axios.post('/api/training-posting', formattedData, {
        auth: { username: auth.token }
      });


      if (response.status === 201) {
        toast.success('Training posted successfully!', { autoClose: 3000 });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error('Failed to post training!');
      }
    } catch (error) {
      toast.error('Error submitting training data!');
    }
  };


  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };


  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleViewApplicants = async (trainingId) => {
    console.log("Attempting to fetch applicants for training ID:", trainingId); // Debug log
    try {
      if (!trainingId) {
        console.error('Training ID is undefined. Selected Training:', selectedTraining); // Debug log
        toast.error('Invalid training ID');
        return;
      }


      const response = await axios.get(`/api/get-applied-trainings/${trainingId}`, {
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
            // Just store place_of_birth directly as the location
            location: personalInfo.place_of_birth || 'Not provided',
            educational_background: applicant.user_details?.educational_background || [],
            trainings: applicant.user_details?.trainings || [],
            professional_licenses: applicant.user_details?.professional_licenses || [],
            work_experiences: applicant.user_details?.work_experiences || [],
            other_skills: applicant.user_details?.other_skills || [],
            job_preference: applicant.user_details?.job_preference || {},
            personal_information: personalInfo
          };
        });
        setTrainingApplicants(formattedApplicants);
        setApplicantsOpen(true);


        if (formattedApplicants.length === 0) {
          toast.info("No applicants found for this training");
        }
      }
    } catch (error) {
      console.error('Error fetching training applicants:', error);
      toast.error('Error loading applicants. Please try again later.');
    }
  };


  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };


  const handleAcceptApplicant = async (applicantId) => {
    try {
      // For demo, just update the state locally
      setTrainingApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'accepted' } : app
        )
      );


      setSelectedApplicant(prev => ({ ...prev, status: 'accepted' }));
      toast.success('Applicant accepted successfully!');


      /* In production:
      const response = await axios.post(`/api/accept-training-applicant`,
        { applicant_id: applicantId, training_id: selectedTraining.id },
        { auth: { username: auth.token } }
      );
     
      if (response.status === 200) {
        toast.success('Applicant accepted successfully!');
        // Refresh the applicants list
        handleViewApplicants(selectedTraining.id);
      } else {
        toast.error('Failed to accept applicant');
      }
      */
    } catch (error) {
      console.error('Error accepting applicant:', error);
      toast.error('Error processing request');
    }
  };


  const handleRejectApplicant = async (applicantId) => {
    try {
      // For demo, just update the state locally
      setTrainingApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'rejected' } : app
        )
      );


      setSelectedApplicant(prev => ({ ...prev, status: 'rejected' }));
      toast.success('Applicant rejected');


      /* In production:
      const response = await axios.post(`/api/reject-training-applicant`,
        { applicant_id: applicantId, training_id: selectedTraining.id },
        { auth: { username: auth.token } }
      );
     
      if (response.status === 200) {
        toast.success('Applicant rejected');
        // Refresh the applicants list
        handleViewApplicants(selectedTraining.id);
      } else {
        toast.error('Failed to reject applicant');
      }
      */
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      toast.error('Error processing request');
    }
  };


  // Simplified helper function to get slot value directly
  const getSlotValue = (training) => {
    console.log(`Raw training object:`, training);


    // Log each potential field value separately for clarity
    console.log(`slots value: ${training.slots}`);
    console.log(`no_of_slots value: ${training.no_of_slots}`);


    // Directly return user-entered value or undefined
    return training.slots;
  };


  const handleViewFullDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setOpenDetailDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
  };


  const chipStyles = {
    m: 0.5,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  };


  const formatDataToMatch = (applicant) => {
    return {
      ...applicant,
      educational_text: applicant.educational_background?.map(edu => {
        const degree = edu.degree_or_qualification || 'Bachelor of Science';
        const field = edu.field_of_study || 'Computer Science';
        const school = edu.school_name || edu.school || 'University of Example';
        return `${degree} in ${field}, ${school}`;
      }).join('; ') || 'Not provided',
      experience_text: applicant.work_experiences?.map(work =>
        `${work.position || 'N/A'} at ${work.company_name || 'N/A'}`
      ).join('; ') || 'Not provided',
      skills_text: applicant.other_skills?.map(skill =>
        typeof skill === 'object' ? skill.skills : skill
      ).join(', ') || 'Not provided'
    };
  };


  return (
    <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {createTrainingOpen ? (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Training Posting</Typography>
            <IconButton onClick={handleCloseCreateTraining}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />


          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>Training Title</InputLabel>
                <TextField fullWidth {...register('training_title')} error={!!errors.training_title} helperText={errors.training_title?.message} />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Training Description</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  {...register('training_description')}
                  error={!!errors.training_description}
                  helperText={errors.training_description?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Expiration Date</InputLabel>
                <TextField type="date" fullWidth {...register('expiration_date')} error={!!errors.expiration_date} helperText={errors.expiration_date?.message} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Slots</InputLabel>
                <TextField
                  type="number"
                  {...register("slots")}
                  fullWidth
                  placeholder='number of slots'
                  error={!!errors.slot}
                  helperText={errors.slot?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Upload Images (Max {maxImages})</Typography>
                <input accept="image/*" type="file" multiple onChange={handleImageUpload} hidden id="image-upload" />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" startIcon={<CloudUpload />} disabled={images.length >= maxImages}>
                    Upload Images
                  </Button>
                </label>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  {images.map((image, index) => (
                    <Box key={index} sx={{ position: 'relative', width: 100, height: 100 }}>
                      <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: -10, right: -10, boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue' }}>
                Create Training Post
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <Box sx={{ height: '100%', position: 'relative', display: 'flex' }}>
          <Box sx={{
            height: '100%',
            overflowY: 'auto',
            p: 3,
            width: detailsOpen ? 'calc(100% - 400px)' : '100%',
            transition: 'width 0.3s ease'
          }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Training Posted</Typography>
            </Box>


            <Box
              className={`p-6 grid gap-3 grid-cols-3`}
            >
              {trainingData.map((training) => (
                <Paper
                  key={training.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                    height: '100%'
                  }}
                  onClick={() => handleTrainingClick(training)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={training.logo}
                      alt={training.company || "Company"}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{training.training_title}</Typography>
                      <Typography variant="body2" color="text.secondary">{training.company || "Company"}</Typography>
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
                    {training.training_description}
                  </Typography>


                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      Slots: {getSlotValue(training)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiration: {training.expiration_date || "Not specified"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      Status:
                      <Button
                        variant="contained"
                        color={getStatusColor(training.status)}
                        sx={{
                          borderRadius: '4px',
                          padding: '2px 8px',
                          marginLeft: '8px',
                          fontSize: '0.875rem',
                          textTransform: 'capitalize',
                          lineHeight: '1.5',
                          minWidth: 'auto',
                          height: '24px'
                        }}
                      >
                        {training.status}
                      </Button>
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>


          {/* Sliding details panel */}
          <Slide direction="left" in={detailsOpen} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '400px',
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
                p: 3,
                overflowY: 'auto',
                zIndex: 100,
                borderLeft: '1px solid #e0e0e0'
              }}
            >
              {selectedTraining && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {applicantsOpen ?
                        (showApplicantDetails ? "Applicant Details" : "Training Applicants") :
                        "Training Details"}
                    </Typography>
                    <IconButton onClick={handleCloseDetails}>
                      <CloseIcon />
                    </IconButton>
                  </Box>


                  <Divider sx={{ mb: 2 }} />


                  {/* Show training details when applicants section is closed */}
                  {!applicantsOpen && !showApplicantDetails && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="primary">{selectedTraining.training_title}</Typography>
                      </Grid>


                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
                        <Typography variant="body1">{selectedTraining.training_description}</Typography>
                      </Grid>


                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
                        <Button
                          variant="contained"
                          color={getStatusColor(selectedTraining.status)}
                          sx={{
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            mt: 1
                          }}
                        >
                          {selectedTraining.status}
                        </Button>
                      </Grid>


                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Expiration Date</Typography>
                        <Typography variant="body1">
                          {selectedTraining.expiration_date || 'Not specified'}
                        </Typography>
                      </Grid>


                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Slots</Typography>
                        <Typography variant="body1">
                          {getSlotValue(selectedTraining)}
                        </Typography>
                      </Grid>


                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<PersonIcon />}
                          onClick={() => {
                            console.log("Training ID being used:", selectedTraining?.training_id); // Debug log
                            handleViewApplicants(selectedTraining?.training_id)
                          }}
                        >
                          View Applicants
                        </Button>
                      </Grid>
                    </Grid>
                  )}


                  {/* Show applicants section when opened */}
                  {applicantsOpen && !showApplicantDetails && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          Applicants ({trainingApplicants.length})
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


                      {trainingApplicants.length === 0 ? (
                        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                          No applicants yet
                        </Typography>
                      ) : (
                        <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                          {trainingApplicants.map((applicant) => (
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
                                        applicant.status === 'accepted' ? 'success' :
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                                onClick={() => handleAcceptApplicant(selectedApplicant.id)}
                              >
                                Accept Trainee
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
      )}


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


export default PostedTraining;
