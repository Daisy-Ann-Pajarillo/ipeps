import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Button } from '@mui/material';
import { tokens } from '../../../theme';
import SavedTrainingsView from './SavedTrainingsView';
import SearchData from '../../../components/layout/Search';
import axios from "../../../../../axios";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";


const SavedTrainings = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = '72px';
  const [enrolledTrainings, setEnrolledTrainings] = useState({});
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);
  // Fetch saved trainings from the API with authentication
  useEffect(() => {
    const fetchSavedTrainings = async () => {
      try {
        const response = await axios.get('/api/get-saved-trainings', {
          auth: {
            username: auth.token // Add authentication using token
          }
        });

        // Handle the response data
        if (response.data.success && Array.isArray(response.data.trainings)) {
          const transformedTrainings = response.data.trainings.map((training) => ({
            id: training.saved_training_id,       // Use saved_training_id as the unique identifier
            title: training.training_title,       // Map training_title to title
            description: training.training_description, // Map training_description to description
            companyImage: 'https://bit.ly/3Qgevzn',  // Placeholder image URL
            expiration: training.expiration_date,
          }));

          setSavedTrainings(transformedTrainings);
        } else {
          console.error('Invalid API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching saved trainings:', error);
      }
    };

    fetchSavedTrainings();
  }, [auth.token]); // Added auth.token as a dependency to refetch when it changes


  const handleEnroll = (trainingId) => {
    setEnrolledTrainings((prev) => ({
      ...prev,
      [trainingId]: true,
    }));
  };

  const handleSearch = () => {
    console.log('Searching saved trainings...');
  };

  const handleRemoveFromSaved = (trainingId) => {
    const updatedTrainings = savedTrainings.filter((training) => training.id !== trainingId);
    setSavedTrainings(updatedTrainings);

    // If the removed training was selected, clear the selection
    if (selectedTraining?.id === trainingId) {
      setSelectedTraining(null);
    }

    // Optionally, send a DELETE request to the API to remove the training from the backend
    axios
      .delete(`/api/remove-saved-training/${trainingId}`)
      .then(() => console.log('Training removed successfully'))
      .catch((error) => console.error('Error removing training:', error));
  };

  const handleTrainingClick = (trainingId) => {
    const selectedTraining = savedTrainings.find((t) => t.id === trainingId);
    setSelectedTraining(selectedTraining);
    setIsModalOpen(true);
  };

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredTrainings, setFilteredTrainings] = useState(savedTrainings);

  // useEffect to filter and sort trainings dynamically
  useEffect(() => {
    let updatedTrainings = [...(Array.isArray(savedTrainings) ? savedTrainings : [])];

    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sorting logic
    if (sortBy === 'Company Name') {
      updatedTrainings.sort((a, b) => a.provider.localeCompare(b.provider));
    } else if (sortBy === 'Most Recent') {
      updatedTrainings.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by start date
    } else if (sortBy === 'Most Relevant') {
      // Define relevance logic if applicable
    }

    // Update filtered trainings
    setFilteredTrainings(updatedTrainings);
  }, [query, sortBy, savedTrainings]); // Dependencies

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          { title: 'Sort By', options: ['', 'Most Recent', 'Most Relevant', 'Company Name'] },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setSortBy(value);
        }}
      />
      <Box
        sx={{
          display: 'flex',
          position: 'fixed',
          top: headerHeight,
          left: isCollapsed ? '80px' : '250px',
          right: 0,
          bottom: 0,
          transition: 'left 0.3s',
        }}
      >
        {/* Training Listings Panel */}
        <Box
          sx={{
            width: '60%',
            height: '100%',
            overflowY: 'auto',
            p: 3,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="subtitle1" mb={2}>
            Saved Trainings: {filteredTrainings.length}
          </Typography>
          {filteredTrainings.map((training) => (
            <Card
              key={training.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                backgroundColor: selectedTraining?.id === training.id ? '#f5f5f5' : 'white',
                '&:hover': { backgroundColor: colors.primary[400] },
              }}
              onClick={() => setSelectedTraining(training)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(training.id);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={training.companyImage} // Changed from providerImage to companyImage
                      alt={training.company} // Changed from provider to company
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px',
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {training.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {training.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        {/* Training View Panel */}
        <Box
          sx={{
            width: '40%',
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'white',
          }}
        >
          {selectedTraining && (
            <SavedTrainingsView
              training={selectedTraining}
              isEnrolled={enrolledTrainings[selectedTraining.id]}
              onEnroll={() => handleEnroll(selectedTraining.id)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedTrainings;