import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../../../axios";

const JobView = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Reset states when job changes
  useEffect(() => {
    setIsSaved(false);
    setIsApplied(false);
    setIsLoading(true);
  }, [job.job_id]);

  const handleApply = async () => {
    // Don't proceed if already applied
    if (isApplied) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/apply-job",
        {
          employer_jobpost_id: job.job_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsApplied(true);
      toast.success(response.data.message || "Successfully applied to the job");
    } catch (error) {
      console.error("Error applying job:", error);
      if (error.response?.data?.is_applied) {
        setIsApplied(true);
        toast.info("You have already applied for this job");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to apply for the job"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/saved-jobs",
        {
          employer_jobpost_id: job.job_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsSaved(response.data.is_saved);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(error.response?.data?.message || "Failed to save the job");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkJobStatus = async () => {
      if (!job?.job_id || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if job is saved
        const savedResponse = await axios.post(
          "/api/check-already-saved",
          { employer_jobpost_id: job.job_id },
          { auth: { username: auth.token } }
        );
        setIsSaved(savedResponse.data.is_saved);

        // Check if job is applied
        const appliedResponse = await axios.post(
          "/api/check-already-applied",
          { job_id: job.job_id },
          { auth: { username: auth.token } }
        );
        setIsApplied(appliedResponse.data.already_applied);
      } catch (error) {
        console.error("Error checking job status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkJobStatus();
  }, [job.job_id, auth.token]);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <ToastContainer />
      <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
            height: "300px",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <img
            src={job.companyImage || "http://bij.ly/4ib59B1"}
            alt={job.company || job.job_title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "16px",
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          {job.job_title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {job.country}
        </Typography>

        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body1">📍 {job.city_municipality}</Typography>
          <Typography variant="body1">💼 {job.job_type}</Typography>
          <Typography variant="body1">
            👥 Vacancies: {job.no_of_vacancies}
          </Typography>
          <Typography variant="body1">
            💰 {job.estimated_salary_from} - {job.estimated_salary_to}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApply}
              disabled={isLoading || isApplied}
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isApplied ? "#218838" : "#007BFF",
                color: "#ffffff",
                pointerEvents: isApplied ? "none" : "auto", // This changes the cursor behavior
                "&:disabled": {
                  backgroundColor: isApplied ? "#218838" : "#cccccc",
                  color: "#ffffff",
                  opacity: 1,
                  cursor: "not-allowed",
                },
                "&.Mui-disabled": {
                  backgroundColor: isApplied ? "#218838" : "#cccccc",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: isApplied ? "#218838" : "#0069d9",
                },
              }}
            >
              {isLoading
                ? "Loading..."
                : isApplied
                  ? "Already Applied"
                  : "Apply"}
            </Button>
          </Box>
          <Box sx={{ width: "120px" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              disabled={isLoading}
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                color: isSaved ? "#007BFF" : "#000000",
                border: "1px solid #e0e0e0",
                "&:disabled": {
                  backgroundColor: "#f5f5f5",
                  color: "#999999",
                },
              }}
              startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            >
              {isLoading ? "..." : isSaved ? "Saved" : "Save"}
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Work Description
        </Typography>
        <Typography variant="body1">{job.job_description}</Typography>
      </Box>
    </Box>
  );
};

export default JobView;
