import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
  InputLabel,
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostedTraining from './PostedTraining';
import { CloudUpload, Close as CloseIcon } from '@mui/icons-material';
import axios from '../../../../../../axios';

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  training_title: yup.string().required('Training title is required'),
  training_description: yup.string().required('Training description is required'),
  expiration_date: yup.date().required('Expiration date is required'),
  slots: yup.number().required('Number of slots is required').positive().integer(),
});

const TrainingPosting = () => {
  const [createTrainingOpen, setCreateTrainingOpen] = useState(false);
  const [companyStatus, setCompanyStatus] = useState("");
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

  const [images, setImages] = useState([]);
  const maxImages = 3;

  const onSubmit = async (data) => {
    const formattedData = {
      training_title: data.training_title,
      training_description: data.training_description,
      expiration_date: data.expiration_date instanceof Date
        ? data.expiration_date.toISOString().split('T')[0]
        : data.expiration_date,
      slots: data.slots
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

  useEffect(() => {
    axios.get('/api/get-company-information', {
      auth: { username: auth.token }
    })
      .then((response) => {
        setCompanyStatus(response.data.company_information.status)
      })
      .catch((error) => {
        console.error('Error data:', error);

      });
  }, []);

  const navigate = useNavigate();

  // Function to handle button click
  const handleButtonClick = () => {
    if (companyStatus === "pending") {
      // Optionally, show a modal or alert instead of immediate redirection
      alert("Your company status is pending. Please complete your company details before posting a training.");
      navigate("/dashboard/manage-employers")
    } else if (companyStatus === "accept") {
      setCreateTrainingOpen(!createTrainingOpen);
    }
    else if (companyStatus === "reject") {
      alert("Your company status is rejected. Please contact support for more information.");
      navigate("/dashboard/manage-employers")
    } else {
      alert("Error. Please check your company status.");
      navigate("/dashboard/manage-employers")
    }
  };

  return (
    <Box className="flex flex-col w-full h-full">
      <Grid container className="h-full">
        <Grid item xs={12}>
          <Button
            onClick={handleButtonClick}
            className="flex items-center justify-center w-full"
            sx={{
              backgroundColor: createTrainingOpen ? "#f44336" : "#1976d2",
              "&:hover": {
                backgroundColor: createTrainingOpen ? "#d32f2f" : "#115293",
              },
              color: "white",
              py: 1,
              transition: "background-color 0.3s ease", // Smooth hover effect
            }}
            aria-label={companyStatus === "pending" ? "Complete company details" : createTrainingOpen ? "Cancel Training posting" : "Create Training posting"}
          >
            <Typography
              variant="h5"
              className="w-full text-center font-bold py-5"
              sx={{ color: "white" }}
            >
              {companyStatus === "pending" ? (
                <>
                  Finish Company Details
                  <br />
                  <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                    You can't post training without completing company details.
                  </span>
                </>
              ) : createTrainingOpen ? (
                "Cancel Training Posting"
              ) : (
                "Create Training Posting"
              )}
            </Typography>
          </Button>
        </Grid>

        <Grid container className="flex-grow h-[calc(100%-64px)]">
          {createTrainingOpen ? (
            <Grid item xs={12} className="h-full overflow-y-auto">
              <Box className="px-8 pb-5">
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
                        placeholder='Number of slots'
                        error={!!errors.slots}
                        helperText={errors.slots?.message}
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
                  <Button type="submit" variant="contained" fullWidth className="mt-5 bg-blue-600 text-white">
                    Create Training Post
                  </Button>
                </form>
                <ToastContainer />
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12} className="h-full">
              <PostedTraining createTrainingOpen={createTrainingOpen} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainingPosting;