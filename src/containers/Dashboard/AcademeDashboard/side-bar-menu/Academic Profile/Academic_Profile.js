import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";

const Academic_Profile = () => {
  // Get logged in user data from Redux store
  const userAuth = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.user);

  // State for profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    dateOfBirth: "",
    placeOfBirth: "",
    sex: "",
    address: "",
    profilePicture: null,
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for profile image
  const [profileImage, setProfileImage] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    // Simulate fetching user data
    // In a real app, you would fetch this from your API
    setProfileData({
      firstName: userData?.firstName || "John",
      lastName: userData?.lastName || "Doe",
      email: userData?.email || userAuth?.email || "john.doe@example.com",
      username: userData?.username || userAuth?.username || "johndoe",
      dateOfBirth: "1990-01-01", // Changed to string format for standard date input
      placeOfBirth: "City Name",
      sex: "Male",
      address: "123 Main St, City, Country",
      profilePicture: null,
    });
  }, [userData, userAuth]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        // In a real app, you would upload this to your server
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save profile data
  const saveProfile = () => {
    // In a real app, you would save the data to your server here
    console.log("Saving profile data:", profileData);
    
    // For now, just turn off edit mode
    setIsEditing(false);
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Academic Profile</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={isEditing ? saveProfile : toggleEditMode}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Profile Picture */}
          <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
            <Box textAlign="center">
              <Avatar
                src={profileImage}
                sx={{ width: 150, height: 150, mb: 2, margin: "0 auto" }}
              />
              {isEditing && (
                <Button variant="outlined" component="label">
                  Upload Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </Box>
          </Grid>

          {/* Account Information Card */}
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Account Information" 
                sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white',
                }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information Card */}
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Personal Information" 
                sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white',
                }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Place of Birth"
                      name="placeOfBirth"
                      value={profileData.placeOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Sex</InputLabel>
                      <Select
                        name="sex"
                        value={profileData.sex}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        label="Sex"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Academic_Profile;