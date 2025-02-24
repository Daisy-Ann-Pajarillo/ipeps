import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Button } from '@mui/material';
import { tokens } from '../../../theme';
import SavedTrainingsView from './SavedTrainingsView';
import SearchData from '../../../components/layout/Search';

const SavedTrainings = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = '72px';
  const [enrolledTrainings, setEnrolledTrainings] = useState({});
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  React.useEffect(() => {
    const loadSavedTrainings = () => {
      const trainings = JSON.parse(localStorage.getItem('savedTrainings') || '[]');
      setSavedTrainings(trainings);
    };

    loadSavedTrainings();

    window.addEventListener('storage', loadSavedTrainings);

    return () => window.removeEventListener('storage', loadSavedTrainings);
  }, []);

  const handleEnroll = (trainingId) => {
    setEnrolledTrainings(prev => ({
      ...prev,
      [trainingId]: true
    }));
  };

  const handleSearch = () => {
    console.log('Searching saved trainings...');
  };

  const handleRemoveFromSaved = (trainingId) => {
    const updatedTrainings = savedTrainings.filter(training => training.id !== trainingId);
    localStorage.setItem('savedTrainings', JSON.stringify(updatedTrainings));
    setSavedTrainings(updatedTrainings);
    
    // If the removed training was selected, clear the selection
    if (selectedTraining?.id === trainingId) {
      setSelectedTraining(null);
    }
  };

  const handleTrainingClick = (trainingId) => {
    const selectedTraining = trainings.find(t => t.id === trainingId);
    setSelectedTraining(selectedTraining);
    setIsModalOpen(true);
  };
  const [trainings] = useState([
    {
      id: 1,
      title: "Web Development Bootcamp",
      provider: "Tech Academy",
      location: "Online",
      type: "Full Time",  // Matches Training Type dropdown
      duration: "12 weeks",
      cost: "₱15,000",
      startDate: "2024-03-01",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Entry",  // Matches Experience Level dropdown
      description: "A comprehensive bootcamp covering HTML, CSS, JavaScript, React, and backend development.",
    },
    {
      id: 2,
      title: "Cloud Computing Fundamentals",
      provider: "Tech Academy",
      location: "Online",
      type: "Part Time",  // Matches Training Type dropdown
      duration: "8 weeks",
      cost: "₱12,000",
      startDate: "2024-03-15",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Mid",
      description: "Learn cloud computing principles, AWS, Azure, and Google Cloud basics in this beginner-friendly course.",
    },
    {
      id: 3,
      title: "Data Science Essentials",
      provider: "Data Institute",
      location: "Hybrid",
      type: "Contract",  // Matches Training Type dropdown
      duration: "16 weeks",
      cost: "₱20,000",
      startDate: "2024-04-01",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Senior",
      description: "A practical course in Python, Machine Learning, and AI, with hands-on projects.",
    },
    {
      id: 4,
      title: "Cybersecurity for Beginners",
      provider: "Security Academy",
      location: "In-Person",
      type: "Full Time",
      duration: "10 weeks",
      cost: "₱18,000",
      startDate: "2024-04-10",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Entry",
      description: "Gain hands-on experience in cybersecurity fundamentals, ethical hacking, and network security.",
    },
    {
      id: 5,
      title: "AI and Machine Learning",
      provider: "AI Institute",
      location: "Online",
      type: "Internship",  // Matches Training Type dropdown
      duration: "6 months",
      cost: "₱25,000",
      startDate: "2024-05-01",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Mid",
      description: "An advanced AI/ML program covering deep learning, NLP, and reinforcement learning techniques.",
    },
    {
      id: 6,
      title: "Project Management Professional (PMP)",
      provider: "Business Academy",
      location: "Hybrid",
      type: "Part Time",
      duration: "5 months",
      cost: "₱30,000",
      startDate: "2024-06-01",
      companyImage: "https://bit.ly/3Qgevzn",
      experienceLevel: "Senior",
      description: "A certified PMP course covering Agile, Scrum, risk management, and project planning.",
    },
  ]);
  
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState(trainings);
  
  // useEffect to filter and sort trainings dynamically
  useEffect(() => {
    let updatedTrainings = [...trainings];
  
    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Sorting logic
    if (sortBy === "Company Name") {
      updatedTrainings.sort((a, b) => a.provider.localeCompare(b.provider));
    } else if (sortBy === "Most Recent") {
      updatedTrainings.sort((a, b) => new Date(b.date) - new Date(a.date)); // Assuming `date` exists
    } else if (sortBy === "Most Relevant") {
      // Define relevance logic if applicable
    }
  
    // Update filtered trainings
    setFilteredTrainings(updatedTrainings);
  }, [query, sortBy, trainings]); // Dependencies
  
  return (
    <Box>
      <SearchData
           placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          { title: "Sort By", options: ["", "Most Recent", "Most Relevant", "Company Name"] },
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
                '&:hover': { backgroundColor: colors.primary[400] }
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
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={training.companyImage} // Changed from providerImage to companyImage
                      alt={training.company} // Changed from provider to company
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px'
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {training.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {training.company} • {training.location} {/* Changed from provider to company */}
                    </Typography>
                    <Typography variant="body2">
                      {training.type} • {training.duration}
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
