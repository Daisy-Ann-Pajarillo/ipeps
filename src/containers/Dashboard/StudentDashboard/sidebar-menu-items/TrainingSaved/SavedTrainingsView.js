import React from "react";
import { Box, Typography, Button, Divider, Stack, Chip } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const SavedTrainingsView = ({
  training,
  isEnrolled = false,
  onEnroll = () => {},
  isLoading = false,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const buttonStyles = {
    common: {
      height: "36.5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    enroll: {
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
        backgroundColor: isEnrolled ? "#1E7E34" : "#0056b3",
      },
    },
  };

  // Format cost display with proper currency formatting
  const formatCost = (from, to) => {
    if (from === undefined || from === null) return "Cost not specified";

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (to === undefined || to === null || from === to) {
      return formatter.format(from);
    }

    return `${formatter.format(from)} - ${formatter.format(to)}`;
  };

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
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
            src={training.companyImage || "default-company-image.png"}
            alt={training.provider || training.title}
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
          {training.title}
        </Typography>

        {training.provider && (
          <Typography variant="h5" color="primary" gutterBottom>
            {training.provider}
          </Typography>
        )}

        {/* Status chip */}
        {isEnrolled && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label="You are enrolled in this training"
              color="success"
              size="small"
            />
          </Box>
        )}

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
          {training.expiration && (
            <Typography variant="body1">
              📅 Expires: {training.expiration}
            </Typography>
          )}
          {(training.estimated_cost_from !== undefined ||
            training.estimated_cost_to !== undefined) && (
            <Typography variant="body1">
              💰 Cost:{" "}
              {formatCost(
                training.estimated_cost_from,
                training.estimated_cost_to
              )}
            </Typography>
          )}
        </Stack>

        {/* Enroll Button */}
        <Box sx={{ width: "100%", mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onEnroll}
            disabled={isLoading || isEnrolled}
            sx={{ ...buttonStyles.common, ...buttonStyles.enroll }}
          >
            {isLoading
              ? "Loading..."
              : isEnrolled
              ? "Already Enrolled"
              : "Enroll Now"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Training Description
        </Typography>
        <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
          {training.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default SavedTrainingsView;
