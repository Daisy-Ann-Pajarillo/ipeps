import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const fetchScholarship = () => {
    axios
      .get("/api/all-users", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  };

  useEffect(() => {
    if (auth.token) {
      fetchScholarship();
    }
  }, [auth.token]);

  // **Filter Users Based on Search Query & Status**
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      query === "" ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.user_type.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      status === "" || user.status.toLowerCase() === status.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "red";
      case "Hibernate":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* SearchData Component */}
      <SearchData
        placeholder="Search user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-4"
        componentData={[
          { title: "Status", options: ["", "Active", "Inactive", "Hibernate"] },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setStatus(value);
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Access Level</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${user.user_type.toLowerCase() === "employer"
                          ? "bg-blue-500"
                          : user.user_type.toLowerCase() === "student"
                            ? "bg-green-500"
                            : user.user_type.toLowerCase() === "jobseeker"
                              ? "bg-purple-500"
                              : user.user_type.toLowerCase() === "academe"
                                ? "bg-yellow-500"
                                : ""
                          }`}
                      />
                      {user.user_type.charAt(0).toUpperCase() +
                        user.user_type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color: getStatusColor(user.status),
                      }}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.access_level >= 2 ? "Admin" : "User"}
                  </TableCell>
                  <TableCell>{user.created_at}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Editing User */}
      {isModalOpen && (
        <EditUserModal
          open={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;