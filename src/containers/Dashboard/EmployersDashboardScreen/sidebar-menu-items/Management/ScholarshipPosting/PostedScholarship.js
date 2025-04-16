import React, { useState, useEffect } from "react";
import axios from "../../../../../../axios";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";

import { Box, Typography, Paper, Avatar, Button, Slide, IconButton, Grid, Divider, TextField, InputLabel, Card, CardMedia } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { CloudUpload } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to map status to MUI color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'closed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const scholarshipSchema = yup.object().shape({
  scholarship_title: yup.string().required("Scholarship Title is required"),
  scholarship_description: yup.string().required("Scholarship Description is required"),
  expiration_date: yup.date().required("Expiration Date is required"),
});

const PostedScholarship = ({ createScholarshipOpen }) => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [images, setImages] = useState([]);
  const maxImages = 5;

  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Initialize form with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scholarshipSchema),
  });

  useEffect(() => {
    // Fetch scholarship postings from the API
    const fetchScholarships = async () => {
      try {
        const response = await axios.get('/api/get-scholarship-postings', {
          auth: { username: auth.token }
        });

        if (response.status === 200) {
          const responseData = response.data;
          // Handle the response as an array
          const data = Array.isArray(responseData.scholarship_postings)
            ? responseData.scholarship_postings
            : [];

          console.log('Scholarship Data:', data); // Log the scholarship data

          setScholarships(data);
        } else {
          console.error('Failed to fetch scholarship postings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching scholarship postings:', error);
      }
    };

    fetchScholarships();
  }, [auth.token]);

  // Debug log to check first scholarship record structure
  useEffect(() => {
    if (scholarships.length > 0) {
      console.log("First scholarship record:", scholarships[0]);
    }
  }, [scholarships]);

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailsPanelOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
  };

  return (
    <Box sx={{ height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: "100%", position: "relative", display: "flex" }}>
        <Box 
          sx={{ 
            height: "100%", 
            overflowY: "auto", 
            p: 3, 
            width: detailsPanelOpen ? "calc(100% - 400px)" : "100%", 
            transition: "width 0.3s ease-in-out" 
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Scholarship Posted
            </Typography>
          </Box>

          <Box
            className={`p-6 grid gap-3 grid-cols-3`}
          >
            {scholarships.map((scholarship) => (
              <Paper
                key={scholarship.id}
                sx={{ 
                  p: 2, 
                  display: "flex", 
                  flexDirection: "column",
                  mb: 2, 
                  cursor: "pointer",
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                  height: "100%"
                }}
                onClick={() => handleViewDetails(scholarship)}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={scholarship.logo}
                    alt={scholarship.company || "Company"}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {scholarship.scholarship_title || scholarship.scholarship_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{scholarship.company || "Company"}</Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {scholarship.scholarship_description || scholarship.description || "No description provided"}
                </Typography>
                
                <Box sx={{ mt: "auto" }}>
                  <Typography variant="body2" color="text.secondary">
                    Slots: {scholarship.slots || scholarship.no_of_slots || "Not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {scholarship.expiration_date || scholarship.expiration || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    Status:
                    <Button
                      variant="contained"
                      color={getStatusColor(scholarship.status)}
                      sx={{
                        borderRadius: "4px",
                        padding: "2px 8px",
                        marginLeft: "8px",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        lineHeight: "1.5",
                        minWidth: "auto",
                        height: "24px",
                      }}
                    >
                      {scholarship.status}
                    </Button>
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Details Panel with slide animation */}
        <Slide direction="left" in={detailsPanelOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "400px",
              height: "100%",
              bgcolor: "background.paper",
              boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
              p: 3,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {selectedScholarship && (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                    {selectedScholarship.scholarship_title || selectedScholarship.scholarship_name}
                  </Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      src={selectedScholarship.logo} 
                      alt={selectedScholarship.company}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{selectedScholarship.company}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Button
                      variant="contained"
                      color={getStatusColor(selectedScholarship.status)}
                      sx={{
                        borderRadius: "4px",
                        padding: "2px 8px",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        lineHeight: "1.5",
                        minWidth: "auto",
                      }}
                    >
                      {selectedScholarship.status}
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Slots Available</Typography>
                    <Typography variant="body1">{selectedScholarship.slots || selectedScholarship.no_of_slots || "Not specified"}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Expiration</Typography>
                    <Typography variant="body1">
                      {selectedScholarship.expiration_date || selectedScholarship.expiration || "Not specified"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedScholarship.scholarship_description || selectedScholarship.description || "No description provided"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Uploaded Images</Typography>
                    {selectedScholarship.images && selectedScholarship.images.length > 0 ? (
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        {selectedScholarship.images.map((image, index) => (
                          <Grid item xs={6} key={index}>
                            <Card>
                              <CardMedia
                                component="img"
                                height="140"
                                image={image.url || image || '/static/placeholder.png'}
                                alt={`Scholarship image ${index + 1}`}
                                sx={{ objectFit: 'cover' }}
                              />
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No images uploaded</Typography>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Slide>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default PostedScholarship;
