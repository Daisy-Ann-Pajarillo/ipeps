
import React, { useState } from "react";
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

const ManageUsers = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const users = [
    {
      userId: "U001",
      username: "john_doe",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "John",
      lastName: "Doe",
      sex: "Male",
      nationality: "American",
      email: "john.doe@example.com",
      status: "Active", // Status field
      userImgFileUrl: "https://example.com/john_doe.jpg",
    },
    {
      userId: "U002",
      username: "jane_doe",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Jane",
      lastName: "Doe",
      sex: "Female",
      nationality: "Canadian",
      email: "jane.doe@example.com",
      status: "Inactive", // Status field
      userImgFileUrl: "https://example.com/jane_doe.jpg",
    },
    {
      userId: "U003",
      username: "bob_smith",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Bob",
      lastName: "Smith",
      sex: "Male",
      nationality: "British",
      email: "bob.smith@example.com",
      status: "Hibernate", // Status field
      userImgFileUrl: "https://example.com/bob_smith.jpg",
    },
    {
      userId: "U004",
      username: "susan_martin",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Susan",
      lastName: "Martin",
      sex: "Female",
      nationality: "Australian",
      email: "susan.martin@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/susan_martin.jpg",
    },
    {
      userId: "U005",
      username: "mark_taylor",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Mark",
      lastName: "Taylor",
      sex: "Male",
      nationality: "American",
      email: "mark.taylor@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/mark_taylor.jpg",
    },
    {
      userId: "U006",
      username: "alice_wilson",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Alice",
      lastName: "Wilson",
      sex: "Female",
      nationality: "Canadian",
      email: "alice.wilson@example.com",
      status: "Hibernate",
      userImgFileUrl: "https://example.com/alice_wilson.jpg",
    },
    {
      userId: "U007",
      username: "jack_jones",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Jack",
      lastName: "Jones",
      sex: "Male",
      nationality: "American",
      email: "jack.jones@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/jack_jones.jpg",
    },
    {
      userId: "U008",
      username: "laura_clark",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Laura",
      lastName: "Clark",
      sex: "Female",
      nationality: "Canadian",
      email: "laura.clark@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/laura_clark.jpg",
    },
    {
      userId: "U009",
      username: "charlie_davis",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Charlie",
      lastName: "Davis",
      sex: "Male",
      nationality: "British",
      email: "charlie.davis@example.com",
      status: "Hibernate",
      userImgFileUrl: "https://example.com/charlie_davis.jpg",
    },
    {
      userId: "U010",
      username: "emily_white",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Emily",
      lastName: "White",
      sex: "Female",
      nationality: "American",
      email: "emily.white@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/emily_white.jpg",
    },
    {
      userId: "U011",
      username: "henry_harris",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Henry",
      lastName: "Harris",
      sex: "Male",
      nationality: "Australian",
      email: "henry.harris@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/henry_harris.jpg",
    },
    {
      userId: "U012",
      username: "lily_martinez",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Lily",
      lastName: "Martinez",
      sex: "Female",
      nationality: "Canadian",
      email: "lily.martinez@example.com",
      status: "Hibernate",
      userImgFileUrl: "https://example.com/lily_martinez.jpg",
    },
    {
      userId: "U013",
      username: "paul_smith",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Paul",
      lastName: "Smith",
      sex: "Male",
      nationality: "American",
      email: "paul.smith@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/paul_smith.jpg",
    },
    {
      userId: "U014",
      username: "olivia_king",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Olivia",
      lastName: "King",
      sex: "Female",
      nationality: "Canadian",
      email: "olivia.king@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/olivia_king.jpg",
    },
    {
      userId: "U015",
      username: "george_williams",
      userType: "User",
      accessLevel: "Limited",
      firstName: "George",
      lastName: "Williams",
      sex: "Male",
      nationality: "British",
      email: "george.williams@example.com",
      status: "Hibernate",
      userImgFileUrl: "https://example.com/george_williams.jpg",
    },
    {
      userId: "U016",
      username: "isabella_moore",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Isabella",
      lastName: "Moore",
      sex: "Female",
      nationality: "American",
      email: "isabella.moore@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/isabella_moore.jpg",
    },
    {
      userId: "U017",
      username: "michael_johnson",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Michael",
      lastName: "Johnson",
      sex: "Male",
      nationality: "Canadian",
      email: "michael.johnson@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/michael_johnson.jpg",
    },
    {
      userId: "U018",
      username: "sophia_brown",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Sophia",
      lastName: "Brown",
      sex: "Female",
      nationality: "American",
      email: "sophia.brown@example.com",
      status: "Hibernate",
      userImgFileUrl: "https://example.com/sophia_brown.jpg",
    },
    {
      userId: "U019",
      username: "benjamin_lee",
      userType: "Admin",
      accessLevel: "Full",
      firstName: "Benjamin",
      lastName: "Lee",
      sex: "Male",
      nationality: "Australian",
      email: "benjamin.lee@example.com",
      status: "Active",
      userImgFileUrl: "https://example.com/benjamin_lee.jpg",
    },
    {
      userId: "U020",
      username: "emma_garcia",
      userType: "User",
      accessLevel: "Limited",
      firstName: "Emma",
      lastName: "Garcia",
      sex: "Female",
      nationality: "British",
      email: "emma.garcia@example.com",
      status: "Inactive",
      userImgFileUrl: "https://example.com/emma_garcia.jpg",
    },
  ];

  // **Filter Users Based on Search Query & Status**
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      query === "" ||
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "" || user.status.toLowerCase() === status.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "green";
      case "Inactive": return "red";
      case "Hibernate": return "orange";
      default: return "gray";
    }
  };

  return (
    <Box>
      {/* SearchData Component */}
      <SearchData
        placeholder="Search user..."
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

      <Grid container spacing={2} className="p-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.userId} onClick={() => handleOpenModal(user)}>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
                  <Avatar
                    src={user.userImgFileUrl || "/default-avatar.png"}
                    alt={user.firstName}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box textAlign="center" sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: getStatusColor(user.status) }}>
                      {user.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography textAlign="center" width="100%" variant="body1" color="textSecondary">
              No users found.
            </Typography>
          </Grid>
        )}
      </Grid>


      {/* Edit User Modal */}
      <EditUserModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} selectedUser={selectedUser} />
    </Box>
  );
};

export default ManageUsers;
