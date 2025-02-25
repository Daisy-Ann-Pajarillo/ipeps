import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Download, Email, PersonAdd, PointOfSale, Traffic } from "@mui/icons-material";

const mockDashboardData = {
  overview: "Summary of key metrics",
  users: 150,
  tasks: 45,
  reports: 12,
  revenue: "$59,342.32",
  emailsSent: 12361,
  sales: 431225,
  newClients: 32441,
  traffic: 1325134,
  jobApplications: [
    { rank: 1, jobTitle: "Software Engineer", applications: 350 },
    { rank: 2, jobTitle: "Data Scientist", applications: 275 },
    { rank: 3, jobTitle: "UI/UX Designer", applications: 200 },
  ],
};

const DummyChart = () => (
  <Box height={250} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.300" borderRadius={2} boxShadow={2}>
    <Typography variant="body1" color="text.secondary">
      Chart Placeholder
    </Typography>
  </Box>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  useEffect(() => {
    setTimeout(() => {
      setDashboardData({
        ...mockDashboardData,
        users: 200,
        tasks: 60,
        reports: 18,
      });
    }, 2000);
  }, []);

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Download />}>
          Download Reports
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {[
          { title: "JobSeeker", value: dashboardData.emailsSent, icon: <Email />, link: "/jobseeker" },
          { title: "Trend", value: dashboardData.sales, icon: <PointOfSale />, link: "/trends" },
          { title: "Job Preference", value: dashboardData.newClients, icon: <PersonAdd />, link: "/job-preference" },
          { title: "Placement", value: dashboardData.traffic, icon: <Traffic />, link: "/placement" },
        ].map((item, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Link to={item.link} style={{ textDecoration: "none" }}>
              <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 }, height: 150 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
                    <IconButton color="primary" sx={{ mb: 1 }}>
                      {item.icon}
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold" align="center">
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                      {item.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Job Applications & Charts */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Job Application Ranks
              </Typography>
              <List>
                {dashboardData.jobApplications.map((job, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={`${job.rank}. ${job.jobTitle}`} secondary={`${job.applications} Applications`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {["Applications Trend", "Applications Comparison", "Top Job Applications"].map((title, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, height: 350 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" align="center">
                  {title}
                </Typography>
                <DummyChart />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
