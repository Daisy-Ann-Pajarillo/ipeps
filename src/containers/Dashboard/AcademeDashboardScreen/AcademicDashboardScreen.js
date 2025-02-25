import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";

// Import files
import { tokens } from "../../../../../gab/Ipeps-Frontend/OJT_2 WORK/ipeps-frontend/src/theme"; // Ensure this path is correct
import SideBar from "./layout/Sidebar";
import Topbar from "./layout/TopBar";

// Import Main Pages
import School_Records from "./side-bar-menu/School Records/School_Records";
import Academic_Profile from "./side-bar-menu/Academic Profile/Academic_Profile";
import Settings from "./side-bar-menu/Settings/Settings";
import Manage_Graduate_Report from "./side-bar-menu/Manage Graduate Report/Manage_Graduate_Report";
import ManageEnrollmentReport from "./side-bar-menu/Manage Enrollment Report/Manage_Enrollment_Report";


const AcademeDashboardScreen = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box sx={{ display: "flex", backgroundColor: colors.primary[400], minHeight: "100vh" }}>
            <SideBar />
            <Box sx={{ flexGrow: 1, p: 3, marginLeft: "10px" }}>
                <Topbar />
                <Box mt="20px">

                    <Routes>
                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/academe-dashboard/academic-profile" replace />} />

                        {/* Main Routes */}
                        <Route path="academic-profile" element={<Academic_Profile />} />
                        <Route path="school-records" element={<School_Records />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="manage-graduate-report" element={<Manage_Graduate_Report />} />
                        <Route path="manage-enrollment-report" element={<ManageEnrollmentReport />} />

                        {/* Catch-All Route */}
                        <Route path="*" element={<Navigate to="/academe-dashboard/" replace />} />
                    </Routes>

                </Box>
            </Box>
        </Box>
    );
};

export default AcademeDashboardScreen;
