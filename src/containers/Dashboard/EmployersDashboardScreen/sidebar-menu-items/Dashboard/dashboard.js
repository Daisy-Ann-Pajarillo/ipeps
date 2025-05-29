import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    Typography, 
    Button, 
    CircularProgress, 
    IconButton, 
    Badge, 
    Menu, 
    MenuItem,
    Divider, 
    Avatar,
    Grid,
    Paper,
    Box,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Facebook as FacebookIcon,
    Notifications as NotificationsIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    EmojiEvents as EmojiEventsIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from '../../../../../axios';
import { tokens } from '../../../theme';

// Add loading animation styles
const styles = `
  @keyframes pulse-zoom {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  .loading-logo {
    animation: pulse-zoom 1.5s ease-in-out infinite;
  }
`;

// Update portal slides with instructions
const portalSlides = [
  {
    title: "Create Job Postings",
    description: "Click on 'Job Posting' in the sidebar menu. Fill in job details including title, description, requirements, and benefits. Review and publish to make it visible to job seekers.",
    image: "https://example.com/job-posting-guide.jpg", // Replace with actual image
    actionText: "Create Job Posting",
    actionPath: "/dashboard/job-posting"
  },
  {
    title: "Manage Training Programs",
    description: "Access 'Training Posting' to create and manage training opportunities. Specify program details, duration, and requirements. Track enrollments and manage participants.",
    image: "https://example.com/training-guide.jpg", // Replace with actual image
    actionText: "Create Training",
    actionPath: "/dashboard/training-posting"
  },
  {
    title: "Post Scholarships",
    description: "Use the 'Scholarship Posting' section to create scholarship opportunities. Define eligibility criteria, funding details, and application deadlines.",
    image: "https://example.com/scholarship-guide.jpg", // Replace with actual image
    actionText: "Create Scholarship",
    actionPath: "/dashboard/scholarship-posting"
  },
  {
    title: "Track Applications",
    description: "Monitor and manage all applications through your dashboard. Review candidate profiles, schedule interviews, and track hiring progress.",
    image: "https://example.com/track-guide.jpg", // Replace with actual image
    actionText: "View Applications",
    actionPath: "/dashboard/applications"
  },
];

// Helper function for relative time
const getRelativeTimeString = (date) => {
  // ...existing time calculation code...
};

