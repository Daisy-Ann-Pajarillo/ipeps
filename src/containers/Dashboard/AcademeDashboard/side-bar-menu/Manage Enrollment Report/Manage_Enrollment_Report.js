import React, { useState, useEffect } from 'react';
import { Button, Box, Card, CardContent, Typography, Grid, Modal } from '@mui/material';
import ManageEnrollmentModal from './Manage_Enrollment_Modal';


import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

const ManageEnrollmentReport = () => {
    const [openModal, setOpenModal] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [viewData, setViewData] = useState(null);

    // Handlers for modal open/close
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);



    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    useEffect(() => {
        const fetchGraduateReports = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/get-graduate-reports', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: auth.token ? `Basic ${btoa(`${auth.token}:`)}` : ''
                    }
                });

                // ✅ Axios automatically parses the response, so use response.data directly
                console.log('Fetched Enrollment Data:', response.data);

                if (response.data.success && Array.isArray(response.data.graduate_reports)) {
                    const transformedData = response.data.graduate_reports.map((report) => ({
                        degree: report.degree_or_qualification,
                        educationalLevel: report.education_level,
                        fieldOfStudy: report.field_of_study,
                        major: report.major,
                        enrollees: report.number_of_enrollees,
                        startYear: report.start_year,
                        endYear: report.end_year,
                        graduates: report.number_of_graduates,
                    }));

                    setEnrollmentData(transformedData);
                } else {
                    console.error('Unexpected API response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching graduate reports:', error.message || error);
            }
        };

        fetchGraduateReports();
    }, [auth.token]);


    // Handle data update from the modal
    const handleDataUpdate = (data) => {
        console.log('New Data Received:', data); // Log the received data

        // Transform the incoming data to match the expected structure
        const transformedData = {
            degree: data.degree_or_qualification,
            educationalLevel: data.education_level,
            fieldOfStudy: data.field_of_study,
            major: data.major,
            enrollees: data.number_of_enrollees,
            startYear: data.start_year,
            endYear: data.end_year,
            graduates: data.number_of_graduates,
        };

        // Append the transformed data to the enrollmentData state
        setEnrollmentData((prevData) => [...prevData, transformedData]);
        handleCloseModal();
    };

    return (
        <div>
            {/* Button to open the modal */}
            <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{ mb: 2 }}
            >
                Create Enrollment Report
            </Button>

            {/* Enrollment Modal */}
            <ManageEnrollmentModal
                open={openModal}
                onClose={handleCloseModal}
                onDataUpdate={handleDataUpdate}
            />

            {/* Display Enrollment Data as Cards */}
            <Grid container spacing={2}>
                {enrollmentData.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">
                            No enrollment reports available.
                        </Typography>
                    </Grid>
                ) : (
                    enrollmentData.map((data, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ minHeight: 200 }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {data.degree} in {data.major}
                                    </Typography>
                                    <Typography variant="body2">
                                        Field of Study: {data.fieldOfStudy}
                                    </Typography>
                                    <Typography variant="body2">
                                        Enrollees: {data.enrollees}
                                    </Typography>
                                    <Typography variant="body2">
                                        Graduates: {data.graduates}
                                    </Typography>
                                    <Typography variant="body2">
                                        Duration: {data.startYear} - {data.endYear}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setViewData(data)}
                                        sx={{ mt: 2 }}
                                    >
                                        View
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Modal for Viewing Enrollment Details */}
            <Modal open={Boolean(viewData)} onClose={() => setViewData(null)}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" gutterBottom>
                        Enrollment Report Details
                    </Typography>
                    {viewData && (
                        <>
                            <Typography>Degree: {viewData.degree}</Typography>
                            <Typography>Major: {viewData.major}</Typography>
                            <Typography>Field of Study: {viewData.fieldOfStudy}</Typography>
                            <Typography>Enrollees: {viewData.enrollees}</Typography>
                            <Typography>Graduates: {viewData.graduates}</Typography>
                            <Typography>
                                Duration: {viewData.startYear} - {viewData.endYear}
                            </Typography>
                        </>
                    )}
                    <Button
                        variant="contained"
                        onClick={() => setViewData(null)}
                        sx={{ mt: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

// Reusable modal styling
const modalStyle = {
    p: 4,
    backgroundColor: 'white',
    margin: 'auto',
    mt: 10,
    width: 600,
    borderRadius: 2,
    boxShadow: 3,
};

export default ManageEnrollmentReport;