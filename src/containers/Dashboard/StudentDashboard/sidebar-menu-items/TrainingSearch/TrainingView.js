import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import * as actions from "../../../../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../../../axios";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

const TrainingView = ({ training }) => {
  const [isSaved, setIsSaved] = useState();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log("training: ", training.training_id);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const handleEnroll = async () => {
    // Don't proceed if already enrolled
    if (isEnrolled) return;

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
      console.log("respnse: ", response.data);

      setIsEnrolled(true);
      toast.success(
        response.data.message || "Successfully enrolled in the training"
      );
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_applied) {
        setIsEnrolled(true);
        toast.info("You have already enrolled in this training");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to enroll in the training"
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

      // Toggle saved state locally regardless of response
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      toast.success(
        response.data.message ||
          (newSavedState
            ? "Training saved successfully"
            : "Training removed from saved items")
      );
    } catch (error) {
      console.error("Error saving training:", error);
      toast.error(
        error.response?.data?.message || "Failed to save the training"
      );
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

        // Check training status
        const statusResponse = await axios.post(
          "/api/check-training-status",
          { employer_trainingpost_id: training.training_id },
          { auth: { username: auth.token } }
        );

        setIsSaved(statusResponse.data.is_saved);
        setIsEnrolled(statusResponse.data.is_applied);
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
        {/* Company Image with fixed size and center alignment */}
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
            src={
              training.companyImage ||
              training.providerImage ||
              "default-company-image.png"
            }
            alt={training.provider || "Training Provider"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "16px",
            }}
          />
        </Box>

        {/* Training Details */}
        <Typography variant="h4" gutterBottom>
          {training.training_title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {training.provider || ""}
        </Typography>

        <Stack spacing={1} sx={{ mb: 3 }}>
          {training.city_municipality && (
            <Typography variant="body1">
              📍 {training.city_municipality}
            </Typography>
          )}
          {training.training_type && (
            <Typography variant="body1">💼 {training.training_type}</Typography>
          )}
          {training.experience_level && (
            <Typography variant="body1">
              👤 Experience Level: {training.experience_level}
            </Typography>
          )}
          {training.expiration_date && (
            <Typography variant="body1">
              📅 Expires: {training.expiration_date}
            </Typography>
          )}
          {training.estimated_cost_from !== undefined && (
            <Typography variant="body1">
              💰 Cost: ${training.estimated_cost_from}
              {training.estimated_cost_to
                ? ` - $${training.estimated_cost_to}`
                : ""}
            </Typography>
          )}
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleEnroll}
              disabled={isLoading || isEnrolled}
              sx={{
                height: "36.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isEnrolled ? "#218838" : "#007BFF",
                color: "#ffffff",
                pointerEvents: isEnrolled ? "none" : "auto",
                "&:disabled": {
                  backgroundColor: isEnrolled ? "#218838" : "#cccccc",
                  color: "#ffffff",
                  opacity: 1,
                  cursor: "not-allowed",
                },
                "&.Mui-disabled": {
                  backgroundColor: isEnrolled ? "#218838" : "#cccccc",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: isEnrolled ? "#218838" : "#0069d9",
                },
              }}
            >
              {isLoading
                ? "Loading..."
                : isEnrolled
                ? "Already Enrolled"
                : "Enroll Now"}
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
