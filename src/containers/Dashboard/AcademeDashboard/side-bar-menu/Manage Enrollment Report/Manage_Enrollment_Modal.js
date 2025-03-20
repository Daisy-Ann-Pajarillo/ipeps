import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    TextField,
    MenuItem,
    Grid,
    Box,
    Modal,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

const ManageEnrollmentModal = ({ open, onClose, onDataUpdate }) => {
    const [formData, setFormData] = useState({
        degree: '',
        educationalLevel: '',
        fieldOfStudy: '',
        major: '',
        enrollees: '',
        startYear: '',
        yearsToFinish: '',
        numberOfGraduates: '',
        endYear: '',
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        if (typeof onDataUpdate !== 'function') {
            console.error('onDataUpdate is not a function:', onDataUpdate);
            return;
        }

        const isFormComplete = Object.entries(formData).every(([key, value]) => {
            if (['enrollees', 'startYear', 'yearsToFinish', 'numberOfGraduates', 'endYear'].includes(key)) {
                return !isNaN(value) && value.trim() !== '' && parseInt(value, 10) > 0;
            }
            return value.trim() !== '';
        });

        if (!isFormComplete) {
            alert('Please fill in all fields correctly. Numeric fields must be greater than 0.');
            return;
        }

        try {
            const enrollmentReport = {
                degree_or_qualification: formData.degree,
                education_level: formData.educationalLevel,
                field_of_study: formData.fieldOfStudy,
                major: formData.major,
                year: parseInt(formData.startYear, 10),
                number_of_enrollees: parseInt(formData.enrollees, 10),
                number_of_graduates: parseInt(formData.numberOfGraduates, 10),
                start_year: parseInt(formData.startYear, 10),
                end_year: parseInt(formData.endYear, 10),
                type: 'Enrollment',
            };

            console.log('Enrollment Report:', enrollmentReport);

            onDataUpdate(enrollmentReport);

            const response = await axios.post(
                'http://127.0.0.1:5000/api/add-graduate-reports',
                enrollmentReport,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: auth.token ? `Basic ${btoa(`${auth.token}:`)}` : '',
                    },
                }
            );

            console.log('API Response:', response.data);

            setFormData({
                degree: '',
                educationalLevel: '',
                fieldOfStudy: '',
                major: '',
                enrollees: '',
                startYear: '',
                yearsToFinish: '',
                numberOfGraduates: '',
                endYear: '',
            });

            onClose();
        } catch (error) {
            console.error('Error sending data to the server:', error.message || error);
            alert('An error occurred while submitting the form. Please try again.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {/* Header Section */}
                <Box sx={headerStyle}>
                    <Typography variant="h5">Create Enrollment Report</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Form Section */}
                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
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

                        <TextField
                            select
                            label="Educational Level"
                            fullWidth
                            name="educationalLevel"
                            value={formData.educationalLevel}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                            <MenuItem value="Graduate">Graduate</MenuItem>
                        </TextField>

                        <TextField
                            label="Field of Study"
                            fullWidth
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            label="Major"
                            fullWidth
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Number of Enrollees"
                            type="number"
                            fullWidth
                            name="enrollees"
                            value={formData.enrollees}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Number of Graduates"
                            type="number"
                            fullWidth
                            name="numberOfGraduates"
                            value={formData.numberOfGraduates}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            label="Start Year"
                            type="number"
                            fullWidth
                            name="startYear"
                            value={formData.startYear}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="End Year"
                            type="number"
                            fullWidth
                            name="endYear"
                            value={formData.endYear}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={submitButtonStyle}
                >
                    Create Enrollment Report
                </Button>
            </Box>
        </Modal>
    );
};

// Modal Styling
const modalStyle = {
    p: 4,
    backgroundColor: 'white',
    maxWidth: 700,
    margin: '50px auto',
    borderRadius: 2,
    boxShadow: 5,
};

// Header Styling
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
};

// Submit Button Styling
const submitButtonStyle = {
    mt: 3,
    width: '100%',
    '&:hover': {
        backgroundColor: '#1976D2',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
};

export default ManageEnrollmentModal;
