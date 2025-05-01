import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableContainer,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility, Refresh, FilterList } from "@mui/icons-material";
import EditUserModal from "./Edit_Users_Modal";
import SearchData from "../../../components/layout/Search";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for file input
  const [excelUploading, setExcelUploading] = useState(false);

  const handleOpenModal = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
    setActiveStep(0);
  };

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    axios
      .get("/api/all-users", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [auth.token]);

  useEffect(() => {
    if (auth.token) {
      fetchUsers();
    }
  }, [auth.token, fetchUsers]);

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setActiveStep((prevStep) => prevStep + 1);
  }, []);

  const handleSave = useCallback((updatedData) => {
    console.log("Updated User Data:", updatedData);
    // Dispatch an action or make an API call to save changes
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === selectedUserId ? { ...user, ...updatedData } : user
      )
    );
    handleCloseModal();
  }, [selectedUserId]);

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      query === "" ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.user_type.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      status === "" || user.status.toLowerCase() === status.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const getUserTypeColor = (userType) => {
    const type = userType.toLowerCase();
    if (type === "employer") return "bg-blue-500";
    if (type === "student") return "bg-green-500";
    if (type === "jobseeker") return "bg-purple-500";
    if (type === "academe") return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Active":
        return {
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          color: "rgb(22, 163, 74)",
          borderColor: "rgb(22, 163, 74)"
        };
      case "Inactive":
        return {
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          color: "rgb(220, 38, 38)",
          borderColor: "rgb(220, 38, 38)"
        };
      case "Hibernate":
        return {
          backgroundColor: "rgba(234, 88, 12, 0.1)",
          color: "rgb(234, 88, 12)",
          borderColor: "rgb(234, 88, 12)"
        };
      default:
        return {
          backgroundColor: "rgba(107, 114, 128, 0.1)",
          color: "rgb(107, 114, 128)",
          borderColor: "rgb(107, 114, 128)"
        };
    }
  };

  // Handler for Excel file upload
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setExcelUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Detect type by headers
        const headers = jsonData[0].map(h => String(h).trim());
        const rows = jsonData.slice(1).filter(row => row.length > 0);

        // Helper to map rows to objects
        const mapRows = (headers, rows) =>
          rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])));

        let endpoint = null;
        let dataRows = mapRows(headers, rows);

        // User creation
        if (
          headers.length === 4 &&
          headers[0].toLowerCase() === "username" &&
          headers[1].toLowerCase() === "email" &&
          headers[2].toLowerCase() === "password" &&
          headers[3].toLowerCase() === "user_type"
        ) {
          endpoint = "/api/create-user";
          dataRows = dataRows.map(row => ({
            username: String(row.username || "").trim(),
            email: String(row.email || "").trim(),
            password: String(row.password || "").trim(),
            user_type: String(row.user_type || "").trim().toUpperCase()
          }));
        }
        // Personal Information
        else if (
          headers.includes("personal_info_id") &&
          headers.includes("user_id") &&
          headers.includes("first_name")
        ) {
          endpoint = "/api/add-jobseeker-student-personal-information";
        }
        // Job Preference
        else if (
          headers.includes("job_preference_id") &&
          headers.includes("user_id") &&
          headers.includes("country")
        ) {
          endpoint = "/api/add-jobseeker-student-job-preference";
        }
        // Language Proficiency
        else if (
          headers.includes("language_proficiency_id") &&
          headers.includes("user_id") &&
          headers.includes("language")
        ) {
          endpoint = "/api/add-jobseeker-student-language-proficiency";
        }
        // Educational Background
        else if (
          headers.includes("educational_background_id") &&
          headers.includes("user_id") &&
          headers.includes("school_name")
        ) {
          endpoint = "/api/add-jobseeker-student-educational-background";
        }
        // Professional License
        else if (
          headers.includes("professional_license_id") &&
          headers.includes("user_id") &&
          headers.includes("license")
        ) {
          endpoint = "/api/add-jobseeker-student-professional-license";
        }
        // Work Experience
        else if (
          headers.includes("work_experience_id") &&
          headers.includes("user_id") &&
          headers.includes("company_name")
        ) {
          endpoint = "/api/add-jobseeker-student-work-experience";
          // Group work experiences by user_id
          const groupedData = {};
          dataRows.forEach(row => {
            const userId = row.user_id;
            if (!groupedData[userId]) {
              groupedData[userId] = [];
            }
            groupedData[userId].push({
              work_experience_id: row.work_experience_id,
              company_name: row.company_name,
              company_address: row.company_address,
              position: row.position,
              employment_status: row.employment_status,
              date_start: row.date_start,
              date_end: row.date_end
            });
          });

          // Convert grouped data into an array of objects with user_id and work_experiences
          dataRows = Object.keys(groupedData).map(userId => ({
            user_id: userId,
            work_experiences: groupedData[userId]
          }));
        }
        // Other Skills
        else if (
          headers.includes("other_skills_id") &&
          headers.includes("user_id") &&
          headers.includes("skills")
        ) {
          endpoint = "/api/add-jobseeker-student-other-skills";
        }
        // Other Training
        else if (
          headers.includes("other_training_id") &&
          headers.includes("user_id") &&
          headers.includes("course_name")
        ) {
          endpoint = "/api/add-jobseeker-student-other-training";
        }

        if (!endpoint) {
          toast.error("Unrecognized Excel format. Please check your headers.");
          setExcelUploading(false);
          return;
        }

        // For each row, send a POST request to the endpoint
        let successCount = 0;
        let failCount = 0;
        let errorMessages = [];
        for (const [idx, row] of dataRows.entries()) {
          try {
            console.log(`Sending to ${endpoint} (row ${idx + 2}):`, row);
            await axios.post(endpoint, row, {
              headers: { "Content-Type": "application/json" },
              auth: { username: auth.token }
            });
            successCount++;
          } catch (err) {
            failCount++;
            const msg = err?.response?.data?.error || err.message || "Unknown error";
            console.error(`Failed for row ${idx + 2}:`, row, msg);
            errorMessages.push(`Row ${idx + 2}: ${msg}`);
          }
        }

        if (failCount > 0) {
          toast.error(`Upload finished: ${successCount} succeeded, ${failCount} failed.\n${errorMessages.join('\n')}`, { autoClose: 8000 });
        } else {
          toast.success(`Upload finished: ${successCount} succeeded, ${failCount} failed.`);
        }
      } catch (err) {
        toast.error("Upload failed: " + (err?.response?.data?.error || err.message));
      } finally {
        setExcelUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Typography variant="h4" className="text-gray-800 font-semibold">
              Manage Users
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              View and manage all user accounts
            </Typography>
          </div>

          <Tooltip title="Refresh Users">
            <IconButton
              onClick={fetchUsers}
              className="bg-white shadow-sm hover:bg-gray-50 mt-2 md:mt-0"
              disabled={isLoading}
            >
              <Refresh className={isLoading ? "animate-spin text-blue-400" : "text-blue-600"} />
            </IconButton>
          </Tooltip>
        </div>

        {/* Upload Excel Button */}
        <div className="flex items-center mb-4">
          <input
            accept=".xlsx,.xls"
            id="excel-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleExcelUpload}
          />
          <label htmlFor="excel-upload">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              disabled={excelUploading}
              sx={{ mr: 2 }}
            >
              Upload Excel
            </Button>
          </label>
          {excelUploading && (
            <Typography variant="body2" color="text.secondary">
              Uploading...
            </Typography>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-grow">
              <SearchData
                placeholder="Search users by name or type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
                componentData={[
                  { title: "Status", options: ["", "Active", "Inactive", "Hibernate"] },
                ]}
                onComponentChange={(index, value) => {
                  if (index === 0) setStatus(value);
                }}
              />
            </div>
            <div className="flex items-center">
              <FilterList className="text-gray-500 mr-2" />
              <div className="flex gap-2">
                <Chip
                  label="All"
                  onClick={() => setStatus("")}
                  variant={status === "" ? "filled" : "outlined"}
                  color={status === "" ? "primary" : "default"}
                  size="small"
                  className="cursor-pointer"
                />
                <Chip
                  label="Active"
                  onClick={() => setStatus("Active")}
                  variant={status === "Active" ? "filled" : "outlined"}
                  color={status === "Active" ? "success" : "default"}
                  size="small"
                  className="cursor-pointer"
                />
                <Chip
                  label="Inactive"
                  onClick={() => setStatus("Inactive")}
                  variant={status === "Inactive" ? "filled" : "outlined"}
                  color={status === "Inactive" ? "error" : "default"}
                  size="small"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <TableContainer component={Paper} className="rounded-xl border-0 shadow-none">
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="font-semibold text-gray-700">Username</TableCell>
                  <TableCell className="font-semibold text-gray-700">User Type</TableCell>
                  <TableCell className="font-semibold text-gray-700">Email</TableCell>
                  <TableCell className="font-semibold text-gray-700">Status</TableCell>
                  <TableCell className="font-semibold text-gray-700">Access Level</TableCell>
                  <TableCell className="font-semibold text-gray-700">Created At</TableCell>
                  <TableCell className="font-semibold text-gray-700">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array(7).fill(0).map((_, cellIndex) => (
                        <TableCell key={`cell-${index}-${cellIndex}`}>
                          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.user_id}
                      hover
                      className="hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${getUserTypeColor(user.user_type)}`}
                          />
                          <span className="text-gray-700">
                            {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={getStatusStyles(user.status)}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.access_level >= 2 ? "Admin" : "User"}
                          size="small"
                          color={user.access_level >= 2 ? "secondary" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Visibility />}
                          onClick={() => handleOpenModal(user.user_id)}
                          size="small"
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                          sx={{
                            borderRadius: "0.375rem",
                            textTransform: "none",
                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" className="py-8">
                      <div className="flex flex-col items-center">
                        <Box className="bg-gray-100 rounded-full p-3 mb-3">
                          <FilterList className="text-gray-400" fontSize="large" />
                        </Box>
                        <Typography variant="h6" className="text-gray-600 font-medium">
                          No users found
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                          Try adjusting your search or filter to find what you're looking for.
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination could be added here */}
          {filteredUsers.length > 0 && (
            <div className="py-3 px-4 flex justify-between items-center border-t border-gray-200">
              <Typography variant="body2" className="text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </Typography>
              {/* Pagination controls would go here */}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing User */}
      {isModalOpen && (
        <EditUserModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          userId={selectedUserId}
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          handleSave={handleSave}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageUsers;