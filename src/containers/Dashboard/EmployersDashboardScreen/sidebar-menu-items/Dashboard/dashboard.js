import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {Box, Typography, Paper, Grid, Avatar, Chip, Button, CircularProgress} from "@mui/material";
import { useSelector } from 'react-redux';

import {
    School, Work, EmojiEvents, 
    LocationOn, ArrowForward, Verified
} from '@mui/icons-material';

import { tokens } from "../../../theme";
import DashboardHeader from './DashboardHeader';
import axios from '../../../../../axios';

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
    
    // Fetch counts on component mount
    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/public/all-postings', {
                    auth: { username: auth.token }
                });
                
                // Extract counts from the response
                if (response.data) {
                    setCounts({
                        jobs: response.data.job_postings?.data?.length || 0,
                        trainings: response.data.training_postings?.data?.length || 0,
                        scholarships: response.data.scholarship_postings?.data?.length || 0
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching posting counts:', err);
                setError('Failed to load posting counts');
                setLoading(false);
            }
        };
        
        if (auth && auth.token) {
            fetchCounts();
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
            icon: <Work fontSize="large" />,
            count: counts.jobs,
            color: '#002763',
            path: '/dashboard/employer/job-postings'
        },
        {
            id: 'trainings',
            title: 'Training Postings',
            icon: <EmojiEvents fontSize="large" />,
            count: counts.trainings,
            color: '#7E57C2',
            path: '/dashboard/employer/training-postings'
        },
        {
            id: 'scholarships',
            title: 'Scholarship Postings',
            icon: <School fontSize="large" />,
            count: counts.scholarships,
            color: '#FF7043',
            path: '/dashboard/employer/scholarship-postings'
        }
    ];
    
    return (
        <Box>
            {/* Header with search and announcements */}
            <DashboardHeader isCollapsed={isCollapsed} />

            {/* Main content area */}
            <Box
                sx={{
                    position: 'fixed',
                    top: headerHeight,
                    left: isCollapsed ? '80px' : '250px',
                    right: 0,
                    bottom: 0,
                    transition: 'left 0.3s',
                    overflowY: 'auto',
                    p: 3,
                    backgroundColor: '#f5f5f5'
                }}
            >
                {/* Welcome Section */}
                <Box sx={{ mb: 4, mt: 2 }}>
                    <Typography 
                        variant="h4" 
                        fontWeight="700" 
                        sx={{ color: '#002763' }}
                    >
                        Welcome to Your Dashboard
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ mt: 1, color: 'text.secondary', maxWidth: '800px' }}
                    >
                        Manage your job, training, and scholarship postings from one convenient place.
                        Use the search bar above to quickly find specific postings.
                    </Typography>
                </Box>
                
                {/* Summary Cards */}
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
                    ) : (
                        summaryItems.map((item) => (
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
                                        endIcon={<ArrowForward />}
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
                
                {/* Recent Activity Section - placeholder for future enhancement */}
                <Box sx={{ mt: 4 }}>
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
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
