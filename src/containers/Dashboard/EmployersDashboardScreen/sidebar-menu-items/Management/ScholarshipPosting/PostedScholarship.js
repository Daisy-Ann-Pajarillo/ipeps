import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Unselected state
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Selected state
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

const PostedScholarship = () => {
  const [scholarshipData, setScholarshipData] = useState([]);
  const [bookmarked, setBookmarked] = useState({});

  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    // Fetch scholarship postings from the API
    const fetchScholarships = async () => {
      try {
        const response = await axios.get('/api/get-scholarship-postings', {
          auth: { username: auth.token }
        });

        if (response.status === 200) {
          const responseData = response.data;
          // Handle the response as an array
          const data = Array.isArray(responseData.scholarship_postings)
            ? responseData.scholarship_postings
            : [];

          console.log('Scholarship Data:', data); // Log the scholarship data

          setScholarshipData(data);
        } else {
          console.error('Failed to fetch scholarship postings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching scholarship postings:', error);
      }
    };

    fetchScholarships();
  }, []);


  const handleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  //Frontend Components
  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Scholarship Posted
        </Typography>

        {scholarshipData.map((scholarship) => (
          <Paper
            key={scholarship.id}
            sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{scholarship.scholarship_title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Description: {scholarship.scholarship_description}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                Status:
                <Button
                  variant="contained"
                  color={getStatusColor(scholarship.status)}
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
                  {scholarship.status}
                </Button>
              </Typography>
            </Box>
            <IconButton onClick={() => handleBookmark(scholarship.id)}>
              {bookmarked[scholarship.id] ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default PostedScholarship;
