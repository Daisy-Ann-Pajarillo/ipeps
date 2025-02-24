import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar, Button } from '@mui/material';
import { AccessTime, School, Payment } from '@mui/icons-material';
import TrainingApplicationView from './TrainingApplicationView';
import SearchData from '../../../components/layout/Search';
const TrainingApplications = ({ isCollapsed }) => {
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollmentTimes, setEnrollmentTimes] = useState({});
  const headerHeight = '72px';

  useEffect(() => {
    const loadEnrollments = () => {
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedItems') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
      const allTrainings = JSON.parse(localStorage.getItem('allTrainings') || '[]');

      const enrolledTrainingsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('training-') && appliedItemsList[key])
        .map(key => {
          const trainingId = parseInt(key.replace('training-', ''));
          const training = allTrainings.find(t => t.id === trainingId);
          if (training) {
            return {
              ...training,
              enrollmentTime: applicationTimesList[`training-${trainingId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setEnrolledTrainings(enrolledTrainingsData);
      setEnrollmentTimes(applicationTimesList);
    };

    loadEnrollments();
    window.addEventListener('storage', loadEnrollments);
    return () => window.removeEventListener('storage', loadEnrollments);
  }, []);

  const handleWithdrawal = (trainingId) => {
    setEnrolledTrainings(prev => prev.filter(t => t.id !== trainingId));
    setSelectedTraining(null);

    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`training-${trainingId}`];
    delete applicationTimes[`training-${trainingId}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));
  };

  const canWithdraw = (trainingId) => {
    const enrollmentTime = enrollmentTimes[`training-${trainingId}`];
    if (!enrollmentTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - enrollmentTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const getTimeRemaining = (trainingId) => {
    const enrollmentTime = enrollmentTimes[`training-${trainingId}`];
    if (!enrollmentTime) return null;
    const now = new Date().getTime();
    const timeLeft = (enrollmentTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Enrollment confirmed';

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
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
  const [sortedTrainings, setSortedTrainings] = useState(trainings);
  const [query, setQuery] = useState("");

  const filterAndSortScholarships = (query, scholarships) => {
    if (!query.trim()) return scholarships; // Return all if query is empty

    return scholarships
      .filter(({ title, provider, description }) =>
        [title, provider, description].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      )
      .sort((a, b) => b.rating - a.rating || b.openPositions - a.openPositions);
  };

  useEffect(() => {
    setSortedTrainings(filterAndSortScholarships(query, trainings));
  }, [query, trainings]); // Runs when `query` or `companies` change

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
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
        {/* Training List Panel */}
        <Box
          sx={{
            width: '60%',
            height: '100%',
            overflowY: 'auto',
            p: 3,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Training Enrollments
          </Typography>
          <Grid container spacing={2}>
            {sortedTrainings.map(training => (
              <Grid item xs={12} key={training.id}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedTraining(training)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selectedTraining?.id === training.id ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={training.companyImage}
                      sx={{ width: 60, height: 60 }}
                    >
                      {training.provider[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{training.title}</Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {training.provider}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip icon={<School />} label={training.level} size="small" />
                        <Chip icon={<AccessTime />} label={training.duration} size="small" />
                        <Chip
                          icon={<AccessTime />}
                          label={getTimeRemaining(training.id)}
                          size="small"
                          color={canWithdraw(training.id) ? "error" : "success"}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
            {sortedTrainings.length <= 0 && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography color="text.secondary">
                    No training enrollments yet
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
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
          <TrainingApplicationView
            training={selectedTraining}
            onWithdraw={handleWithdrawal}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TrainingApplications;
