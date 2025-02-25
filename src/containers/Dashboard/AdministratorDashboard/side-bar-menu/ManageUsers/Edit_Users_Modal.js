import React from "react";
import {
  Box,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const EditUserModal = ({
  isModalOpen,
  handleCloseModal,
  selectedUser,
  activeStep,
  handleBack,
  handleNext,
  handleSave,
}) => {
  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit User Information
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseModal}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }} nonLinear>
          <Step><StepLabel>Basic Info</StepLabel></Step>
          <Step><StepLabel>Contact Info</StepLabel></Step>
          <Step><StepLabel>Verification</StepLabel></Step>
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {selectedUser && (
            <>
              {/* Step 1 - Basic Information */}
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="User ID"
                      value={selectedUser.userId}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="User Type"
                      value={selectedUser.userType}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Access"
                      value={`${selectedUser.firstName} ${selectedUser.middleName} ${selectedUser.lastName}`}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Sex"
                      value={selectedUser.sex}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      value={selectedUser.email}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      value={selectedUser.dateOfBirth}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nationality"
                      value={selectedUser.nationality}
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 2 - Contact Information */}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact Number"
                      value={selectedUser.contactNumber}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Landline Number"
                      value={selectedUser.landlineNumber}
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 3 - Verification Information */}
              {activeStep === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Industry"
                      value={selectedUser.industry}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Designation"
                      value={selectedUser.designation}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Suffix"
                      value={selectedUser.suffix}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Civil Status"
                      value={selectedUser.civilStatus}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Religion"
                      value={selectedUser.religion}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Verification"
                      value={selectedUser.emailVerification}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Height"
                      value={selectedUser.height}
                      fullWidth
                      disabled
                    />
                  </Grid>

                  {/* Display User Image and ID Verification Image */}
                  <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <Grid item xs={5} textAlign="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>User Image:</Typography>
                      <Avatar src={selectedUser.userImgFileUrl} alt={selectedUser.userImgFileName} sx={{ width: 100, height: 100 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>{selectedUser.userImgFileName}</Typography>
                    </Grid>
                    <Grid item xs={5} textAlign="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>ID Verification Image:</Typography>
                      <Avatar src={selectedUser.idVerificationImgFileUrl} alt={selectedUser.idVerificationImgFileName} sx={{ width: 100, height: 100 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>{selectedUser.idVerificationImgFileName}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button onClick={activeStep === 2 ? handleSave : handleNext} variant="contained">
          {activeStep === 2 ? "Save" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
