import React, { useState } from 'react';
import { Button, Modal, Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import GraduateReportModal from './GraduateReportModal';
import CloseIcon from '@mui/icons-material/Close';

const ManageGraduateReport = () => {
    const [openModal, setOpenModal] = useState(false);
    const [graduateData, setGraduateData] = useState([]);
    const [viewData, setViewData] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseView = () => setViewData(null);

    const handleDataUpdate = (data) => {
        setGraduateData((prevData) => [...prevData, data]);
        handleCloseModal();
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{ mb: 2 }}
            >
                Create Graduate Report
            </Button>

            <GraduateReportModal
                open={openModal}
                onClose={handleCloseModal}
                onDataUpdate={handleDataUpdate}
            />

            <Grid container spacing={2}>
                {graduateData.map((data, index) => (
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
                ))}
            </Grid>

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
