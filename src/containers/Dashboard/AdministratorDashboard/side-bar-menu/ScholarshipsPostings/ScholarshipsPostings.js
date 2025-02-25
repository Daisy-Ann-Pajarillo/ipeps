import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchData from "../../../components/layout/Search";


const Scholarships_Postings = () => {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");

  const [scholarships, setScholarships] = useState([
    { id: 1, title: "Global Scholarship Program", organization: "Rakuten", status: "Finished for Approval", description: "Financial support for students worldwide with academic excellence and financial need." },
    { id: 2, title: "Merit-Based Scholarship", organization: "XYZ Foundation", status: "Approved", description: "Awarded to students with exceptional merit in academics and extracurricular activities." },
    { id: 3, title: "Need-Based Financial Aid", organization: "ABC Org", status: "Rejected", description: "Providing financial aid to underprivileged students globally." },
  ]);

  const openModal = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedScholarship(null);
    setAdminRemark("");
    setModalOpen(false);
  };

  const updateStatus = (id, newStatus) => {
    setScholarships((prev) =>
      prev.map((scholarship) =>
        scholarship.id === id ? { ...scholarship, status: newStatus } : scholarship
      )
    );
    closeModal();
  };

  // **Filter Scholarships Based on Search Query & Dropdown Selections**
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesQuery =
      query === "" ||
      scholarship.title.toLowerCase().includes(query.toLowerCase()) ||
      scholarship.organization.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "" || scholarship.status.toLowerCase() === status.toLowerCase();
    const matchesCompany = company === "" || scholarship.organization.toLowerCase() === company.toLowerCase();

    return matchesQuery && matchesStatus && matchesCompany;
  });

  return (
    <Box >
      {/* Search & Filter Component */}
      <SearchData
        placeholder="Search scholarships..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        componentData={[
          {
            title: "Company",
            options: ["", ...new Set(scholarships.map((scholarship) => scholarship.organization))],
          },
          {
            title: "Status",
            options: ["", "Finished for Approval", "Approved", "Rejected", "Expired Scholarship Post", "Edit Request for Approval"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCompany(value);
          if (index === 1) setStatus(value);
        }}
      />

      {/* Scholarship Cards */}
      <Grid container display="flex" flexDirection="column" gap={3} p={2}>
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <Grid item xs={12} sm={6} md={4} key={scholarship.id}>
              <Card
                onClick={() => openModal(scholarship)}
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
              >
                <CardContent>
                  <Typography variant="h6">{scholarship.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {scholarship.organization}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Status: {scholarship.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography textAlign="center" width="100%">No scholarships found.</Typography>
        )}
      </Grid>

      {/* Modal for Detailed Scholarship Information */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedScholarship?.title}
          <IconButton onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedScholarship?.description}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Organization: {selectedScholarship?.organization}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Status: {selectedScholarship?.status}
          </Typography>
          <TextField
            fullWidth
            label="Admin Remark"
            multiline
            rows={3}
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" color="success" onClick={() => updateStatus(selectedScholarship.id, "Approved")}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={() => updateStatus(selectedScholarship.id, "Rejected")}>
              Reject
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box >
  );
};

export default Scholarships_Postings;
