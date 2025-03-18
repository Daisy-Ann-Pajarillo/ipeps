import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Unselected state
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Selected state
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScholarshipView = ({
  scholarship,
  isSaved,
  isApplied,
  applicationTime,
  onSave,
  onApply,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Reset states when scholarship changes
  useEffect(() => {
    setIsLoading(false);
  }, [scholarship.scholarship_id]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(); // Use the parent's save handler
    } catch (error) {
      console.error("Error saving scholarship:", error);
      toast.error(error.response?.data?.message || "Failed to save the scholarship");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (isApplied) return;

    try {
      setIsLoading(true);
      await onApply(); // Use the parent's apply handler
      toast.success("Successfully applied for the scholarship");
    } catch (error) {
      console.error("Error applying scholarship:", error);
      if (error.response?.data?.is_applied) {
        toast.info("You have already applied for this scholarship");
      } else {
        toast.error(error.response?.data?.message || "Failed to apply for the scholarship");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <ToastContainer />
      <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
        {/* Scholarship Image */}
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
            src={scholarship.logo || "http://bij.ly/4ib59B1"}
            alt={scholarship.scholarship_title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "16px",
            }}
          />
        </Box>

        {/* Scholarship Title and Country */}
        <Typography variant="h4" gutterBottom>
          {scholarship.scholarship_title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {scholarship.country}
        </Typography>

        {/* Scholarship Details */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body1">📍 {scholarship.city_municipality}</Typography>
          <Typography variant="body1">🎓 {scholarship.scholarship_type}</Typography>
          <Typography variant="body1">
            💰 Amount: {scholarship.amount || "N/A"}
          </Typography>
          <Typography variant="body1">
            ⏳ Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
          </Typography>
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {/* Apply Button */}
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
                pointerEvents: isApplied ? "none" : "auto",
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

          {/* Save Button */}
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

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Scholarship Description */}
        <Typography variant="h6" gutterBottom>
          Scholarship Description
        </Typography>
        <Typography variant="body1">{scholarship.scholarship_description}</Typography>

        {/* Application Time */}
        {applicationTime && (
          <Typography variant="caption" sx={{ mt: 2, color: "text.secondary" }}>
            Applied on: {new Date(applicationTime).toLocaleString()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ScholarshipView;