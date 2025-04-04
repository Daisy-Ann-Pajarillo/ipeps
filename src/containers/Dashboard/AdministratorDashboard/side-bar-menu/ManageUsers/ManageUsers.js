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
    </div>
  );
};

export default ManageUsers;