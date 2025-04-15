import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button, List, ListItem } from "@mui/material";
import { Download, TrendingUp, Assignment, BusinessCenter, Person } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../../store/actions/index";

// Import for nested pages
import JobSeeker from "./components/JobSeeker";
import Trend from "./components/Trend";
import Placement from "./components/Placement";
import JobPreference from "./components/Job_Preference";

const mockDashboardData = {
  jobSeekers: 8435,
  activeTrends: 132,
  jobPreferences: 5677,
  placements: 2341,
  jobApplications: [
    { rank: 1, jobTitle: "Software Engineer", applications: 350 },
    { rank: 2, jobTitle: "Data Scientist", applications: 275 },
    { rank: 3, jobTitle: "UI/UX Designer", applications: 200 },
    { rank: 4, jobTitle: "Product Manager", applications: 180 },
    { rank: 5, jobTitle: "DevOps Engineer", applications: 165 },
  ],
};

const DummyChart = ({ title }) => (
  <Box
    height={250}
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor="rgba(0,0,0,0.04)"
    borderRadius={2}
    flexDirection="column"
    gap={2}
  >
    <Typography variant="body1" color="text.secondary">
      {title} Chart Visualization
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Data visualization will appear here
    </Typography>
  </Box>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // Simulating data refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData({
        ...mockDashboardData,
        jobSeekers: 8534,
        placements: 2399,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Dashboard tiles configuration
  const dashboardTiles = [
    {
      title: "JobSeeker",
      value: dashboardData.jobSeekers,
      icon: <Person sx={{ fontSize: 38 }} />,
      link: "/admin/jobseeker",
      color: "#4158D0",
      bgGradient: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
    },
    {
      title: "Trend",
      value: dashboardData.activeTrends,
      icon: <TrendingUp sx={{ fontSize: 38 }} />,
      link: "/admin/trends",
      color: "#0093E9",
      bgGradient: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
    },
    {
      title: "Job Preference",
      value: dashboardData.jobPreferences,
      icon: <Assignment sx={{ fontSize: 38 }} />,
      link: "/admin/job-preference",
      color: "#8EC5FC",
      bgGradient: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
    },
    {
      title: "Placement",
      value: dashboardData.placements,
      icon: <BusinessCenter sx={{ fontSize: 38 }} />,
      link: "/admin/placement",
      color: "#4158D0",
      bgGradient: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
    },
  ];

  return (
    <Box p={3} sx={{ background: '#f9fafc' }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: 2
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 2
          }}
        >
          Download Reports
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {dashboardTiles.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link
              to={{
                pathname: item.link,
                state: {
                  auth: {
                    username: auth?.token,
                  }
                }
              }}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: "all 0.3s ease",
                  cursor: 'pointer',
                  "&:hover": {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                  },
                  height: 160,
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    background: item.bgGradient,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.9
                  }}
                />
                <CardContent sx={{ position: 'relative', height: '100%' }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="column"
                    height="100%"
                    color="white"
                  >
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                      >
                        {item.title}
                      </Typography>
                      <Box
                        sx={{
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          padding: 1,
                          display: 'flex'
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Box>

                    <Box alignSelf="flex-start">
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                      >
                        {item.value.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, letterSpacing: 0.5 }}
                      >
                        Total {item.title}s
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Job Applications & Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Top Job Applications
              </Typography>
              <List>
                {dashboardData.jobApplications.map((job, index) => (
                  <ListItem
                    key={index}
                    divider={index !== dashboardData.jobApplications.length - 1}
                    sx={{ px: 0 }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      sx={{
                        background: index === 0 ? 'rgba(253, 237, 237, 0.6)' :
                          index === 1 ? 'rgba(229, 246, 253, 0.6)' :
                            index === 2 ? 'rgba(238, 242, 246, 0.6)' : 'transparent',
                        borderRadius: 2,
                        px: 2,
                        py: 1
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: index === 0 ? '#f44336' :
                            index === 1 ? '#2196f3' :
                              index === 2 ? '#9e9e9e' : '#e0e0e0',
                          color: '#fff',
                          fontWeight: 'bold',
                          mr: 2
                        }}
                      >
                        {job.rank}
                      </Box>
                      <Box flexGrow={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {job.jobTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.applications} Applications
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          background: 'rgba(0,0,0,0.05)',
                          borderRadius: 10,
                          px: 1.5,
                          py: 0.5
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium">
                          {index === 0 ? '+5%' : index === 1 ? '+3%' : '+1%'}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3} height="100%">
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Applications Trend
                  </Typography>
                  <DummyChart title="Monthly Application" />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Job Categories
                  </Typography>
                  <DummyChart title="Categories" />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Placement Success
                  </Typography>
                  <DummyChart title="Success Rate" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;