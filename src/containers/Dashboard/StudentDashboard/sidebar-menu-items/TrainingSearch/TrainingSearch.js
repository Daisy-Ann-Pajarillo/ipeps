import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { tokens } from '../../../theme';
import TrainingView from './TrainingView';
import SearchData from '../../../components/layout/Search';

const TrainingSearch = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = '72px';

  // State for trainings and loading
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to track saved and enrolled status
  const [savedTraining, setSavedTraining] = useState({});
  const [enrolledTraining, setEnrolledTraining] = useState({});
  const [enrollmentTimes, setEnrollmentTimes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch trainings from API
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/get-training-postings');

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug: Log the API response

        // Access the training postings from the response
        const trainingsArray = data.training_postings || [];
        console.log('Processed trainings array:', trainingsArray); // Debug
        setTrainings(trainingsArray);

        // Load saved/enrolled status from localStorage
        loadSavedAndEnrolledStatus(trainingsArray);
      } catch (err) {
        console.error('Error fetching trainings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  // Load saved and enrolled status from localStorage
  const loadSavedAndEnrolledStatus = (trainingsData) => {
    if (!Array.isArray(trainingsData)) {
      console.error('trainingsData is not an array:', trainingsData);
      return;
    }

    // Load saved trainings
    const savedTrainingsList = JSON.parse(localStorage.getItem('savedTrainings') || '[]');
    const savedMap = {};
    savedTrainingsList.forEach(training => {
      if (training && training.training_id) {
        savedMap[training.training_id] = true;
      }
    });
    setSavedTraining(savedMap);

    // Load enrolled trainings
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    const enrolledMap = {};
    const timesMap = {};

    trainingsData.forEach(training => {
      if (training && training.training_id) {
        const key = `training-${training.training_id}`;
        if (appliedItems[key]) {
          enrolledMap[training.training_id] = true;
          timesMap[training.training_id] = applicationTimes[key];
        }
      }
    });

    setEnrolledTraining(enrolledMap);
    setEnrollmentTimes(timesMap);
  };

  const handleSaveTraining = (trainingId) => {
    setSavedTraining(prev => {
      const newSavedTrainings = {
        ...prev,
        [trainingId]: !prev[trainingId]
      };

      // Get the training details
      const trainingToSave = trainings.find(t => t && t.training_id === trainingId);
      if (!trainingToSave) return prev; // Safety check

      // Get existing saved trainings from localStorage
      const savedTrainingsList = JSON.parse(localStorage.getItem('savedTrainings') || '[]');

      if (newSavedTrainings[trainingId]) {
        // Add to localStorage if not already present
        if (!savedTrainingsList.some(training => training && training.training_id === trainingId)) {
          savedTrainingsList.push(trainingToSave);
        }
      } else {
        // Remove from localStorage
        const index = savedTrainingsList.findIndex(training => training && training.training_id === trainingId);
        if (index !== -1) {
          savedTrainingsList.splice(index, 1);
        }
      }

      // Update localStorage
      localStorage.setItem('savedTrainings', JSON.stringify(savedTrainingsList));

      return newSavedTrainings;
    });
  };

  const handleEnrollTraining = (trainingId) => {
    const now = new Date().getTime();

    // Update local state
    setEnrollmentTimes(prev => ({
      ...prev,
      [trainingId]: now
    }));
    setEnrolledTraining(prev => ({
      ...prev,
      [trainingId]: true
    }));

    // Get the training details
    const trainingToEnroll = trainings.find(t => t && t.training_id === trainingId);
    if (!trainingToEnroll) return; // Safety check

    // Update localStorage
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
    const allTrainings = JSON.parse(localStorage.getItem('allTrainings') || '[]');

    appliedItems[`training-${trainingId}`] = true;
    applicationTimes[`training-${trainingId}`] = now;

    // Update or add the training to allTrainings
    const existingTrainingIndex = allTrainings.findIndex(t => t && t.training_id === trainingId);
    if (existingTrainingIndex === -1) {
      allTrainings.push(trainingToEnroll);
    } else {
      allTrainings[existingTrainingIndex] = trainingToEnroll;
    }

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));
    localStorage.setItem('allTrainings', JSON.stringify(allTrainings));
  };

  const handleWithdrawEnrollment = (trainingId) => {
    setEnrollmentTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[trainingId];
      return newTimes;
    });
    setEnrolledTraining(prev => {
      const newEnrolled = { ...prev };
      delete newEnrolled[trainingId];
      return newEnrolled;
    });

    // Update localStorage
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`training-${trainingId}`];
    delete applicationTimes[`training-${trainingId}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));
  };

  const canWithdraw = (trainingId) => {
    if (!enrollmentTimes[trainingId]) return false;
    const now = new Date().getTime();
    const enrollmentTime = enrollmentTimes[trainingId];
    const timeDiff = now - enrollmentTime;
    return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const handleTrainingClick = (trainingId) => {
    const selectedTraining = trainings.find(t => t && t.training_id === trainingId);
    if (!selectedTraining) return; // Safety check
    setSelectedTraining(selectedTraining);
    setIsModalOpen(true);
  };

  // State for filters
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState([]);

  // Filter and sort trainings
  useEffect(() => {
    if (!trainings.length) {
      setFilteredTrainings([]);
      return;
    }

    // Filter out any null or undefined items
    let updatedTrainings = trainings.filter(t => t !== null && t !== undefined);

    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter((t) =>
        (t.training_title && t.training_title.toLowerCase().includes(query.toLowerCase())) ||
        (t.training_description && t.training_description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filtering by experience level
    if (entryLevel) {
      updatedTrainings = updatedTrainings.filter(
        (t) => t.experienceLevel === entryLevel
      );
    }

    // Filtering by training type
    if (trainingType) {
      updatedTrainings = updatedTrainings.filter(
        (t) => t.type === trainingType
      );
    }

    // Sorting logic
    if (sortBy === "Most Recent") {
      updatedTrainings.sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    } else if (sortBy === "Most Relevant") {
      // Custom sorting logic for relevance (example: by provider name)
      updatedTrainings.sort((a, b) => {
        const providerA = a.provider || '';
        const providerB = b.provider || '';
        return providerA.localeCompare(providerB);
      });
    } else if (sortBy === "Salary") {
      // Sorting based on cost
      updatedTrainings.sort((a, b) => {
        const costA = parseInt((a.cost || '0').replace(/[^\d]/g, '')) || 0;
        const costB = parseInt((b.cost || '0').replace(/[^\d]/g, '')) || 0;
        return costB - costA;
      });
    }

    // Update filtered trainings
    setFilteredTrainings(updatedTrainings);
  }, [query, entryLevel, trainingType, sortBy, trainings]);

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={3}
        componentData={[
          { title: "Experience Level", options: ["", "Entry", "Mid", "Senior"] },
          { title: "Training Type", options: ["", "Full Time", "Part Time", "Contract", "Internship"] },
          { title: "Sort By", options: ["", "Most Recent", "Most Relevant", "Salary"] },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setEntryLevel(value);
          if (index === 1) setTrainingType(value);
          if (index === 2) setSortBy(value);
        }}
      />

      {/* Main content container */}
      <Box
        sx={{
          display: 'flex',
          position: 'fixed',
          top: headerHeight,
          left: isCollapsed ? '80px' : '250px',
          right: 0,
          bottom: 0,
          transition: 'left 0.3s'
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
          {isLoading ? (
            <Typography variant="body1">Loading trainings...</Typography>
          ) : error ? (
            <Typography variant="body1" color="error">
              Error loading trainings: {error}
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" mb={2}>
                Total: {filteredTrainings.length} training found
              </Typography>

              {filteredTrainings.length === 0 && !isLoading ? (
                <Typography variant="body1">
                  No training postings match your criteria.
                </Typography>
              ) : (
                filteredTrainings.map((training) => (
                  <Card
                    key={training.training_id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      backgroundColor: selectedTraining?.training_id === training.training_id ? '#f5f5f5' : 'white',
                      '&:hover': { backgroundColor: colors.primary[400] }
                    }}
                    onClick={() => handleTrainingClick(training.training_id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* Company Image */}
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            flexShrink: 0,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src={training.companyImage || "https://bit.ly/3Qgevzn"}
                            alt={training.provider || "Company Logo"}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '8px'
                            }}
                            onError={(e) => {
                              e.target.src = "https://bit.ly/3Qgevzn"; // Fallback image on error
                            }}
                          />
                        </Box>

                        {/* Training Details */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" component="div" gutterBottom>
                            {training.training_title}
                          </Typography>
                          <Typography variant="body2">
                            Expiration: {training.expiration_date || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            {training.training_description || "Description N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
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
            <TrainingView
              training={selectedTraining}
              isSaved={savedTraining[selectedTraining.training_id]}
              isEnrolled={enrolledTraining[selectedTraining.training_id]}
              canWithdraw={canWithdraw(selectedTraining.training_id)}
              enrollmentTime={enrollmentTimes[selectedTraining.training_id]}
              onSave={() => handleSaveTraining(selectedTraining.training_id)}
              onEnroll={() => handleEnrollTraining(selectedTraining.training_id)}
              onWithdraw={() => handleWithdrawEnrollment(selectedTraining.training_id)}
            />
          )}
        </Box>
      </Box>

      {/* Modal for mobile view */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ display: { md: 'none' } }}
      >
        <DialogTitle>
          Training Details
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            X
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTraining && (
            <TrainingView
              training={selectedTraining}
              isSaved={savedTraining[selectedTraining.training_id]}
              isEnrolled={enrolledTraining[selectedTraining.training_id]}
              canWithdraw={canWithdraw(selectedTraining.training_id)}
              enrollmentTime={enrollmentTimes[selectedTraining.training_id]}
              onSave={() => handleSaveTraining(selectedTraining.training_id)}
              onEnroll={() => handleEnrollTraining(selectedTraining.training_id)}
              onWithdraw={() => handleWithdrawEnrollment(selectedTraining.training_id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TrainingSearch;