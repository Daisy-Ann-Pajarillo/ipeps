import React, { useState } from "react";
import ManageGraduateReport from "../Manage Graduate Report/Manage_Graduate_Report";
import ManageEnrollmentReport from "../Manage Enrollment Report/Manage_Enrollment_Report";

const SchoolRecords = () => {
    const [openGraduateModal, setOpenGraduateModal] = useState(false);
    const [openEnrollmentModal, setOpenEnrollmentModal] = useState(false);
    const [schoolData, setSchoolData] = useState([]);
    const [filter, setFilter] = useState("All");

    const handleOpenGraduateModal = () => setOpenGraduateModal(true);
    const handleCloseGraduateModal = () => setOpenGraduateModal(false);

    const handleOpenEnrollmentModal = () => setOpenEnrollmentModal(true);
    const handleCloseEnrollmentModal = () => setOpenEnrollmentModal(false);

    const handleGraduateDataUpdate = (data) => {
        setSchoolData((prevData) => [...prevData, { ...data, type: "Graduate" }]);
        handleCloseGraduateModal();
    };

    const handleEnrollmentDataUpdate = (data) => {
        setSchoolData((prevData) => [...prevData, { ...data, type: "Enrollment" }]);
        handleCloseEnrollmentModal();
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredData = schoolData.filter(
        (school) => filter === "All" || school.type === filter
    );

    return (
        <div className="p-5">
            {/* Buttons to open modals */}
            <div className="flex gap-4 mb-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={handleOpenGraduateModal}
                >
                    Manage Graduate Report
                </button>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    onClick={handleOpenEnrollmentModal}
                >
                    Manage Enrollment Report
                </button>
            </div>

            {/* Modals */}
            {openGraduateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-3/4 max-w-md">
                        <ManageGraduateReport onDataUpdate={handleGraduateDataUpdate} />
                        <button className="mt-4 text-red-500" onClick={handleCloseGraduateModal}>Close</button>
                    </div>
                </div>
            )}

            {openEnrollmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-3/4 max-w-md">
                        <ManageEnrollmentReport onDataUpdate={handleEnrollmentDataUpdate} />
                        <button className="mt-4 text-red-500" onClick={handleCloseEnrollmentModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="flex gap-3 mb-4">
                {["All", "Graduate", "Enrollment"].map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded-md transition ${filter === type ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
                        onClick={() => handleFilterChange(type)}
                    >
                        {type} Reports
                    </button>
                ))}
            </div>

            {/* Data Display */}
            <div className="grid grid-cols-1 gap-4">
                {filteredData.length > 0 ? (
                    filteredData.map((school, index) => (
                        <div key={index} className="bg-white shadow-md p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold">
                                {school.degree} in {school.major} ({school.educationalLevel})
                            </h3>
                            <p className="text-gray-600">Field of Study: {school.fieldOfStudy}</p>

                            {school.type === "Graduate" ? (
                                <div className="text-sm text-gray-700 mt-2">
                                    <p>Year: {school.year}</p>
                                    <p>Enrollees: {school.enrollees}</p>
                                    <p>Graduates: {school.graduates}</p>
                                    <p>Duration: {school.startYear} - {school.endYear}</p>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-700 mt-2">
                                    <p>Number of Enrollees: {school.enrollees}</p>
                                    <p>Start Year: {school.startYear}</p>
                                    <p>Years to Finish: {school.yearsToFinish}</p>
                                </div>
                            )}

                            <button
                                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={() => alert(`Viewing details for ${school.degree} in ${school.major}`)}
                            >
                                View
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No records found.</p>
                )}
            </div>
        </div>
    );
};

export default SchoolRecords;
