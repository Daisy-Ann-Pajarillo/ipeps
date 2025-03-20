import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Button,
} from "@mui/material";
import { tokens } from "../../../theme";
import SavedTrainingsView from "./SavedTrainingsView";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";

const SavedTrainings = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const headerHeight = "72px";
  const [enrolledTrainings, setEnrolledTrainings] = useState({});
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Check status for a single training
  const checkTrainingStatus = async (trainingId) => {
    if (!auth.token || !trainingId) return null;

    try {
      const response = await axios.post(
        "/api/check-training-status",
        {
          employer_trainingpost_id: trainingId,
        },
        {
          auth: { username: auth.token },
        }
      );

      if (response.data && response.data.success) {
        return {
          is_applied: response.data.is_applied || false,
        };
      }
    } catch (error) {
      console.error(`Error checking status for training ${trainingId}:`, error);
    }

    return null;
  };

  // Fetch saved trainings from the API with authentication
  const fetchSavedTrainings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-saved-trainings", {
        auth: {
          username: auth.token,
        },
      });

      console.log("Saved trainings response:", response.data);

      // Handle the response data
      if (response.data.success && Array.isArray(response.data.trainings)) {
        const transformedTrainings = response.data.trainings.map(
          (training) => ({
            id: training.saved_training_id,
            training_id:
              training.employer_trainingpost_id || training.training_id, // Use employer_trainingpost_id if available
            title: training.training_title,
            description: training.training_description,
            companyImage: training.providerImage || "https://bit.ly/3Qgevzn",
            expiration: training.expiration_date,
            provider: training.provider || "Unknown Provider",
            // Adding more properties that might be needed
            city_municipality: training.city_municipality,
            training_type: training.training_type,
            experience_level: training.experience_level,
            estimated_cost_from: training.estimated_cost_from,
            estimated_cost_to: training.estimated_cost_to,
          })
        );

        setSavedTrainings(transformedTrainings);

        // If there was a selected training, try to find it in the new list
        if (selectedTraining) {
          const updatedSelected = transformedTrainings.find(
            (t) => t.id === selectedTraining.id
          );
          setSelectedTraining(updatedSelected || null);
        }

        // Check enrollment status for all trainings
        checkEnrollmentStatuses(transformedTrainings);
      } else {
        console.error("Invalid API response:", response.data);
        toast.error("Failed to load saved trainings");
      }
    } catch (error) {
      console.error("Error fetching saved trainings:", error);
      toast.error("Failed to load saved trainings");
    } finally {
      setIsLoading(false);
    }
  };

  // Check enrollment status for all trainings
  const checkEnrollmentStatuses = async (trainings) => {
    if (!auth.token || !trainings.length) return;

    const enrolledMap = {};

    for (const training of trainings) {
      if (training.training_id) {
        try {
          const status = await checkTrainingStatus(training.training_id);
          if (status && status.is_applied) {
            enrolledMap[training.training_id] = true;
          }
        } catch (error) {
          // Continue checking other trainings even if one fails
          console.error(
            `Error checking status for training ${training.training_id}:`,
            error
          );
        }
      }
    }

    setEnrolledTrainings(enrolledMap);
  };

  useEffect(() => {
    if (auth.token) {
      fetchSavedTrainings();
    }
  }, [auth.token]);

  const handleEnroll = async (trainingId) => {
    if (!auth.token) {
      toast.error("Please login to enroll in a training");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/apply-training",
        {
          employer_trainingpost_id: trainingId,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      // Update enrollment status
      setEnrolledTrainings((prev) => ({
        ...prev,
        [trainingId]: true,
      }));

      toast.success(
        response.data.message || "Successfully enrolled in the training"
      );
    } catch (error) {
      console.error("Error enrolling in training:", error);
      if (error.response?.data?.is_applied) {
        setEnrolledTrainings((prev) => ({
          ...prev,
          [trainingId]: true,
        }));
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

  const handleRemoveFromSaved = async (training) => {
    setIsLoading(true);
    try {
      // Use the correct ID for the API call
      const trainingIdToUse = training.training_id;

      // Using the save-training endpoint to toggle saved status
      const response = await axios.post(
        "/api/save-training",
        {
          employer_trainingpost_id: trainingIdToUse,
        },
        {
          auth: {
            username: auth.token,
          },
        }
      );

      // Remove the training from local state
      const updatedTrainings = savedTrainings.filter(
        (t) => t.id !== training.id
      );
      setSavedTrainings(updatedTrainings);

      // If the removed training was selected, clear the selection
      if (selectedTraining?.id === training.id) {
        setSelectedTraining(null);
      }

      toast.info("Training removed from saved items");
    } catch (error) {
      console.error("Error removing saved training:", error);
      toast.error("Failed to remove training from saved items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingClick = (trainingId) => {
    const selected = savedTrainings.find((t) => t.id === trainingId);
    setSelectedTraining(selected);
  };

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState(savedTrainings);

  // useEffect to filter and sort trainings dynamically
  useEffect(() => {
    let updatedTrainings = [
      ...(Array.isArray(savedTrainings) ? savedTrainings : []),
    ];

    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(query.toLowerCase())) ||
          (t.description &&
            t.description.toLowerCase().includes(query.toLowerCase())) ||
          (t.provider && t.provider.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Sorting logic
    if (sortBy === "Company Name") {
      updatedTrainings.sort((a, b) =>
        (a.provider || "").localeCompare(b.provider || "")
      );
    } else if (sortBy === "Most Recent") {
      // Sort by expiration date if available, otherwise keep original order
      updatedTrainings.sort((a, b) => {
        if (!a.expiration && !b.expiration) return 0;
        if (!a.expiration) return 1;
        if (!b.expiration) return -1;
        return new Date(b.expiration) - new Date(a.expiration);
      });
    }

    // Update filtered trainings
    setFilteredTrainings(updatedTrainings);
  }, [query, sortBy, savedTrainings]); // Dependencies

  return (
    <Box>
      <ToastContainer />
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          { title: "Sort By", options: ["", "Most Recent", "Company Name"] },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setSortBy(value);
        }}
      />
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          top: headerHeight,
          left: isCollapsed ? "80px" : "250px",
          right: 0,
          bottom: 0,
          transition: "left 0.3s",
        }}
      >
        {/* Training Listings Panel */}
        <Box
          sx={{
            width: "60%",
            height: "100%",
            overflowY: "auto",
            p: 3,
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography variant="subtitle1" mb={2}>
            Saved Trainings: {filteredTrainings.length}
          </Typography>

          {isLoading && savedTrainings.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              Loading saved trainings...
            </Typography>
          ) : filteredTrainings.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              {query
                ? "No trainings match your search"
                : "You haven't saved any trainings yet"}
            </Typography>
          ) : (
            filteredTrainings.map((training) => (
              <Card
                key={training.id}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  backgroundColor:
                    selectedTraining?.id === training.id ? "#f5f5f5" : "white",
                  "&:hover": { backgroundColor: "#f8f9fa" },
                }}
                onClick={() => handleTrainingClick(training.id)}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                  >
                    <Button
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(training);
                      }}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={training.companyImage}
                        alt={training.provider || training.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "8px",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" component="div" gutterBottom>
                        {training.title}
                      </Typography>
                      <Typography color="text.secondary" noWrap>
                        {training.provider || ""}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {training.description}
                      </Typography>
                    </Box>

                    {/* Application Status Indicator - Match design from TrainingSearch */}
                    {enrolledTrainings[training.training_id] && (
                      <div className="flex items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Enrolled
                        </span>
                      </div>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
        {/* Training View Panel */}
        <Box
          sx={{
            width: "40%",
            height: "100%",
            overflowY: "auto",
            backgroundColor: "white",
          }}
        >
          {selectedTraining && (
            <SavedTrainingsView
              training={selectedTraining}
              isEnrolled={
                enrolledTrainings[selectedTraining.training_id] || false
              }
              onEnroll={() => handleEnroll(selectedTraining.training_id)}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedTrainings;
