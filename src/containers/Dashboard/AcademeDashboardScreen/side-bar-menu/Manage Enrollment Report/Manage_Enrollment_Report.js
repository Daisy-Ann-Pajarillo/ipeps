import React, { useState } from 'react';
import { Button, Box, Card, CardContent, Typography, Grid, Modal } from '@mui/material';
import ManageEnrollmentModal from './Manage_Enrollment_Modal';

const ManageEnrollmentReport = () => {
    const [openModal, setOpenModal] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [viewData, setViewData] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleDataUpdate = (data) => {
        setEnrollmentData((prevData) => [...prevData, data]);
        handleCloseModal();
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{ mb: 2 }}
            >
                Create Enrollment Report
            </Button>

            {/* Enrollment Modal (Corrected Usage) */}
            <ManageEnrollmentModal
                open={openModal}
                onClose={handleCloseModal}
                onDataUpdate={handleDataUpdate}
            />

            {/* Display Enrollment Data as Cards */}
            <Grid container spacing={2}>
                {enrollmentData.map((data, index) => (
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
                                    Enrollees: {data.enrollees}
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
                ))}
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
