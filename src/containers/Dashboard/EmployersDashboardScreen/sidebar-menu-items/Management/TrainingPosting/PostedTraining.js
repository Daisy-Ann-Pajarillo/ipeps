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
  Avatar
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

        const responseData = response.data;
        const data = Array.isArray(responseData.training_postings) 
          ? responseData.training_postings 
          : [];

        console.log('Complete Raw Training Data:', responseData); // Log the entire response
        console.log('Training Data Array:', data); // Log the training data array

        // Log all potential slot field names for the first item if available
        if (data.length > 0) {
          console.log('First training item field names:', Object.keys(data[0]));
          console.log('Potential slot values in first item:', {
            slots: data[0].slots,
            no_of_slots: data[0].no_of_slots,
            vacancies: data[0].vacancies,
            no_of_vacancies: data[0].no_of_vacancies,
            slot: data[0].slot,
            rawObject: JSON.stringify(data[0])
          });
        }

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
    console.log("Viewing training details with slots:", training.slots);
    setSelectedTraining(training);
    setDetailsOpen(true);
    // Reset applicant views when showing a new training
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
    try {
      // In a real app, you'd fetch from an API
      // For demo purposes, we'll create dummy data
      const dummyApplicants = [
        {
          id: 1,
          first_name: "David",
          last_name: "Reyes",
          email: "david.reyes@example.com",
          phone_number: "+639876543210",
          location: "Makati, Philippines",
          education: "BSIT, University of Manila",
          statement: "I'm interested in this training program to enhance my web development skills...",
          application_date: "2023-07-20",
          profile_pic: "",
          status: "pending"
        },
        {
          id: 2,
          first_name: "Maria",
          last_name: "Cruz",
          email: "maria.cruz@example.com",
          phone_number: "+639123456789",
          location: "Pasig, Philippines",
          education: "BS Computer Science, State University",
          statement: "Looking to expand my knowledge in this field to apply it to my current work...",
          application_date: "2023-07-19",
          profile_pic: "",
          status: "pending"
        },
        {
          id: 3,
          first_name: "Juan",
          last_name: "Dela Cruz",
          email: "juan.delacruz@example.com",
          phone_number: "+639111222333",
          location: "Quezon City, Philippines",
          education: "BSIT, Philippine College",
          statement: "I'm eager to learn new skills that will help me advance in my career...",
          application_date: "2023-07-18",
          profile_pic: "",
          status: "accepted"
        }
      ];
      
      setTrainingApplicants(dummyApplicants);
      setApplicantsOpen(true);
      
      /* In production, you'd use actual API:
      const response = await axios.get(`/api/training-applicants/${trainingId}`, {
        auth: { username: auth.token }
      });
      
      if (response.status === 200) {
        setTrainingApplicants(response.data.applicants || []);
        setApplicantsOpen(true);
      } else {
        console.error('Failed to fetch training applicants');
        toast.error('Failed to fetch applicants');
      }
      */
    } catch (error) {
      console.error('Error fetching training applicants:', error);
      toast.error('Error loading applicants');
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
          app.id === applicantId ? {...app, status: 'accepted'} : app
        )
      );
      
      setSelectedApplicant(prev => ({...prev, status: 'accepted'}));
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
          app.id === applicantId ? {...app, status: 'rejected'} : app
        )
      );
      
      setSelectedApplicant(prev => ({...prev, status: 'rejected'}));
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
                          onClick={() => handleViewApplicants(selectedTraining.id)}
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
                          <Typography variant="subtitle2" color="text.secondary">Statement</Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {selectedApplicant.statement || 'No statement provided'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sx={{ mt: 2 }}>
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
      <ToastContainer />
    </Box>
  );
};

export default PostedTraining;
