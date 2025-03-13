import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import axios from '../../../../../../axios';

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";



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

const PostedTraining = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [bookmarked, setBookmarked] = useState({});

// setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
 // Load authentication state
 
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

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
}, []);

  const handleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Training Posted</Typography>
        {trainingData.map((training) => (
          <Paper key={training.id} sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{training.training_title}</Typography>
              <Typography variant="body2" color="text.secondary">Description: {training.training_description}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
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
  );
};

export default PostedTraining;
