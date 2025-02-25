import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    useTheme,
    Button,
    Modal,
    Box,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { tokens } from '../../../../../../../gab/Ipeps-Frontend/OJT_2 WORK/ipeps-frontend/src/theme';
import ManageGraduateReport from '../Manage Graduate Report/Manage_Graduate_Report';
import ManageEnrollmentReport from '../Manage Enrollment Report/Manage_Enrollment_Report';

const SchoolRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [openGraduateModal, setOpenGraduateModal] = useState(false);
    const [openEnrollmentModal, setOpenEnrollmentModal] = useState(false);
    const [schoolData, setSchoolData] = useState([]);
    const [filter, setFilter] = useState('All');

    const handleOpenGraduateModal = () => setOpenGraduateModal(true);
    const handleCloseGraduateModal = () => setOpenGraduateModal(false);

    const handleOpenEnrollmentModal = () => setOpenEnrollmentModal(true);
    const handleCloseEnrollmentModal = () => setOpenEnrollmentModal(false);

    const handleGraduateDataUpdate = (data) => {
        setSchoolData((prevData) => [...prevData, { ...data, type: 'Graduate' }]);
        handleCloseGraduateModal();
    };

    const handleEnrollmentDataUpdate = (data) => {
        setSchoolData((prevData) => [...prevData, { ...data, type: 'Enrollment' }]);
        handleCloseEnrollmentModal();
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    // Filtered data based on selected filter
    const filteredData = schoolData.filter((school) =>
        filter === 'All' || school.type === filter
    );

    return (
        <div>
            {/* Buttons to open report management modals */}
            <Button
                variant="contained"
                onClick={handleOpenGraduateModal}
                sx={{ marginBottom: 2, marginRight: 2 }}
            >
                Manage Graduate Report
            </Button>

            <Button
                variant="contained"
                onClick={handleOpenEnrollmentModal}
                sx={{ marginBottom: 2 }}
            >
                Manage Enrollment Report
            </Button>

            {/* Graduate Report Modal */}
            <Modal open={openGraduateModal} onClose={handleCloseGraduateModal}>
                <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', mt: 10, width: 600 }}>
                    <ManageGraduateReport onDataUpdate={handleGraduateDataUpdate} />
                </Box>
            </Modal>

            {/* Enrollment Report Modal */}
            <Modal open={openEnrollmentModal} onClose={handleCloseEnrollmentModal}>
                <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', mt: 10, width: 600 }}>
                    <ManageEnrollmentReport onDataUpdate={handleEnrollmentDataUpdate} />
                </Box>
            </Modal>

            {/* Filter Toggle Buttons */}
            <Box sx={{ marginBottom: 3 }}>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="Filter Reports"
                >
                    <ToggleButton value="All" aria-label="All Reports">
                        All Reports
                    </ToggleButton>
                    <ToggleButton value="Graduate" aria-label="Graduate Reports">
                        Graduate Reports
                    </ToggleButton>
                    <ToggleButton value="Enrollment" aria-label="Enrollment Reports">
                        Enrollment Reports
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Displaying Cards Based on Filter */}
            <Grid container spacing={3}>
                {filteredData.map((school, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ backgroundColor: colors.primary[400] }}>
                            <CardContent>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {school.degree} in {school.major} ({school.educationalLevel})
                                </Typography>
                                <Typography variant="body2" color={colors.grey[200]}>
                                    Field of Study: {school.fieldOfStudy}
                                </Typography>

                                {school.type === 'Graduate' ? (
                                    <>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Year: {school.year}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Enrollees: {school.enrollees}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Graduates: {school.graduates}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Duration: {school.startYear} - {school.endYear}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Number of Enrollees: {school.enrollees}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Start Year: {school.startYear}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[200]}>
                                            Years to Finish: {school.yearsToFinish}
                                        </Typography>
                                    </>
                                )}

                                <Button
                                    variant="outlined"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => alert(`Viewing details for ${school.degree} in ${school.major}`)}
                                >
                                    View
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default SchoolRecords;
