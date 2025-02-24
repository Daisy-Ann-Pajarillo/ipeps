import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { tokens } from '../../../theme';
import TrainingView from './TrainingView';
import CloseIcon from '@mui/icons-material/Close';
import SearchData from '../../../components/layout/Search';
const TrainingSearch = ({ isCollapsed }) => {  // Add isCollapsed prop here
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = '72px'; // Define header height

  // Add state to track saved and enrolled status for each training
  const [savedTraining, setSavedTraining] = useState({});
  const [enrolledTraining, setEnrolledTraining] = useState({});
  const [enrollmentTimes, setEnrollmentTimes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveTraining = (trainingId) => {
    setSavedTraining(prev => {
      const newSavedTrainings = {
        ...prev,
        [trainingId]: !prev[trainingId]
      };

      // Get the training details
      const trainingToSave = trainings.find(t => t.id === trainingId);

      // Get existing saved trainings from localStorage
      const savedTrainingsList = JSON.parse(localStorage.getItem('savedTrainings') || '[]');

      if (newSavedTrainings[trainingId]) {
        // Add to localStorage if not already present
        if (!savedTrainingsList.some(training => training.id === trainingId)) {
          savedTrainingsList.push(trainingToSave);
        }
      } else {
        // Remove from localStorage
        const index = savedTrainingsList.findIndex(training => training.id === trainingId);
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
    const trainingToEnroll = trainings.find(t => t.id === trainingId);

    // Update localStorage
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
    const allTrainings = JSON.parse(localStorage.getItem('allTrainings') || '[]');

    appliedItems[`training-${trainingId}`] = true;
    applicationTimes[`training-${trainingId}`] = now;

    // Update or add the training to allTrainings
    const existingTrainingIndex = allTrainings.findIndex(t => t.id === trainingId);
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
  };

  const canWithdraw = (trainingId) => {
    if (!enrollmentTimes[trainingId]) return false;
    const now = new Date().getTime();
    const enrollmentTime = enrollmentTimes[trainingId];
    const timeDiff = now - enrollmentTime;
    return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };



  // Set the first trainings as selected by default
  // React.useEffect(() => {
  //   if (trainings.length > 0 && !selectedTraining) {
  //     setSelectedTraining(trainings[0]);
  //   }
  // }, [trainings]);

  // const handleSearch = () => {
  //   // Implement search functionality
  //   console.log('Searching...');
  // };

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
  const [entryLevel, setEntryLevel] = useState("");
  const [trainingType, setTrainingType] = useState("");
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
      updatedTrainings.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
    } else if (sortBy === "Most Relevant") {
      // Custom sorting logic for relevance (example: by provider name)
      updatedTrainings.sort((a, b) => a.provider.localeCompare(b.provider));
    } else if (sortBy === "Salary") {
      // Sorting based on cost
      updatedTrainings.sort(
        (a, b) =>
          parseInt(b.cost.replace("₱", "").replace(",", "")) -
          parseInt(a.cost.replace("₱", "").replace(",", ""))
      );
    }

    // Update filtered trainings
    setFilteredTrainings(updatedTrainings);
  }, [query, entryLevel, trainingType, sortBy, trainings]); // Dependencies

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
          <Typography variant="subtitle1" mb={2}>
            Total: {filteredTrainings.length} training found
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
              onClick={() => handleTrainingClick(training.id)}
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
                      src={training.companyImage}
                      alt={training.company}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px'
                      }}
                    />
                  </Box>

                  {/* Training Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {training.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {training.company} • {training.location}
                    </Typography>
                    <Typography variant="body2">
                      {training.type} • {training.experience}
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
            <TrainingView
              training={selectedTraining}
              isSaved={savedTraining[selectedTraining.id]}
              isEnrolled={enrolledTraining[selectedTraining.id]}
              canWithdraw={canWithdraw(selectedTraining.id)}
              enrollmentTime={enrollmentTimes[selectedTraining.id]}
              onSave={() => handleSaveTraining(selectedTraining.id)}
              onEnroll={() => handleEnrollTraining(selectedTraining.id)}
              onWithdraw={() => handleWithdrawEnrollment(selectedTraining.id)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TrainingSearch;
