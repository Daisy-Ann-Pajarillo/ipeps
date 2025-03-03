import React, { useState, useEffect } from 'react';
import axios from '../../../../../../axios';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button
} from '@mui/material';

// Function to map status to color
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

const PostedJob = () => {
  const [jobs, setJobs] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/get-job-postings');
        const jobsData = Array.isArray(response.data.job_postings) ? response.data.job_postings : [];
        setJobs(jobsData);
        
        console.log('Job postings retrieved successfully:', jobsData);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Job Posted
        </Typography>
        
        {jobs.map((job) => (
          <Paper key={job.id} sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}> 
            <Avatar src={job.logo} alt={job.company} sx={{ width: 56, height: 56, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{job.job_title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Job Type: {job.job_type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {job.country}, {job.city_municipality}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vacancies: {job.no_of_vacancies}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                Status: 
                <Button
                  variant="contained"
                  color={getStatusColor(job.status)}
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
                  {job.status}
                </Button>
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default PostedJob;
