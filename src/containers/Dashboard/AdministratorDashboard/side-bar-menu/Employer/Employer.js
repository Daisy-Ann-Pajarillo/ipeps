import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchData from "../../../components/layout/Search";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from '../../../../../axios';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";

// Helper function to determine status color
const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "success";
    case "Rejected":
      return "error";
    case "Pending Review":
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

// Document status icon component
const DocumentStatusIcon = ({ isAvailable }) => (
  isAvailable ? (
    <VerifiedIcon fontSize="small" color="success" />
  ) : (
    <CancelIcon fontSize="small" color="error" />
  )
);

// Function to handle document download
const handleDownload = (filename) => {
  alert(`Downloading ${filename}`);
};

const Employer = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [companiesData, setCompaniesData] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching company data...');
        const response = await axios.get("/api/get-all-company-information", {
          auth: { username: auth.token }
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch company data");
        }

        const data = response.data;
        console.log('Received company data:', data);

        // Ensure company_information is treated as an array
        if (data.company_information && Array.isArray(data.company_information)) {
          console.log(`Number of companies retrieved: ${data.company_information.length}`);
          setCompaniesData(data.company_information);
        } else {
          console.warn('No company information found in the response.');
          setCompaniesData([]); // Set to empty array if no data is available
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setNotification({
          open: true,
          message: "Failed to load company data",
          severity: "error"
        });
      }
    };

    fetchData();
  }, [auth.token]);

  const handleView = (company) => {
    setSelectedCompany(company); // Set the selected company's data
    setAdminRemarks(company.admin_remarks || ""); // Optionally set admin remarks
    setActiveTab("info"); // Switch to the "info" tab
  };
  // Handle closing the modal
  const handleClose = () => setSelectedCompany(null);

  const handleApprove = async () => {
    try {
      if (!selectedCompany) {
        throw new Error("No company selected");
      }

      const companyId = selectedCompany.employer_companyinfo_id; // Retrieve employer_companyinfo_id
      console.log(`Approving company with ID: ${companyId}`);

      // Prepare the payload
      const payload = {
        admin_remarks: adminRemarks || "No remarks provided",
        company_id: companyId, // Use employer_companyinfo_id as company_id
        status: "approved"
      };

      console.log("Sending approval payload:", payload);

      // Make the API call
      const response = await axios.put(
        "/api/approve-company-information",
        payload,
        {
          auth: { username: auth.token }
        }
      );

      if (response.status === 200) {
        console.log("Company approved successfully");

        // Update the local state to reflect the approval
        setCompaniesData((prevData) =>
          prevData.map((company) =>
            company.employer_companyinfo_id === companyId
              ? { ...company, status: "approved" }
              : company
          )
        );

        // Show success notification
        setNotification({
          open: true,
          message: "Company approved successfully",
          severity: "success"
        });
      } else {
        throw new Error("Failed to approve company");
      }
    } catch (error) {
      console.error("Error approving company:", error);

      // Show error notification
      setNotification({
        open: true,
        message: "Failed to approve company. Please try again later.",
        severity: "error"
      });
    }
  };

  const handleReject = async () => {
    try {
      if (!selectedCompany) {
        throw new Error("No company selected");
      }

      const companyId = selectedCompany.employer_companyinfo_id; // Retrieve employer_companyinfo_id
      console.log(`Rejecting company with ID: ${companyId}`);

      // Prepare the payload
      const payload = {
        admin_remarks: adminRemarks || "No remarks provided",
        company_id: companyId, // Use employer_companyinfo_id as company_id
        status: "reject"
      };

      console.log("Sending rejection payload:", payload);

      // Make the API call
      const response = await axios.put("/api/approve-company-information",
        payload,
        {
          auth: { username: auth.token }
        }
      );

      if (response.status === 200) {
        console.log("Company rejected successfully");

        // Update the local state to reflect the rejection
        setCompaniesData((prevData) =>
          prevData.map((company) =>
            company.employer_companyinfo_id === companyId
              ? { ...company, status: "rejected" }
              : company
          )
        );

        // Show success notification
        setNotification({
          open: true,
          message: `${selectedCompany.company_name} has been rejected`,
          severity: "error"
        });
      } else {
        throw new Error("Failed to reject company");
      }
    } catch (error) {
      console.error("Error rejecting company:", error);

      // Show error notification
      setNotification({
        open: true,
        message: "Failed to reject company. Please try again later.",
        severity: "error"
      });
    }
  };
  // Handle closing the notification snackbar
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Get unique categories for filtering
  const categories = ["", ...new Set(companiesData.map((company) => company.company_industry || ""))];

  // Get unique statuses for filtering
  const statuses = ["", ...new Set(companiesData.map((company) => company.status || ""))];

  // Filter companies based on search and filters
  // Filter companies based on search and filters
  const filteredCompanies = companiesData.filter(
    (company) =>
      (!search || (company.company_name || "").toLowerCase().includes(search.toLowerCase())) &&
      (!category || company.company_industry === category) &&
      (!status || company.status === status)
  );

  // Reusable TextField component for displaying company info
  const ReadOnlyTextField = ({ label, value }) => (
    <TextField
      label={label}
      value={value || "Not provided"}
      fullWidth
      variant="outlined"
      InputProps={{ readOnly: true }}
      margin="dense"
      size="small"
    />
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Company Management
      </Typography>

      {/* Search & Filter Section */}
      <Card sx={{ mb: 4, p: 2, boxShadow: 2 }}>
        <SearchData
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
          componentData={[
            { title: "Category", options: categories },
            { title: "Status", options: statuses }
          ]}
          onComponentChange={(index, value) => {
            if (index === 0) setCategory(value);
            if (index === 1) setStatus(value);
          }}
        />
      </Card>

      {/* Loading Indicator or No Results Message */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredCompanies.length === 0 ? (
        <Typography variant="h6" color="textSecondary" textAlign="center" mt={4}>
          No results found
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="flex-start" mt={1}>
          {filteredCompanies.map((company) => (
            <Grid item key={company.id} xs={12} sm={6} md={4} xl={3}>
              <Card
                sx={{
                  height: "auto",
                  minHeight: 380,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 3,
                  position: "relative",
                  overflow: "visible", // Allow content to overflow for the button
                  pb: 8, // Add padding at bottom for button
                  mb: 2, // Add margin at bottom
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={company.logo_image_path || "/placeholder.png"}
                    alt={company.company_name || "Company Logo"}
                    sx={{
                      height: 160,
                      objectFit: "contain",
                      p: 2,
                      backgroundColor: "#f5f5f5"
                    }}
                  />
                  {/* Status chip styled like the example image */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: company.status?.toLowerCase() === "pending" ? "#ff7800" :
                        company.status?.toLowerCase() === "active" ? "green" : "gray",
                      color: "white",
                      borderRadius: "16px",
                      px: 2,
                      py: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: "bold"
                    }}
                  >
                    {company.status || "Unknown"}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, px: 3, pb: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {company.company_name || "Unnamed Company"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {company.company_industry || "Unknown Industry"} •{" "}
                    {company.created_at?.split("T")[0] || "Unknown Date"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {company.company_description?.substring(0, 120) ||
                      "No description available."}
                    {company.company_description?.length > 120 ? "..." : ""}
                  </Typography>

                  {/* Admin Note styled like the example image */}
                  {company.admin_remarks && (
                    <Box sx={{
                      mt: 2,
                      p: 1.5,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0"
                    }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="bold">
                        Admin Note:
                      </Typography>
                      <Typography variant="body2">
                        {company.admin_remarks.substring(0, 40)}
                        {company.admin_remarks.length > 40 ? "..." : ""}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {/* View Details Button - FIXED WITH ABSOLUTE POSITIONING */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    bgcolor: "white",
                    borderTop: "1px solid #e0e0e0",
                    textAlign: "right",
                    zIndex: 10, // Ensure it's above other elements
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleView(company)}
                    startIcon={<InfoIcon />}
                    size="small"
                    sx={{
                      backgroundColor: "#1976d2", // Ensure button has proper color
                      '&:hover': {
                        backgroundColor: "#1565c0",
                      },
                      boxShadow: 2,
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Company Details Modal */}
      <Dialog
        open={Boolean(selectedCompany)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        {selectedCompany && (
          <>
            {/* Modal Title */}
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                pb: 2
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  src={selectedCompany.logo_image_path || "/placeholder.png"}
                  alt={selectedCompany.company_name || "Company Logo"}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6">{selectedCompany.company_name || "Unnamed Company"}</Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: selectedCompany.status?.toLowerCase() === "pending" ? "#ff7800" :
                    selectedCompany.status?.toLowerCase() === "active" ? "green" : "gray",
                  color: "white",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}
              >
                {selectedCompany.status || "Unknown"}
              </Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            {/* Modal Content */}
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Tabs for Navigation */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      borderBottom: 1,
                      borderColor: 'divider',
                      mb: 2
                    }}
                  >
                    <Button
                      variant={activeTab === "info" ? "contained" : "text"}
                      onClick={() => setActiveTab("info")}
                      sx={{ mr: 1 }}
                      startIcon={<BusinessIcon />}
                    >
                      Company Information
                    </Button>
                    <Button
                      variant={activeTab === "address" ? "contained" : "text"}
                      onClick={() => setActiveTab("address")}
                      sx={{ mr: 1 }}
                      startIcon={<LocationOnIcon />}
                    >
                      Address Details
                    </Button>
                    <Button
                      variant={activeTab === "documents" ? "contained" : "text"}
                      onClick={() => setActiveTab("documents")}
                      sx={{ mr: 1 }}
                      startIcon={<AttachFileIcon />}
                    >
                      Required Documents
                    </Button>
                  </Box>
                </Grid>
                {/* Company Information Tab */}
                {activeTab === "info" && (
                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 2 }}>
                      <BusinessIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold" display="inline">
                        Company Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Company Name" value={selectedCompany.company_name} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Email" value={selectedCompany.company_email} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Website" value={selectedCompany.company_website} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Industry" value={selectedCompany.company_industry} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Company Type" value={selectedCompany.company_type} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Total Workforce" value={selectedCompany.company_total_workforce} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          value={selectedCompany.company_description || "No description available."}
                          fullWidth
                          multiline
                          rows={4}
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                          margin="dense"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/* Address Details Tab */}
                {activeTab === "address" && (
                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 2 }}>
                      <LocationOnIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold" display="inline">
                        Address Details
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Country" value={selectedCompany.company_country} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Full Address"
                          value={selectedCompany.company_address || "No address provided"}
                          fullWidth
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                          multiline
                          rows={2}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="House No. / Street / Building" value={selectedCompany.company_house_no_street} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ReadOnlyTextField label="Zip Code / Postal Code" value={selectedCompany.company_postal_code} />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/* Required Documents Tab */}
                {activeTab === "documents" && (
                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 2 }}>
                      <AttachFileIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold" display="inline">
                        Required Documents
                      </Typography>
                    </Box>
                    <List>
                      {[
                        { label: "Company Logo", path: selectedCompany.logo_image_path },
                        { label: "Business Permit", path: selectedCompany.business_permit_path },
                        { label: "BIN Forms", path: selectedCompany.bir_form_path },
                        { label: "PhilHealth Certificate", path: selectedCompany.philhealth_file_path },
                        { label: "DOLE Certificate", path: selectedCompany.dole_certificate_path }
                      ].map(({ label, path }, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={!!path} />
                          </ListItemIcon>
                          <ListItemText
                            primary={label}
                            secondary={path ? "Uploaded" : "Not Uploaded"}
                          />
                          {path && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(path)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                {/* Admin Review Panel */}
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Admin Review
                  </Typography>
                  <TextField
                    label="Admin Remarks"
                    multiline
                    rows={8}
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your remarks, observations or comments about this company..."
                    sx={{ mb: 2 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ThumbDownIcon />}
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ThumbUpIcon />}
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Employer;