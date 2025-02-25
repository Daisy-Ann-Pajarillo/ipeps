import React, { useState } from 'react';
import { Typography, Button, TextField, MenuItem, Grid, Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GraduateReportModal = ({ open, onClose, onDataUpdate = () => {} }) => {
    const [formData, setFormData] = useState({
        degree: '',
        educationalLevel: '',
        fieldOfStudy: '',
        major: '',
        year: '',
        enrollees: '',
        graduates: '',
        startYear: '',
        endYear: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
        const isFormComplete = Object.values(formData).every((value) => value !== '');
        if (!isFormComplete) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const graduateReport = { ...formData, type: 'Graduate' };
        onDataUpdate(graduateReport);

        setFormData({
            degree: '',
            educationalLevel: '',
            fieldOfStudy: '',
            major: '',
            year: '',
            enrollees: '',
            graduates: '',
            startYear: '',
            endYear: ''
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, backgroundColor: 'white', maxWidth: 600, margin: '50px auto', borderRadius: 2, boxShadow: 3, position: 'relative' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" gutterBottom>
                    Create Graduate Report
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Degree or Qualification"
                            fullWidth
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                        >
                            <MenuItem value="Bachelor">Bachelor</MenuItem>
                            <MenuItem value="Master">Master</MenuItem>
                            <MenuItem value="PhD">PhD</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Educational Level"
                            fullWidth
                            name="educationalLevel"
                            value={formData.educationalLevel}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Field of Study"
                            fullWidth
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Major"
                            fullWidth
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Year"
                            type="number"
                            fullWidth
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Number of Enrollees"
                            type="number"
                            fullWidth
                            name="enrollees"
                            value={formData.enrollees}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Number of Graduates"
                            type="number"
                            fullWidth
                            name="graduates"
                            value={formData.graduates}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Start Year"
                            type="number"
                            fullWidth
                            name="startYear"
                            value={formData.startYear}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="End Year"
                            type="number"
                            fullWidth
                            name="endYear"
                            value={formData.endYear}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Create Graduate Report
                </Button>
            </Box>
        </Modal>
    );
};

export default GraduateReportModal;
