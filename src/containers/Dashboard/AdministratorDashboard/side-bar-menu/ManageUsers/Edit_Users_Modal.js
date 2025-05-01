import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditUserModal = ({ isModalOpen, handleCloseModal, userData }) => {
  const chipStyles = {
    m: 0.5,
    backgroundColor: "#1976d2",
    color: "#fff",
  };

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">User Information</Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="text.secondary">First Name</Typography>
              <Typography>{userData.personal_information?.first_name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">Last Name</Typography>
              <Typography>{userData.personal_information?.last_name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">Email</Typography>
              <Typography>{userData.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">Phone</Typography>
              <Typography>{userData.personal_information?.cellphone_number || "N/A"}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Preferred Work Location
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="text.secondary">Country</Typography>
              <Typography>{userData.job_preference?.country || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">City</Typography>
              <Typography>{userData.job_preference?.municipality || "N/A"}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Educational Background
          </Typography>
          {userData.educational_background?.map((edu, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography color="text.secondary">School</Typography>
              <Typography>{edu.school_name || "N/A"}</Typography>
              <Typography color="text.secondary">Degree</Typography>
              <Typography>{edu.degree_or_qualification || "N/A"}</Typography>
            </Paper>
          ))}

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Trainings
          </Typography>
          {userData.trainings?.map((training, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography color="text.secondary">Course</Typography>
              <Typography>{training.course_name || "N/A"}</Typography>
              <Typography color="text.secondary">Institution</Typography>
              <Typography>{training.training_institution || "N/A"}</Typography>
            </Paper>
          ))}

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Professional Licenses
          </Typography>
          {userData.professional_licenses?.map((license, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography color="text.secondary">License</Typography>
              <Typography>{license.license || "N/A"}</Typography>
            </Paper>
          ))}

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Work Experience
          </Typography>
          {userData.work_experiences?.map((exp, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography color="text.secondary">Company</Typography>
              <Typography>{exp.company_name || "N/A"}</Typography>
              <Typography color="text.secondary">Position</Typography>
              <Typography>{exp.position || "N/A"}</Typography>
            </Paper>
          ))}

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Other Skills
          </Typography>
          <Box>
            {userData.other_skills?.map((skill, index) => (
              <Chip key={index} label={skill.skills || "N/A"} sx={chipStyles} />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;