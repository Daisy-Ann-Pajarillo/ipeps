import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, MenuItem, Grid, Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

const GraduateReportModal = ({ open, onClose, onDataUpdate = () => { } }) => {
    const [formData, setFormData] = useState({
        degree: '',
        educationalLevel: '',
        fieldOfStudy: '',
        major: '',
        enrollees: '',
        graduates: '',
        startYear: '',
        endYear: ''
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Submit data to the backend
    const handleSubmit = async () => {
        // Validate that all fields are filled
        const isFormComplete = Object.values(formData).every((value) => value !== '');
        if (!isFormComplete) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // Validate numeric fields
        const isValidNumber = (value) => !isNaN(value) && value > 0;
        if (
            !isValidNumber(formData.enrollees) ||
            !isValidNumber(formData.startYear) ||
            !isValidNumber(formData.endYear)
        ) {
            alert('Please enter valid numbers for enrollees, start year, and end year.');
            return;
        }

        // Check if the authentication token exists
        if (!auth.token) {
            alert('Authentication token is missing. Please log in again.');
            return;
        }

        // Prepare the API payload
        const payload = {
            degree_or_qualification: formData.degree,
            education_level: formData.educationalLevel,
            field_of_study: formData.fieldOfStudy,
            major: formData.major,
            number_of_enrollees: parseInt(formData.enrollees, 10),
            start_year: parseInt(formData.startYear, 10),
            end_year: parseInt(formData.endYear, 10)
        };

        try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
            const response = await axios.post(`${API_BASE_URL}/api/add-enrollment-reports`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa(`${auth.token}:`)}`,
                },
            });

            if (response.data.success) {
                console.log('Graduate report added successfully!', payload);
                onDataUpdate(payload); // Notify parent component
                setFormData({
                    degree: '',
                    educationalLevel: '',
                    fieldOfStudy: '',
                    major: '',
                    enrollees: '',
                    graduates: '',
                    startYear: '',
                    endYear: '',
                });
                onClose();
            } else {
                alert(`Failed to add report: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Failed to add graduate report. Please try again.');
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 4,
                    backgroundColor: 'white',
                    maxWidth: 600,
                    margin: '50px auto',
                    borderRadius: 2,
                    boxShadow: 3,
                    position: 'relative',
                }}
            >
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
                            <MenuItem value="Bachelor of Science">Bachelor of Science</MenuItem>
                            <MenuItem value="Master of Science">Master of Science</MenuItem>
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
                    Submit Graduate Report
                </Button>
            </Box>
        </Modal>
    );
};

export default GraduateReportModal;