import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Rating,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import Payment from "@mui/icons-material/Payment";
import AccessTime from "@mui/icons-material/AccessTime";
import VerifiedUser from "@mui/icons-material/VerifiedUser"; // Correct import for Verified icon
import Bookmark from "@mui/icons-material/Bookmark"; // Correct import for Bookmark icon
import BookmarkBorder from "@mui/icons-material/BookmarkBorder"; // Correct import for BookmarkBorder icon
import Stack from "@mui/material/Stack";
import * as actions from "../../../../../store/actions/index";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../../../axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch authentication data on component mount
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch all recommended job postings using auth token
  useEffect(() => {
    if (auth.token) {
      setLoading(true);
      let allJobs = [];
      const fetchJobs = async (page = 1) => {
        try {
          const response = await axios.get("http://localhost:5000/api/recommend/job-posting", {
            params: { page }, // Assuming the API supports pagination via `page`
            auth: { username: auth.token },
          });

          const recommendations = response.data.recommendations.map((item) => ({
            ...item.job_posting,
            match_score: item.match_score,
            novelty_factors: item.novelty_factors,
          }));

          allJobs = [...allJobs, ...recommendations]; // Accumulate jobs

          // Check if there's more data to fetch
          if (response.data.hasMore) {
            fetchJobs(page + 1); // Recursive call for the next page
          } else {
            setRecommendedJobs(allJobs); // Set all fetched jobs to state
          }
        } catch (error) {
          console.error("Error fetching job postings:", error);
          alert("Failed to fetch recommended jobs. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchJobs(); // Initial call to start fetching
    }
  }, [auth.token]);

  // Handle job application/enrollment logic here
  const handleApplyJob = useCallback((jobId) => {
    console.log(`Applied to job with ID: ${jobId}`);
    // Add your application logic here
  }, []);

  // Handle bookmark toggling
  const handleBookmark = useCallback(
    (jobId) => {
      if (bookmarkedJobs.includes(jobId)) {
        setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== jobId));
      } else {
        setBookmarkedJobs([...bookmarkedJobs, jobId]);
      }
    },
    [bookmarkedJobs]
  );

  // Show a loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Recommended Job Postings
      </Typography>

      <Grid container spacing={3}>
        {recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => (
            <Grid item xs={12} md={6} key={job.job_id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Job Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Avatar variant="rounded" sx={{ width: 50, height: 50 }}>
                      {job.employer.company_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {job.job_title}
                        {job.status === "active" && (
                          <VerifiedUser sx={{ ml: 1, fontSize: 16, color: "primary.main" }} />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.employer.company_name}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleBookmark(job.job_id)}
                    aria-label={`Bookmark ${job.job_title}`}
                  >
                    {bookmarkedJobs.includes(job.job_id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>

                {/* Job Details */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    icon={<LocationOn fontSize="small" />}
                    label={job.city_municipality || "Remote"}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Payment fontSize="small" />}
                    label={`${job.estimated_salary_from} - ${job.estimated_salary_to}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<AccessTime fontSize="small" />}
                    label={job.experience_level}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                {/* Skills */}
                <Box sx={{ mb: 2 }}>
                  {job.other_skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .map((skill) => (
                      <Chip key={skill} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Footer (Rating, Match Score, and Apply Button) */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating value={5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({job.no_of_vacancies} vacancies)
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleApplyJob(job.job_id)}
                    aria-label={`Apply to ${job.job_title}`}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                No recommended jobs available.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default Dashboard;