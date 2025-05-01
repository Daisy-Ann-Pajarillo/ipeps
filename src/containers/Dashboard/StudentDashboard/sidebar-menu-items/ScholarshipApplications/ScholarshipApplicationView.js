import React from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';

const ScholarshipApplicationView = ({ application, onWithdraw }) => {
  if (!application) {
    return (
      <Box className="h-full flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-gray-400">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Typography variant="h6" color="textSecondary">Select a scholarship application</Typography>
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Choose a scholarship application from the list to view details
          </Typography>
        </div>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <Typography variant="h5" className="font-bold mb-1">
          {application.scholarship_title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" className="mb-4">
          {application.company_name}
        </Typography>

        <div className="flex flex-wrap gap-2 mb-6">
          <Chip
            color={getStatusColor(application.status)}
            label={`Status: ${application.status}`}
            size="small"
          />
          <Chip
            label={`Scholarship Status: ${application.scholarship_status}`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`Slots: ${application.occupied_slots}/${application.slots}`}
            size="small"
            variant="outlined"
          />
        </div>
      </div>

      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">Application Details</Typography>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-3">
            <Typography variant="body2" color="textSecondary">Application ID</Typography>
            <Typography variant="body1">{application.application_id}</Typography>
          </div>
          <div className="mb-3">
            <Typography variant="body2" color="textSecondary">Applied on</Typography>
            <Typography variant="body1">{formatDate(application.applied_at)}</Typography>
          </div>
          <div className="mb-3">
            <Typography variant="body2" color="textSecondary">Last Updated</Typography>
            <Typography variant="body1">{formatDate(application.updated_at)}</Typography>
          </div>
        </div>
      </Box>

      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">Scholarship Description</Typography>
        <Typography variant="body1" className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {application.scholarship_description}
        </Typography>
      </Box>

      <Box className="mt-auto pt-4 border-t border-gray-200">
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => onWithdraw(application.scholarship_posting_id)}
          disabled={application.status !== 'pending'}
        >
          Withdraw Application
        </Button>
        <Typography variant="caption" color="textSecondary" className="mt-2 block text-center">
          {application.status === 'pending'
            ? "You can withdraw your application if it's still pending"
            : `Your application has been ${application.status.toLowerCase()} and cannot be withdrawn`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ScholarshipApplicationView;