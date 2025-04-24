import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Layout Component
import SideBar from "../components/layout/SideBar";
// Dashboard Components
import Dashboard from "./sidebar-menu-items/Dashboard/dashboard";
import Settings from "./sidebar-menu-items/Settings/Settings";
import ManageEmployer from "./sidebar-menu-items/Management/ManageEmployer/ManageEmployer";
import JobPosting from "./sidebar-menu-items/Management/JobPosting/JobPosting";
import TrainingPosting from "./sidebar-menu-items/Management/TrainingPosting/TrainingPosting";
import ScholarshipPosting from "./sidebar-menu-items/Management/ScholarshipPosting/ScholarshipPosting";
const EmployersDashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="w-full flex justify-center">
            <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div
                className="w-full h-dvh overflow-y-auto"
            >
                <Routes>
                    <Route path="/manage-employers" element={<ManageEmployer isCollapsed={isCollapsed} />} />
                    <Route path="/settings" element={<Settings isCollapsed={isCollapsed} />} />
                    <Route path="/home" element={<Dashboard isCollapsed={isCollapsed} />} />
                    <Route path="/" element={<Dashboard isCollapsed={isCollapsed} />} />
                    <Route path="/job-posting" element={<JobPosting isCollapsed={isCollapsed} />} />
                    <Route path="/training-posting" element={<TrainingPosting isCollapsed={isCollapsed} />} />
                    <Route path="/scholarship-posting" element={<ScholarshipPosting isCollapsed={isCollapsed} />} />
                </Routes>
            </div>
        </div>
    );
};

export default EmployersDashboard;
