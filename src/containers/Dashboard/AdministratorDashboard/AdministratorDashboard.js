import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SideBar from "../components/layout/SideBar";
// Import Admin Pages
import Dashboard from "./side-bar-menu/Dashboard/Dashboard";
import AccountSettings from "./side-bar-menu/AccountSettings/AccountSettings";
import ManageUsers from "./side-bar-menu/ManageUsers/ManageUsers";
import ScholarshipsPostings from "./side-bar-menu/ScholarshipsPostings/ScholarshipsPostings";
import TrainingPostings from "./side-bar-menu/TrainingPostings/TrainingPostings";
import JobPostings from "./side-bar-menu/JobPostings/JobPostings";

import JobApplications from "./side-bar-menu/JobApplications/JobApplications";
import ScholarshipApplications from "./side-bar-menu/ScholarshipApplications/ScholarshipApplications";
import TrainingApplications from "./side-bar-menu/TrainingApplications/TrainingApplications";

import PlacementReports from "./side-bar-menu/PlacementReports/PlacementReports";
import Employers from "./side-bar-menu/Employer/Employer";
import Settings from "./side-bar-menu/Settings/Settings";

// Import for nested pages
import JobSeeker from "./side-bar-menu/Dashboard/components/JobSeeker";
import Trend from "./side-bar-menu/Dashboard/components/Trend";
import Placement from "./side-bar-menu/Dashboard/components/Placement";
import JobPreference from "./side-bar-menu/Dashboard/components/Job_Preference";

const AdministratorDashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="w-full flex justify-center">
            <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="w-full h-dvh overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/account-settings" element={<AccountSettings />} />
                    <Route path="/manage-users" element={<ManageUsers />} />

                    <Route path="/job-postings" element={<JobPostings />} />
                    <Route path="/scholarships-postings" element={<ScholarshipsPostings />} />
                    <Route path="/training-postings" element={<TrainingPostings />} />

                    <Route path="/job-applications" element={<JobApplications />} />
                    <Route path="/scholarship-applications" element={<ScholarshipApplications />} />
                    <Route path="/training-applications" element={<TrainingApplications />} />


                    <Route path="/placement-reports" element={<PlacementReports />} />
                    <Route path="/employer" element={<Employers />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Nested Routes */}
                    <Route path="/jobseeker" element={<JobSeeker />} />
                    <Route path="/trends" element={<Trend />} />
                    <Route path="/placement" element={<Placement />} />
                    <Route path="/job-preference" element={<JobPreference />} />

                    {/* Catch-all route */}

                </Routes>
            </div>
        </div>
    );
};

export default AdministratorDashboard;
