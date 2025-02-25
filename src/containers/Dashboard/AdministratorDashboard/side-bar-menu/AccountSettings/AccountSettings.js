import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Avatar,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

const AccountSettings = ({ open, onClose, userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Personal Information</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Profile Avatar */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }} />
          <Button variant="contained" component="label">
            Change Profile Picture
            <input type="file" hidden accept="image/*" />
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Name Fields */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        {!isEditing ? (
          <Button startIcon={<EditIcon />} onClick={handleEditToggle}>Edit</Button>
        ) : (
          <>
            <Button startIcon={<SaveIcon />} onClick={() => setIsEditing(false)}>Save</Button>
            <Button onClick={handleEditToggle}>Cancel</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AccountSettings;
