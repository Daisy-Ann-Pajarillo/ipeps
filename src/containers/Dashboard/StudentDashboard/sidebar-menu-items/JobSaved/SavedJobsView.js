import React from 'react';
import { Box, Typography, Button, Divider, Stack } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';

const SavedJobsView = ({ 
  job, 
  isApplied = false, 
  canWithdraw = false,
  applicationTime = null,
  onApply = () => {},
  onWithdraw = () => {},
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getTimeRemaining = () => {
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const buttonStyles = {
    common: {
      height: '36.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    apply: {
      backgroundColor: isApplied 
        ? canWithdraw 
          ? '#dc3545' // Red for withdraw
          : '#218838' // Dark green for already applied
        : '#007BFF', // Blue for apply
      color: '#ffffff',
      '&:hover': {
        backgroundColor: isApplied
          ? canWithdraw
            ? '#c82333' // Darker red for withdraw hover
            : '#1E7E34' // Darker green for already applied hover
          : '#0056b3', // Darker blue for apply hover
      }
    }
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            height: '300px',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <img 
            src={job.companyImage} 
            alt={job.company}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px',
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>{job.job_title}</Typography>
        <Typography variant="h5" color="primary" gutterBottom>{job.company}</Typography>
        
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body1">📍 {job.city_municipality}, {job.country}</Typography>
          <Typography variant="body1">💼 {job.job_type}</Typography>
          <Typography variant="body1">👥 Vacancies: {job.no_of_vacancies}</Typography>
          <Typography variant="body1">💰 ${job.estimated_salary_from} - ${job.estimated_salary_to}</Typography>
          <Typography variant="body1">🎓 {job.certificate_received} from {job.training_institution}</Typography>
          <Typography variant="body1">🛠️ Skills: {job.other_skills}</Typography>
        </Stack>

        <Box sx={{ width: '100%', mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={isApplied && canWithdraw ? onWithdraw : onApply}
            sx={{ ...buttonStyles.common, ...buttonStyles.apply }}
          >
            {isApplied 
              ? canWithdraw 
                ? 'Withdraw Application' 
                : 'Already Applied'
              : 'Apply'}
          </Button>
          {isApplied && canWithdraw && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1,
                color: '#dc3545'
              }}
            >
              {getTimeRemaining()}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Work Description</Typography>
        <Typography variant="body1">
          {job.job_description}
        </Typography>
      </Box>
    </Box>
  );
};

export default SavedJobsView;