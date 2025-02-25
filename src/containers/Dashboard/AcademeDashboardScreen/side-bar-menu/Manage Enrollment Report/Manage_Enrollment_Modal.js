import React, { useState } from 'react';
import { Typography, Button, TextField, MenuItem, Grid, Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ManageEnrollmentModal = ({ open, onClose, onDataUpdate }) => {
    const [formData, setFormData] = useState({
        degree: '',
        educationalLevel: '',
        fieldOfStudy: '',
        major: '',
        enrollees: '',
        startYear: '',
        yearsToFinish: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
        if (typeof onDataUpdate !== 'function') {
            console.error('onDataUpdate is not a function:', onDataUpdate);
            return;
        }

        const isFormComplete = Object.values(formData).every((value) => value.trim() !== '');
        if (!isFormComplete) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const endYear = parseInt(formData.startYear, 10) + parseInt(formData.yearsToFinish, 10);
        const enrollmentReport = { ...formData, endYear, type: 'Enrollment' };

        console.log('Enrollment Report:', enrollmentReport);
        onDataUpdate(enrollmentReport);

        setFormData({
            degree: '',
            educationalLevel: '',
            fieldOfStudy: '',
            major: '',
            enrollees: '',
            startYear: '',
            yearsToFinish: ''
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Create Enrollment Report
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
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
                            select
                            label="Educational Level"
                            fullWidth
                            name="educationalLevel"
                            value={formData.educationalLevel}
                            onChange={handleChange}
                        >
                            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                            <MenuItem value="Graduate">Graduate</MenuItem>
                        </TextField>
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
                            label="Number of Enrollees"
                            type="number"
                            fullWidth
                            name="enrollees"
                            value={formData.enrollees}
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
                            label="Years To Finish The Course"
                            type="number"
                            fullWidth
                            name="yearsToFinish"
                            value={formData.yearsToFinish}
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
                    Create Enrollment Report
                </Button>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    p: 4,
    backgroundColor: 'white',
    maxWidth: 600,
    margin: '50px auto',
    borderRadius: 2,
    boxShadow: 3,
};

export default ManageEnrollmentModal;
