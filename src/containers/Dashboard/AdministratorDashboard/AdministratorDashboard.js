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
import JobPostingApplicant from "./side-bar-menu/JobPostingApplicants/JobPostingApplicants";
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
                    <Route path="/admin/account-settings" element={<AccountSettings />} />
                    <Route path="/admin/manage-users" element={<ManageUsers />} />
                    <Route path="/admin/scholarships-postings" element={<ScholarshipsPostings />} />
                    <Route path="/admin/training-postings" element={<TrainingPostings />} />
                    <Route path="/admin/job-postings" element={<JobPostings />} />
                    <Route path="/admin/job-posting-applicants" element={<JobPostingApplicant />} />
                    <Route path="/admin/placement-reports" element={<PlacementReports />} />
                    <Route path="/admin/employer" element={<Employers />} />
                    <Route path="/admin/settings" element={<Settings />} />

                    {/* Nested Routes */}
                    <Route path="/admin/jobseeker" element={<JobSeeker />} />
                    <Route path="/admin/trends" element={<Trend />} />
                    <Route path="/admin/placement" element={<Placement />} />
                    <Route path="/admin/job-preference" element={<JobPreference />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdministratorDashboard;
