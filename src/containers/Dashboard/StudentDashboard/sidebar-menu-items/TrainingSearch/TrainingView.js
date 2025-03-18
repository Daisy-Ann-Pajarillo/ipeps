import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../../../axios";

const TrainingView = ({ training, isEnrolled }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolledState, setIsEnrolledState] = useState(isEnrolled); // Local state for enrollment
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Reset states when training changes
  useEffect(() => {
    setIsSaved(false);
    setIsEnrolledState(isEnrolled);
    setIsLoading(true);
  }, [training.training_id]);

  const handleEnroll = async () => {
    // Don't proceed if already enrolled
    if (isEnrolledState) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/apply-training",
        {
          employer_trainingpost_id: training.training_id,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      setIsEnrolledState(true);
      toast.success(response.data.message || "Successfully enrolled in the training");
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_enrolled) {
        setIsEnrolledState(true);
        toast.info("You are already enrolled in this training");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to enroll in the training"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Saved Trainings
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/save-training",
        {
          employer_trainingpost_id: training.training_id,
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
      console.error("Error saving training:", error);
      toast.error(error.response?.data?.message || "Failed to save the training");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const checkTrainingStatus = async () => {
      if (!training?.training_id || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if training is saved
        const savedResponse = await axios.post(
          "/api/check-training-status",
          { employer_trainingpost_id: training.training_id },
          { auth: { username: auth.token } }
        );
        setIsSaved(savedResponse.data.is_saved);

        // Check if training is enrolled
        const enrolledResponse = await axios.post(
          "/api/check-training-status",
          { employer_trainingpost_id: training.training_id },
          { auth: { username: auth.token } }
        );
        setIsEnrolledState(enrolledResponse.data.is_enrolled);
      } catch (error) {
        console.error("Error checking training status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTrainingStatus();
  }, [training.training_id, auth.token]);

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
            src={training.providerImage || "http://bij.ly/4ib59B1"}
            alt={training.provider || training.training_title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "16px",
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          {training.training_title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {training.expiration_date}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleEnroll}
              disabled={isLoading || isEnrolledState}
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isEnrolledState ? "#218838" : "#007BFF",
                color: "#ffffff",
                pointerEvents: isEnrolledState ? "none" : "auto", // This changes the cursor behavior
                "&:disabled": {
                  backgroundColor: isEnrolledState ? "#218838" : "#cccccc",
                  color: "#ffffff",
                  opacity: 1,
                  cursor: "not-allowed",
                },
                "&.Mui-disabled": {
                  backgroundColor: isEnrolledState ? "#218838" : "#cccccc",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: isEnrolledState ? "#218838" : "#0069d9",
                },
              }}
            >
              {isLoading
                ? "Loading..."
                : isEnrolledState
                  ? "Already Enrolled"
                  : "Enroll"}
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
          Training Description
        </Typography>
        <Typography variant="body1">{training.training_description}</Typography>
      </Box>
    </Box>
  );
};

export default TrainingView;