import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import GraduateReportModal from './GraduateReportModal';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../store/actions/index';

const ManageGraduateReport = () => {
    const [openModal, setOpenModal] = useState(false);
    const [graduateData, setGraduateData] = useState([]);
    const [viewData, setViewData] = useState(null);

    // Open and close modal handlers
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseView = () => setViewData(null);

    // Redux state and dispatch
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    // Fetch graduate reports from the API
    useEffect(() => {
        const fetchGraduateReports = async () => {
            try {
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
                const response = await axios.get(`${API_BASE_URL}/api/get-enrollment-reports`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: auth.token ? `Basic ${btoa(`${auth.token}:`)}` : '',
                    },
                });

                console.log('Fetched Graduate Data:', response.data);

                if (response.data.success && Array.isArray(response.data.enrollment_reports)) {
                    // Transform the API response to match the expected structure
                    const transformedData = response.data.enrollment_reports.map((report) => ({
                        degree: report.degree_or_qualification,
                        major: report.major,
                        fieldOfStudy: report.field_of_study,
                        enrollees: report.number_of_enrollees,
                        graduates: report.number_of_graduates || 0, // Default to 0 if not provided
                        startYear: report.start_year,
                        endYear: report.end_year,
                    }));

                    setGraduateData(transformedData);
                } else {
                    console.error('Unexpected API response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching graduate reports:', error.message || error);
            }
        };

        fetchGraduateReports();
    }, [auth.token]);

    // Handle new graduate report submission
    const handleDataUpdate = (data) => {
        // Transform the incoming data to match the expected structure
        const transformedData = {
            degree: data.degree_or_qualification,
            major: data.major,
            fieldOfStudy: data.field_of_study,
            enrollees: data.number_of_enrollees,
            graduates: data.number_of_graduates || 0, // Default to 0 if not provided
            startYear: data.start_year,
            endYear: data.end_year,
        };

        // Add the new report to the list
        setGraduateData((prevData) => [...prevData, transformedData]);
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
                Create Graduate Report
            </Button>

            {/* Graduate Report Modal */}
            <GraduateReportModal
                open={openModal}
                onClose={handleCloseModal}
                onDataUpdate={handleDataUpdate}
            />

            {/* Display the list of graduate reports */}
            <Grid container spacing={2}>
                {graduateData.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">
                            No graduate reports available.
                        </Typography>
                    </Grid>
                ) : (
                    graduateData.map((data, index) => (
                        <Grid item xs={12} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {data.degree} in {data.major}
                                    </Typography>
                                    <Typography variant="body2">
                                        Field of Study: {data.fieldOfStudy}
                                    </Typography>
                                    <Typography variant="body2">
                                        Graduates: {data.graduates} / Enrollees: {data.enrollees}
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

            {/* Modal for viewing detailed report */}
            <Modal open={Boolean(viewData)} onClose={handleCloseView}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Graduate Report Details
                        </Typography>
                        <IconButton onClick={handleCloseView}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

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
                        onClick={handleCloseView}
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

export default ManageGraduateReport;