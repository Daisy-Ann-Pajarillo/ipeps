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
const Training_Postings = () => {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");

  const [trainings, setTrainings] = useState([
    { id: 1, title: "Java Full Stack Training", organization: "Rakuten", status: "Finished for Approval", description: ["Comprehensive full-stack development training", "Covers Java, Spring Boot, and React"] },
    { id: 2, title: "Data Science Bootcamp", organization: "XYZ Foundation", status: "Approved", description: ["Python-based data science training", "Includes hands-on machine learning projects"] },
    { id: 3, title: "Cloud Computing Essentials", organization: "ABC Org", status: "Rejected", description: ["AWS and Azure cloud fundamentals", "Focus on DevOps and cloud security"] },
  ]);

  const openModal = (training) => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTraining(null);
    setAdminRemark("");
    setModalOpen(false);
  };

  const updateStatus = (id, newStatus) => {
    setTrainings((prev) =>
      prev.map((training) =>
        training.id === id ? { ...training, status: newStatus } : training
      )
    );
    closeModal();
  };

  // **Filter Trainings Based on Search Query & Dropdown Selections**
  const filteredTrainings = trainings.filter((training) => {
    const matchesQuery =
      query === "" ||
      training.title.toLowerCase().includes(query.toLowerCase()) ||
      training.organization.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "" || training.status.toLowerCase() === status.toLowerCase();
    const matchesCompany = company === "" || training.organization.toLowerCase() === company.toLowerCase();

    return matchesQuery && matchesStatus && matchesCompany;
  });

  return (
    <Box >
      {/* Search & Filter Component */}
      <SearchData
        placeholder="Search trainings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        componentData={[
          {
            title: "Company",
            options: ["", ...new Set(trainings.map((training) => training.organization))],
          },
          {
            title: "Status",
            options: ["", "Finished for Approval", "Approved", "Rejected", "Expired Training Post", "Edit Request for Approval"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCompany(value);
          if (index === 1) setStatus(value);
        }}
      />

      {/* Training Cards */}
      <Grid container spacing={3} display="flex" flexDirection="column" gap={3} p={2}>
        {filteredTrainings.length > 0 ? (
          filteredTrainings.map((training) => (
            <Grid item xs={12} sm={6} md={4} key={training.id}>
              <Card
                onClick={() => openModal(training)}
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
              >
                <CardContent>
                  <Typography variant="h6">{training.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {training.organization}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Status: {training.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography textAlign="center" width="100%">No trainings found.</Typography>
        )}
      </Grid>

      {/* Modal for Detailed Training Information */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTraining?.title}
          <IconButton onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ul>
            {selectedTraining?.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
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
            <Button variant="contained" color="success" onClick={() => updateStatus(selectedTraining.id, "Approved")}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={() => updateStatus(selectedTraining.id, "Rejected")}>
              Reject
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Training_Postings;
