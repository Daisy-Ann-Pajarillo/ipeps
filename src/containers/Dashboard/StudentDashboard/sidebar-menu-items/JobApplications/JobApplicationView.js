import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Stack,
  IconButton,

} from '@mui/material';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Unselected state
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Selected state
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';

const JobApplicationView = ({ application, onWithdraw }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!application) return null;

  const canWithdraw = () => {
    if (!application?.applicationTime) return false;
    const now = new Date().getTime();
    const timeLeft = (application.applicationTime + 24 * 60 * 60 * 1000) - now;
    return timeLeft > 0;
  };

  const getTimeRemaining = () => {
    if (!application?.applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (application.applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application confirmed';

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdraw = () => {
    if (!canWithdraw()) return;

    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`job-${application.id}`];
    delete applicationTimes[`job-${application.id}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    // Call parent's onWithdraw to update the list and clear selection
    onWithdraw(application.id);

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        {/* Company Image */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            height: '200px',
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <img
            src={application.companyImage || 'default-company-image.png'}
            alt={application.company_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px'
            }}
          />
        </Box>

        {/* Job Details */}
        <Typography variant="h4" gutterBottom>{application.job_title}</Typography>
        <Typography variant="h5" color="primary" gutterBottom>{application.company_name}</Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body1">📍 Location: {application.city_municipality}, {application.country}</Typography>
          <Typography variant="body1">💼 Type: {application.job_type}</Typography>
          <Typography variant="body1">👥 Experience Level: {application.experience_level}</Typography>
          <Typography variant="body1">💰 Salary Range: ₱{application.estimated_salary_from?.toLocaleString()} - ₱{application.estimated_salary_to?.toLocaleString()}</Typography>
          <Typography variant="body1">📅 Application Status: {getTimeRemaining()}</Typography>
        </Stack>

        {/* Action Button */}
        {canWithdraw() && (
          <Box sx={{ flex: 1, mb: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleWithdraw}
              sx={{
                height: '36.5px',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#c82333',
                }
              }}
            >
              Withdraw Application
            </Button>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#dc3545' }}>
              {getTimeRemaining()}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Job Description */}
        <Typography variant="h6" gutterBottom>Job Description</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {application.job_description}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobApplicationView;