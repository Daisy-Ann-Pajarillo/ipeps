import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close, AccountCircle, Business, Home } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";

const EditUserModal = ({
  isModalOpen,
  handleCloseModal,
  userId,
  activeStep,
  handleBack,
  handleNext,
  handleSave,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    cellphone_number: "",
    institution_name: "",
    institution_type: "",
    permanent_barangay: "",
    permanent_municipality: "",
    permanent_province: "",
    permanent_zip_code: "",
    temporary_barangay: "",
    temporary_municipality: "",
    temporary_province: "",
    temporary_zip_code: "",
    valid_id_url: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      axios
        .get(`/api/admin/get-user-info/${userId}`, {
          auth: { username: auth.token },
        })
        .then((response) => {
          const personalInfo = response.data.personal_information[0];
          setFormData({
            username: response.data.username || "",
            email: response.data.email || "",
            first_name: personalInfo.first_name || "",
            middle_name: personalInfo.middle_name || "",
            last_name: personalInfo.last_name || "",
            cellphone_number: personalInfo.cellphone_number || "",
            institution_name: personalInfo.institution_name || "",
            institution_type: personalInfo.institution_type || "",
            permanent_barangay: personalInfo.permanent_barangay || "",
            permanent_municipality: personalInfo.permanent_municipality || "",
            permanent_province: personalInfo.permanent_province || "",
            permanent_zip_code: personalInfo.permanent_zip_code || "",
            temporary_barangay: personalInfo.temporary_barangay || "",
            temporary_municipality: personalInfo.temporary_municipality || "",
            temporary_province: personalInfo.temporary_province || "",
            temporary_zip_code: personalInfo.temporary_zip_code || "",
            valid_id_url: personalInfo.valid_id_url || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  // Custom styled TextField component - now disabled for view-only mode
  const StyledTextField = (props) => (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      disabled
      className="bg-gray-50 rounded-lg"
      InputProps={{
        className: "border-0",
        readOnly: true,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.5rem",
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.7)",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "rgb(107, 114, 128)",
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    />
  );

  // Step Icons
  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <AccountCircle />;
      case 1:
        return <Business />;
      case 2:
        return <Home />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full w-full p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2.5"></div>
          <div className="h-2 bg-gray-300 rounded w-32"></div>
        </div>
      </Box>
    );
  }

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-xl shadow-xl",
        sx: {
          borderRadius: "0.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 flex justify-between items-center">
        <Typography variant="h5" className="font-medium flex items-center gap-2">
          <span className="inline-block h-8 w-1 bg-white rounded mr-2"></span>
          View User Information
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseModal}
          aria-label="close"
          className="text-white hover:bg-white/10"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className="mb-8 pt-4"
          sx={{
            "& .MuiStepLabel-root .Mui-active": {
              color: "rgb(37, 99, 235)",
            },
            "& .MuiStepLabel-root .Mui-completed": {
              color: "rgb(34, 197, 94)",
            },
          }}
        >
          <Step>
            <StepLabel StepIconComponent={() => (
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 0 ? "bg-blue-600" : "bg-gray-300"} text-white`}>
                <AccountCircle />
              </div>
            )}>
              <span className="font-medium">Basic Info</span>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={() => (
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 1 ? "bg-blue-600" : "bg-gray-300"} text-white`}>
                <Business />
              </div>
            )}>
              <span className="font-medium">Contact Info</span>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={() => (
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-300"} text-white`}>
                <Home />
              </div>
            )}>
              <span className="font-medium">Address Info</span>
            </StepLabel>
          </Step>
        </Stepper>

        <Box className="mt-6">
          {/* Step 1 - Basic Information */}
          {activeStep === 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="h6" className="text-gray-800 font-medium mb-4 border-l-4 border-blue-500 pl-3">
                Personal Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Username"
                    name="username"
                    value={formData.username}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Email"
                    name="email"
                    value={formData.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Cellphone Number"
                    name="cellphone_number"
                    value={formData.cellphone_number}
                  />
                </Grid>
              </Grid>
            </div>
          )}

          {/* Step 2 - Contact Information */}
          {activeStep === 1 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="h6" className="text-gray-800 font-medium mb-4 border-l-4 border-blue-500 pl-3">
                Institution Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Institution Name"
                    name="institution_name"
                    value={formData.institution_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Institution Type"
                    name="institution_type"
                    value={formData.institution_type}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Valid ID URL"
                    name="valid_id_url"
                    value={formData.valid_id_url}
                  />
                </Grid>
              </Grid>
            </div>
          )}

          {/* Step 3 - Address Information */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Typography variant="h6" className="text-gray-800 font-medium mb-4 border-l-4 border-blue-500 pl-3">
                  Permanent Address
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Barangay"
                      name="permanent_barangay"
                      value={formData.permanent_barangay}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Municipality"
                      name="permanent_municipality"
                      value={formData.permanent_municipality}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Province"
                      name="permanent_province"
                      value={formData.permanent_province}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Zip Code"
                      name="permanent_zip_code"
                      value={formData.permanent_zip_code}
                    />
                  </Grid>
                </Grid>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Typography variant="h6" className="text-gray-800 font-medium mb-4 border-l-4 border-blue-500 pl-3">
                  Temporary Address
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Barangay"
                      name="temporary_barangay"
                      value={formData.temporary_barangay}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Municipality"
                      name="temporary_municipality"
                      value={formData.temporary_municipality}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Province"
                      name="temporary_province"
                      value={formData.temporary_province}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Zip Code"
                      name="temporary_zip_code"
                      value={formData.temporary_zip_code}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
        </Box>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50">
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          className="text-gray-700 hover:bg-gray-100 font-medium"
          sx={{
            textTransform: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (activeStep === 2) {
              handleCloseModal();
            } else {
              handleNext();
            }
          }}
          variant="contained"
          className={activeStep === 2 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"}
          sx={{
            textTransform: "none",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            backgroundColor: "rgb(37, 99, 235)",
            "&:hover": {
              backgroundColor: "rgb(29, 78, 216)",
            },
          }}
        >
          {activeStep === 2 ? "Exit" : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;