const Dashboard = ({ isCollapsed }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const [headerHeight] = useState('60px');
    const auth = useSelector((state) => state.auth);
    
    // State for counts and loading
    const [counts, setCounts] = useState({
        jobs: 0,
        trainings: 0,
        scholarships: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Slideshow state
    const [slideIdx, setSlideIdx] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [openAnnouncement, setOpenAnnouncement] = useState(null);
    
    // Fetch counts on component mount
    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            let newCounts = {
                jobs: 0,
                trainings: 0,
                scholarships: 0
            };

            try {
                // Get job postings count
                try {
                    const jobsResponse = await axios.get('/api/get-job-postings', {
                        auth: { username: auth.token }
                    });
                    if (jobsResponse.data && Array.isArray(jobsResponse.data.job_postings)) {
                        newCounts.jobs = jobsResponse.data.job_postings.length;
                    }
                } catch (error) {
                    console.error('Error fetching job postings:', error);
                }

                // Get training postings count
                try {
                    const trainingsResponse = await axios.get('/api/get-training-postings', {
                        auth: { username: auth.token }
                    });
                    if (trainingsResponse.data && Array.isArray(trainingsResponse.data.training_postings)) {
                        newCounts.trainings = trainingsResponse.data.training_postings.length;
                    }
                } catch (error) {
                    console.error('Error fetching training postings:', error);
                }

                // Get scholarship postings count
                try {
                    const scholarshipsResponse = await axios.get('/api/get-scholarship-postings', {
                        auth: { username: auth.token }
                    });
                    if (scholarshipsResponse.data && Array.isArray(scholarshipsResponse.data.scholarship_postings)) {
                        newCounts.scholarships = scholarshipsResponse.data.scholarship_postings.length;
                    }
                } catch (error) {
                    console.error('Error fetching scholarship postings:', error);
                }

                // Set the counts even if some requests failed
                setCounts(newCounts);
                setError(null);
            } catch (err) {
                console.error('Error in fetchCounts:', err);
            } finally {
                setLoading(false);
            }
        };
        
        if (auth && auth.token) {
            fetchCounts();
        }
    }, [auth.token]);
    
    // Slideshow effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideIdx((prev) => (prev + 1) % portalSlides.length);
        }, 3500);
        return () => clearTimeout(timer);
    }, [slideIdx]);
    
    // Add styles to document
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        return () => styleSheet.remove();
    }, []);
    
    // Fetch announcements
    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get("/api/get-announcements", {
                auth: { username: auth.token },
            });
            setNotifications(response.data.announcements);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    useEffect(() => {
        if (auth.token) {
            fetchAnnouncements();
        }
    }, [auth.token]);
    
    // Handle navigation to different posting types
    const navigateToPostings = (type) => {
        switch(type) {
            case 'jobs':
                navigate('/dashboard/job-posting');
                break;
            case 'trainings':
                navigate('/dashboard/training-posting');
                break;
            case 'scholarships':
                navigate('/dashboard/scholarship-posting');
                break;
            default:
                break;
        }
    };
    
    const summaryItems = [
        {
            id: 'jobs',
            title: 'Job Postings',
            icon: <WorkIcon fontSize="large" />,
            count: counts.jobs,
            color: '#002763',
            path: '/dashboard/employer/job-postings'
        },
        {
            id: 'trainings',
            title: 'Training Postings',
            icon: <EmojiEventsIcon fontSize="large" />,
            count: counts.trainings,
            color: '#7E57C2',
            path: '/dashboard/employer/training-postings'
        },
        {
            id: 'scholarships',
            title: 'Scholarship Postings',
            icon: <SchoolIcon fontSize="large" />,
            count: counts.scholarships,
            color: '#FF7043',
            path: '/dashboard/employer/scholarship-postings'
        }
    ];
    
    // Filter active summary items
    const getActiveSummaryItems = () => {
        return summaryItems.filter(item => counts[item.id] > 0);
    };

    // Check if there are any postings at all
    const hasAnyPostings = () => {
        return Object.values(counts).some(count => count > 0);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 py-24 px-4 shadow-lg relative overflow-hidden">
                {/* Hero content similar to Home.js but customized for employers */}
                <div className="max-w-6xl w-full flex flex-col items-center text-center z-10">
                    <Typography variant="h2" className="font-extrabold text-xl sm:text-3xl md:text-5xl lg:text-7xl text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight">
                        Employer Dashboard
                    </Typography>
                    <Typography variant="h5" className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 mb-6 sm:mb-10 font-medium">
                        Manage your postings and connect with Students and Job Seekers
                    </Typography>
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 mt-2 sm:mt-4 justify-center">
                        {/* ...action buttons... */}
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-30 rounded-full -z-1 blur-2xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 opacity-20 rounded-full -z-1 blur-2xl" />
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 opacity-10 rounded-full -z-1 blur-3xl" style={{ transform: "translate(-50%, -50%)" }} />
            </section>

            {/* Notifications Header */}
            {/* ...copy notification header from Home.js... */}

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                {/* Instructions Slideshow Section */}
                <section className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 
                  bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl 
                  border border-blue-100 dark:border-blue-900 
                  p-6 md:p-12 mt-[-30px] md:mt-[-60px] z-10">
                  
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col items-start justify-center w-full">
                    <Typography 
                      variant="h4" 
                      className="font-bold text-xl md:text-2xl text-blue-700 mb-3 md:mb-4"
                    >
                      Quick Start Guide
                    </Typography>
                    
                    <div className="w-full flex flex-col items-start">
                      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 w-full">
                        <button
                          className="rounded-full bg-blue-100 text-blue-700 p-1 md:px-3 md:py-1 text-base md:text-lg font-bold shadow hover:bg-blue-200 transition"
                          onClick={() => setSlideIdx((slideIdx - 1 + portalSlides.length) % portalSlides.length)}
                        >
                          <ChevronLeftIcon fontSize="small" />
                        </button>
                        
                        <div className="flex-1">
                          <Typography className="text-base md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {portalSlides[slideIdx].title}
                          </Typography>
                          <Typography className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            {portalSlides[slideIdx].description}
                          </Typography>
                        </div>
                        
                        <button
                          className="rounded-full bg-blue-100 text-blue-700 p-1 md:px-3 md:py-1 text-base md:text-lg font-bold shadow hover:bg-blue-200 transition"
                          onClick={() => setSlideIdx((slideIdx + 1) % portalSlides.length)}
                        >
                          <ChevronRightIcon fontSize="small" />
                        </button>
                      </div>

                      <Button
                        variant="contained"
                        onClick={() => navigate(portalSlides[slideIdx].actionPath)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full"
                      >
                        {portalSlides[slideIdx].actionText}
                      </Button>
                      
                      <div className="flex gap-1.5 md:gap-2 mt-4 justify-center w-full">
                        {portalSlides.map((_, idx) => (
                          <span
                            key={`slide-indicator-${idx}`}
                            className={`inline-block w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 
                              ${slideIdx === idx ? "bg-blue-600" : "bg-blue-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="flex-1 flex justify-center items-center w-full mt-4 md:mt-0">
                    <img
                      src={portalSlides[slideIdx].image}
                      alt={portalSlides[slideIdx].title}
                      className="rounded-xl md:rounded-2xl shadow-lg md:shadow-xl 
                        w-full md:w-[420px] h-48 md:h-72 object-cover 
                        border-2 md:border-4 border-blue-200 transition-all duration-500"
                      style={{ 
                        maxWidth: '100%',
                        minHeight: 160
                      }}
                    />
                  </div>
                </section>

                {/* Summary Cards Section */}
                <Grid container spacing={3}>
                    {loading ? (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Grid>
                    ) : error ? (
                        <Grid item xs={12}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'error.light',
                                    bgcolor: 'error.lighter'
                                }}
                            >
                                <Typography color="error">{error}</Typography>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    sx={{ mt: 2 }}
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </Paper>
                        </Grid>
                    ) : !hasAnyPostings() ? (
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 6,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                    maxWidth: 600,
                                    margin: '0 auto'
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    color="text.primary" 
                                    gutterBottom
                                    sx={{ fontWeight: 'medium' }}
                                >
                                    No Job, Training, or Scholarship Posted Yet
                                </Typography>
                                <Typography 
                                    color="text.secondary" 
                                    sx={{ mb: 3 }}
                                >
                                    Start creating your first posting to connect with potential candidates.
                                </Typography>
                           {/*      <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/dashboard/job-posting')}
                                    sx={{ mr: 2 }}
                                >
                                    Create Job Posting
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate('/dashboard/training-posting')}
                                >
                                    Create Training
                                </Button> */}
                            </Paper>
                        </Grid>
                    ) : (
                        getActiveSummaryItems().map((item) => (
                            <Grid item xs={12} md={4} key={item.id}>
                                <Paper
                                    elevation={0}
                                    onClick={() => navigateToPostings(item.id)}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'rgba(0, 0, 0, 0.08)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: item.color,
                                                width: 50, 
                                                height: 50 
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                        <Typography 
                                            variant="h3" 
                                            fontWeight="bold" 
                                            align="right"
                                            sx={{ color: item.color }}
                                        >
                                            {item.count}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="h5" fontWeight="medium" sx={{ mb: 0.5 }}>
                                        {item.title}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {item.count === 1 
                                            ? 'You have 1 active posting' 
                                            : `You have ${item.count} active postings`
                                        }
                                    </Typography>
                                    
                                    <Button 
                                        variant="text" 
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ 
                                            mt: 'auto', 
                                            alignSelf: 'flex-start',
                                            color: item.color,
                                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
                
                {/* Recent Activity Section */}
        {/*         <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 2, color: '#002763' }}>
                        Recent Activity
                    </Typography>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3, 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography color="text.secondary" align="center">
                            Your recent activities will appear here
                        </Typography>
                    </Paper>
                </Box>*/}
            </div>

            {/* Footer */}
            <footer className="w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} PESO ILOILO. All rights reserved.
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-500 mt-1 block">
                            A project of the Provincial Government of Iloilo
                        </Typography>
                        <Typography variant="caption" className="text-gray-400 dark:text-gray-600 mt-1 block">
                            peso@iloilo.gov.ph
                        </Typography>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
