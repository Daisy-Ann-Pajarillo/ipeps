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
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  //Get Training Data
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get('/api/get-training-postings', {
          auth: { username: auth.token }
        });

        const data = Array.isArray(response.data.training_postings) 
          ? response.data.training_postings 
          : [];

        console.log('Retrieved Training Data:', data);
        setTrainingData(data);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchTrainingData();
  }, [auth.token]);

  const handleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTrainingClick = (training) => {
    setSelectedTraining(training);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleCreateTraining = () => {
    setCreateTrainingOpen(true);
  };

  const handleCloseCreateTraining = () => {
    setCreateTrainingOpen(false);
  };

  const onSubmit = async (data) => {
    const formattedData = {
      training_title: data.training_title,
      training_description: data.training_description,
      expiration_date: data.expiration_date instanceof Date
        ? data.expiration_date.toISOString().split('T')[0]
        : data.expiration_date,
    };

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
                      Slots: {training.slots || "Not specified"}
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Training Details</Typography>
                    <IconButton onClick={handleCloseDetails}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
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
                        {selectedTraining.slots || 'Not specified'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Uploaded Images</Typography>
                      {selectedTraining.images && selectedTraining.images.length > 0 ? (
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {selectedTraining.images.map((image, index) => (
                            <Grid item xs={6} key={index}>
                              <Card>
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={image.url || '/static/placeholder.png'}
                                  alt={`Training image ${index + 1}`}
                                />
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No images uploaded</Typography>
                      )}
                    </Grid>
                  </Grid>
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
