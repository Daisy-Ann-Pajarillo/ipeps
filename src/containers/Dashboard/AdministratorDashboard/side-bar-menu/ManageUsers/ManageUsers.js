import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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
      query === "" ||
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 flex flex-col space-y-3 relative overflow-hidden"
            >
              {/* Color indicator based on user type */}
              <div
                className={`absolute top-0 left-0 w-full h-1.5 
              ${user.user_type === "employer" ? "bg-blue-500" : ""} 
              ${user.user_type === "student" ? "bg-green-500" : ""} 
              ${user.user_type === "jobseeker" ? "bg-purple-500" : ""} 
              ${user.user_type === "academe" ? "bg-yellow-500" : ""}`}
              />

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {user.username}
                  </h2>

                  {/* Improved user type display */}
                  <div className="flex items-center mt-1">
                    <div
                      className={`w-3 h-3 rounded-full mr-2
                  ${
                    user.user_type.toLowerCase() === "employer"
                      ? "bg-blue-500"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "student"
                      ? "bg-green-500"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "jobseeker"
                      ? "bg-purple-500"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "academe"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                    />
                    <span
                      className={`text-sm font-medium
                  ${
                    user.user_type.toLowerCase() === "employer"
                      ? "text-blue-700 dark:text-blue-300"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "student"
                      ? "text-green-700 dark:text-green-300"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "jobseeker"
                      ? "text-purple-700 dark:text-purple-300"
                      : ""
                  } 
                  ${
                    user.user_type.toLowerCase() === "academe"
                      ? "text-yellow-700 dark:text-yellow-300"
                      : ""
                  }`}
                    >
                      {user.user_type.charAt(0).toUpperCase() +
                        user.user_type.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full 
                ${user.access_level >= 2 ? "bg-red-500" : "bg-gray-400"}`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {user.access_level >= 2 ? "Admin" : "User"}
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <div className="flex items-center text-sm mb-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    Created {user.created_at}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
