import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Unselected state
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Selected state
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobView = ({
  job,
  initialIsSaved = false,
  initialIsApplied = false,
  canWithdraw = false,
  applicationTime = null,
  onSave,
  onApply,
}) => {
  const [isSaved, setIsSaved] = React.useState(initialIsSaved);
  const [isApplied, setIsApplied] = React.useState(initialIsApplied);

  const getTimeRemaining = () => {
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleApply = () => {
    if (isApplied) {
      setIsApplied(false);
      toast.success('Application withdrawn successfully!');
    } else {
      setIsApplied(true);
      toast.success('Applied for the job successfully!');
    }
    onApply(); // Call the parent handler
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/saved-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employer_jobpost_id: job.job_id }) // Sending the job ID in the expected format
      });

      if (response.ok) {
        setIsSaved(job.job_id); // Toggle saved state
        toast.success(isSaved ? 'Job removed from saved jobs!' : 'Job saved successfully!');
        onSave(); // Call the parent handler
        console.log('Job saved successfully:', job.job_id);
      } else {
        toast.error('Failed to save job: ' + response.statusText);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error('Error saving job: ' + error.message);
    }
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <ToastContainer />
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, height: '300px', width: '100%', overflow: 'hidden', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <img src={job.companyImage || 'default-company-image.png'} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
        </Box>

        <Typography variant="h4" gutterBottom>{job.job_title}</Typography>
        <Typography variant="h5" color="primary" gutterBottom>{job.country}</Typography>
        
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body1">📍 {job.city_municipality}</Typography>
          <Typography variant="body1">💼 {job.job_type}</Typography>
          <Typography variant="body1">👥 Vacancies: {job.no_of_vacancies}</Typography>
          <Typography variant="body1">💰 {job.estimated_salary_from} - {job.estimated_salary_to}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApply}
              sx={{ height: '36.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isApplied ? (canWithdraw ? '#dc3545' : '#218838') : '#007BFF', color: '#ffffff' }}
            >
              {isApplied ? (canWithdraw ? 'Withdraw Application' : 'Already Applied') : 'Apply'}
            </Button>
            {isApplied && canWithdraw && (
              <Typography 
                variant="caption" 
                sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#dc3545' }}
              >
                {getTimeRemaining()}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: '120px' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              sx={{ height: '36.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: isSaved ? '#007BFF' : '#000000', border: '1px solid #e0e0e0' }}
              startIcon={isSaved ===  job.job_id ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            >
              {isSaved ===  job.job_id  ? 'Saved' : 'Save'}
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Work Description</Typography>
        <Typography variant="body1">
          {job.job_description}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobView;