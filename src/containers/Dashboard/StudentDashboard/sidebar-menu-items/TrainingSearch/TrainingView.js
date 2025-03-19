import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import { useSelector } from "react-redux";
import axios from "../../../../../axios";

const TrainingView = ({ training, isEnrolled }) => {
  const [isSaved, setIsSaved] = useState(false); // Tracks if the training is saved
  const [isEnrolledState, setIsEnrolledState] = useState(isEnrolled); // Tracks if the user is enrolled
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state for API calls

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const checkTrainingStatus = async () => {
      if (!training?.training_id || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if the training is saved
        const savedResponse = await axios.post(
          "/api/save-training",
          { employer_trainingpost_id: training.training_id },
          { auth: { username: auth.token } }
        );
        setIsSaved(savedResponse.data.is_saved);

        // Check if the user is already enrolled
        const enrolledResponse = await axios.post(
          "/api/check-already-enrolled",
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
      <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
        {/* Training Image */}
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

        {/* Training Title and Expiration Date */}
        <Typography variant="h4" gutterBottom>
          {training.training_title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          Expires on: {training.expiration_date}
        </Typography>

        {/* Enrollment and Save Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {/* Enroll Button */}
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={true} // Disable the button since handleEnroll is removed
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isEnrolledState ? "#218838" : "#cccccc",
                color: "#ffffff",
                pointerEvents: "none", // Disable pointer events
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
              }}
            >
              {isLoading
                ? "Loading..."
                : isEnrolledState
                  ? "Already Enrolled"
                  : "Enroll"}
            </Button>
          </Box>

          {/* Save Button */}
          <Box sx={{ width: "120px" }}>
            <Button
              variant="contained"
              fullWidth
              disabled={true} // Disable the button since handleSave is removed
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                color: isSaved ? "#007BFF" : "#999999",
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

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Training Description */}
        <Typography variant="h6" gutterBottom>
          Training Description
        </Typography>
        <Typography variant="body1">{training.training_description}</Typography>
      </Box>
    </Box>
  );
};

export default TrainingView;