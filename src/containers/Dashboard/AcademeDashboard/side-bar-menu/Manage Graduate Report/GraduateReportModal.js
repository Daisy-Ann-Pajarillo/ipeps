import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";

const GraduateReportModal = ({ open, onClose, onDataUpdate = () => {} }) => {
    const [formData, setFormData] = useState({
        degree: "",
        educationalLevel: "",
        fieldOfStudy: "",
        major: "",
        enrollees: "",
        graduates: "",
        startYear: "",
        endYear: ""
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        const isFormComplete = Object.values(formData).every((value) => value !== "");
        if (!isFormComplete) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        const isValidNumber = (value) => !isNaN(value) && value > 0;
        if (!isValidNumber(formData.enrollees) || !isValidNumber(formData.startYear) || !isValidNumber(formData.endYear)) {
            alert("Please enter valid numbers for enrollees, start year, and end year.");
            return;
        }

        if (!auth.token) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        const payload = {
            degree_or_qualification: formData.degree,
            education_level: formData.educationalLevel,
            field_of_study: formData.fieldOfStudy,
            major: formData.major,
            number_of_enrollees: parseInt(formData.enrollees, 10),
            start_year: parseInt(formData.startYear, 10),
            end_year: parseInt(formData.endYear, 10)
        };

        try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
            const response = await axios.post(`${API_BASE_URL}/api/add-enrollment-reports`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${auth.token}:`)}`,
                },
            });

            if (response.data.success) {
                onDataUpdate(payload);
                setFormData({
                    degree: "",
                    educationalLevel: "",
                    fieldOfStudy: "",
                    major: "",
                    enrollees: "",
                    graduates: "",
                    startYear: "",
                    endYear: "",
                });
                onClose();
            } else {
                alert(`Failed to add report: ${response.data.message}`);
            }
        } catch (error) {
            alert("Failed to add graduate report. Please try again.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Create Graduate Report</h2>
                <div className="space-y-3">
                    <select className="w-full p-2 border rounded" name="degree" value={formData.degree} onChange={handleChange}>
                        <option value="">Select Degree</option>
                        <option value="Bachelor of Science">Bachelor of Science</option>
                        <option value="Master of Science">Master of Science</option>
                        <option value="PhD">PhD</option>
                    </select>
                    <input type="text" name="educationalLevel" value={formData.educationalLevel} onChange={handleChange} placeholder="Educational Level" className="w-full p-2 border rounded" />
                    <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="Field of Study" className="w-full p-2 border rounded" />
                    <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Major" className="w-full p-2 border rounded" />
                    <input type="number" name="enrollees" value={formData.enrollees} onChange={handleChange} placeholder="Number of Enrollees" className="w-full p-2 border rounded" />
                    <input type="number" name="graduates" value={formData.graduates} onChange={handleChange} placeholder="Number of Graduates" className="w-full p-2 border rounded" />
                    <div className="flex space-x-2">
                        <input type="number" name="startYear" value={formData.startYear} onChange={handleChange} placeholder="Start Year" className="w-1/2 p-2 border rounded" />
                        <input type="number" name="endYear" value={formData.endYear} onChange={handleChange} placeholder="End Year" className="w-1/2 p-2 border rounded" />
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700" onClick={handleSubmit}>
                    Submit Graduate Report
                </button>
            </div>
        </div>
    );
};

export default GraduateReportModal;
