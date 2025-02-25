import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";

import SideBar from "../components/layout/SideBar";

// Import Main Pages
import School_Records from "./side-bar-menu/School Records/School_Records";
import Academic_Profile from "./side-bar-menu/Academic Profile/Academic_Profile";
import Settings from "./side-bar-menu/Settings/Settings";
import Manage_Graduate_Report from "./side-bar-menu/Manage Graduate Report/Manage_Graduate_Report";
import ManageEnrollmentReport from "./side-bar-menu/Manage Enrollment Report/Manage_Enrollment_Report";


const AcademeDashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="w-full flex justify-center">
            <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="w-full h-dvh overflow-y-auto">
                <Box mt="20px">

                    <Routes>
                        {/* Default Route */}
                        <Route path="/" element={<Navigate />} />

                        {/* Main Routes */}
                        <Route path="/academe/academic-profile" element={<Academic_Profile />} />
                        <Route path="/academe/school-records" element={<School_Records />} />
                        <Route path="/academe/settings" element={<Settings />} />
                        <Route path="/academe/manage-graduate-report" element={<Manage_Graduate_Report />} />
                        <Route path="/academe/manage-enrollment-report" element={<ManageEnrollmentReport />} />

                        {/* Catch-All Route */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>

                </Box>
            </div>
        </div>
    );
};

export default AcademeDashboard;
