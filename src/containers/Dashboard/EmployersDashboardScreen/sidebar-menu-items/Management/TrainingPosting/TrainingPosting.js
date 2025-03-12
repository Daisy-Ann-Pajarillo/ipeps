import React, { useState } from 'react';
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

const schema = yup.object().shape({
  training_title: yup.string().required('Training title is required'),
  training_description: yup.string().required('Training description is required'),
  expiration_date: yup.date().required('Expiration date is required'),
});

const TrainingPosting = ({ isCollapsed }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [images, setImages] = useState([]);
  const maxImages = 3;
  const headerHeight = '72px';

  const onSubmit = async (data) => {
    const formattedData = {
      training_title: data.training_title,
      training_description: data.training_description,
      expiration_date: data.expiration_date instanceof Date ? data.expiration_date.toISOString().split('T')[0] : data.expiration_date,
    };
    try {
      const response = await axios.post('/api/training-posting', formattedData);
      if (response.status === 201) {
        toast.success('Training posted successfully!', { autoClose: 3000 });
        setTimeout(() => {
          window.location.reload();
        }, 3000)
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
    <Box>
      <Box sx={{ display: 'flex', position: 'fixed', top: headerHeight, left: isCollapsed ? '80px' : '250px', right: 0, bottom: 0 }}>
        <Box sx={{ width: '60%', p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Create Training Post
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>Training Title</InputLabel>
                <TextField fullWidth {...register('training_title')} error={!!errors.training_title} helperText={errors.training_title?.message} />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Training Description</InputLabel>
                <TextField fullWidth multiline rows={4} {...register('training_description')} error={!!errors.training_description} helperText={errors.training_description?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Expiration Date</InputLabel>
                <TextField type="date" fullWidth {...register('expiration_date')} error={!!errors.expiration_date} helperText={errors.expiration_date?.message} InputLabelProps={{ shrink: true }} />
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
        <Box sx={{ width: '40%', backgroundColor: 'white' }}>
          <PostedTraining />
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default TrainingPosting;
