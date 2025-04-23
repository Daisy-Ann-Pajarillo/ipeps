
import React, { useState } from "react";
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
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Enhanced Companies Data with more details matching the form structure  
const companies = [
  {
    id: 1,
    name: "Rakuten",
    email: "contact@rakuten.com",
    website: "rakuten.com",
    industry: "E-commerce",
    companyType: "Corporation",
    totalWorkforce: "17,800+",
    country: "Japan",
    fullAddress: "1-14-1 Tamagawa, Setagaya-ku, Tokyo, Japan",
    houseNo: "1-14-1 Tamagawa",
    zipCode: "158-0094",
    category: "E-commerce",
    status: "Pending Review",
    description: "Rakuten is a Japanese electronic commerce and online retailing company based in Tokyo. It was founded in 1997 and has expanded globally.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Rakuten_Global_Brand_Logo.png",
    founded: "1997",
    headquarters: "Tokyo, Japan",
    revenue: "$12.1 billion (2023)",
    adminRemarks: "",
    documents: {
      logo: {
        available: true,
        filename: "rakuten_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "rakuten_business_permit.pdf"
      },
      binForms: {
        available: true,
        filename: "rakuten_bin_forms.pdf"
      },
      pdpaFiles: {
        available: false,
        filename: ""
      },
      philhealthCert: {
        available: false,
        filename: ""
      },
      doleCert: {
        available: false,
        filename: ""
      }
    }
  },
  {
    id: 2,
    name: "Toyota",
    email: "corporate@toyota.co.jp",
    website: "toyota.com",
    industry: "Automobile",
    companyType: "Corporation",
    totalWorkforce: "370,000+",
    country: "Japan",
    fullAddress: "1 Toyota-Cho, Toyota City, Aichi Prefecture, Japan",
    houseNo: "1 Toyota-Cho",
    zipCode: "471-8571",
    category: "Automobile",
    status: "Active",
    description: "Toyota is a Japanese multinational automotive manufacturer headquartered in Toyota City, Aichi, Japan. Known for reliable vehicles and lean manufacturing.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.png",
    founded: "1937",
    headquarters: "Toyota City, Japan",
    revenue: "$280.5 billion (2023)",
    adminRemarks: "Approved as premium partner",
    documents: {
      logo: {
        available: true,
        filename: "toyota_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "toyota_business_permit.pdf"
      },
      binForms: {
        available: true,
        filename: "toyota_bin_forms.pdf"
      },
      pdpaFiles: {
        available: true,
        filename: "toyota_pdpa_files.pdf"
      },
      philhealthCert: {
        available: true,
        filename: "toyota_philhealth_cert.pdf"
      },
      doleCert: {
        available: true,
        filename: "toyota_dole_cert.pdf"
      }
    }
  },
  {
    id: 3,
    name: "Sony",
    email: "info@sony.com",
    website: "sony.com",
    industry: "Electronics",
    companyType: "Corporation",
    totalWorkforce: "109,700+",
    country: "Japan",
    fullAddress: "1-7-1 Konan Minato-ku, Tokyo, Japan",
    houseNo: "1-7-1 Konan",
    zipCode: "108-0075",
    category: "Electronics",
    status: "Inactive",
    description: "Sony is a multinational conglomerate known for electronics, gaming, entertainment, and financial services. Creator of PlayStation and various electronic devices.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Sony_logo.svg",
    founded: "1946",
    headquarters: "Tokyo, Japan",
    revenue: "$88.3 billion (2023)",
    adminRemarks: "Partnership suspended due to policy violations",
    documents: {
      logo: {
        available: true,
        filename: "sony_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "sony_business_permit.pdf"
      },
      binForms: {
        available: false,
        filename: ""
      },
      pdpaFiles: {
        available: false,
        filename: ""
      },
      philhealthCert: {
        available: false,
        filename: ""
      },
      doleCert: {
        available: false,
        filename: ""
      }
    }
  },
  {
    id: 4,
    name: "Nintendo",
    email: "support@nintendo.co.jp",
    website: "nintendo.com",
    industry: "Gaming",
    companyType: "Corporation",
    totalWorkforce: "6,500+",
    country: "Japan",
    fullAddress: "11-1 Hokotate-cho, Kamitoba, Minami-ku, Kyoto, Japan",
    houseNo: "11-1 Hokotate-cho",
    zipCode: "601-8501",
    category: "Gaming",
    status: "Pending Review",
    description: "Nintendo is a Japanese multinational video game company headquartered in Kyoto. Famous for creating franchises like Mario, Zelda, and Pokémon.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg",
    founded: "1889",
    headquarters: "Kyoto, Japan",
    revenue: "$15.3 billion (2023)",
    adminRemarks: "",
    documents: {
      logo: {
        available: true,
        filename: "nintendo_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "nintendo_business_permit.pdf"
      },
      binForms: {
        available: true,
        filename: "nintendo_bin_forms.pdf"
      },
      pdpaFiles: {
        available: true,
        filename: "nintendo_pdpa_files.pdf"
      },
      philhealthCert: {
        available: false,
        filename: ""
      },
      doleCert: {
        available: false,
        filename: ""
      }
    }
  },
  {
    id: 5,
    name: "Uniqlo",
    email: "corporate@uniqlo.com",
    website: "uniqlo.com",
    industry: "Retail",
    companyType: "Corporation",
    totalWorkforce: "52,800+",
    country: "Japan",
    fullAddress: "Midtown Tower, 9-7-1 Akasaka, Minato-ku, Tokyo, Japan",
    houseNo: "9-7-1 Akasaka",
    zipCode: "107-6231",
    category: "Retail",
    status: "Active",
    description: "Uniqlo is a Japanese casual wear designer, manufacturer and retailer. The company has grown to become Japan's leading specialty retailer.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg",
    founded: "1949",
    headquarters: "Tokyo, Japan",
    revenue: "$24.2 billion (2023)",
    adminRemarks: "Strategic partnership approved",
    documents: {
      logo: {
        available: true,
        filename: "uniqlo_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "uniqlo_business_permit.pdf"
      },
      binForms: {
        available: true,
        filename: "uniqlo_bin_forms.pdf"
      },
      pdpaFiles: {
        available: true,
        filename: "uniqlo_pdpa_files.pdf"
      },
      philhealthCert: {
        available: true,
        filename: "uniqlo_philhealth_cert.pdf"
      },
      doleCert: {
        available: true,
        filename: "uniqlo_dole_cert.pdf"
      }
    }
  },
  {
    id: 6,
    name: "Mitsubishi",
    email: "info@mitsubishi.com",
    website: "mitsubishi.com",
    industry: "Conglomerate",
    companyType: "Corporation",
    totalWorkforce: "164,000+",
    country: "Japan",
    fullAddress: "3-1, Marunouchi 2-chome, Chiyoda-ku, Tokyo, Japan",
    houseNo: "3-1, Marunouchi 2-chome",
    zipCode: "100-8086",
    category: "Conglomerate",
    status: "Pending Review",
    description: "Mitsubishi is a group of autonomous Japanese multinational companies covering a wide range of businesses including banking, automobiles, electronics, and more.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Mitsubishi_logo.svg",
    founded: "1870",
    headquarters: "Tokyo, Japan",
    revenue: "$132.6 billion (2023)",
    adminRemarks: "",
    documents: {
      logo: {
        available: true,
        filename: "mitsubishi_logo.pdf"
      },
      businessPermit: {
        available: true,
        filename: "mitsubishi_business_permit.pdf"
      },
      binForms: {
        available: false,
        filename: ""
      },
      pdpaFiles: {
        available: true,
        filename: "mitsubishi_pdpa_files.pdf"
      },
      philhealthCert: {
        available: false,
        filename: ""
      },
      doleCert: {
        available: false,
        filename: ""
      }
    }
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "error";
    case "Pending Review":
      return "warning";
    default:
      return "default";
  }
};

const DocumentStatusIcon = ({ isAvailable }) => {
  return isAvailable ? (
    <VerifiedIcon fontSize="small" color="success" />
  ) : (
    <CancelIcon fontSize="small" color="error" />
  );
};

// Function to handle document download
const handleDownload = (filename) => {
  // In a real application, this would trigger a download of the actual file
  // For this demo, we'll just show an alert
  alert(`Downloading ${filename}`);

  // In a real application, you would use something like:
  // const link = document.createElement('a');
  // link.href = `/api/documents/${filename}`;
  // link.download = filename;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};

const Employer = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [companiesData, setCompaniesData] = useState(companies);
  const [activeTab, setActiveTab] = useState("info");

  const handleView = (company) => {
    setSelectedCompany(company);
    setAdminRemarks(company.adminRemarks || "");
    setActiveTab("info");
  };

  const handleClose = () => setSelectedCompany(null);

  const handleApprove = () => {
    const updatedCompanies = companiesData.map(company =>
      company.id === selectedCompany.id
        ? { ...company, status: "Active", adminRemarks: adminRemarks }
        : company
    );

    setCompaniesData(updatedCompanies);
    setNotification({
      open: true,
      message: `${selectedCompany.name} has been approved`,
      severity: "success"
    });
    handleClose();
  };

  const handleReject = () => {
    const updatedCompanies = companiesData.map(company =>
      company.id === selectedCompany.id
        ? { ...company, status: "Inactive", adminRemarks: adminRemarks }
        : company
    );

    setCompaniesData(updatedCompanies);
    setNotification({
      open: true,
      message: `${selectedCompany.name} has been rejected`,
      severity: "error"
    });
    handleClose();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Get unique categories for filter
  const categories = ["", ...new Set(companiesData.map(company => company.category))];

  // Get unique statuses for filter
  const statuses = ["", ...new Set(companiesData.map(company => company.status))];

  // Filter Companies Based on Search & Filters
  const filteredCompanies = companiesData.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || company.category === category) &&
      (status === "" || company.status === status)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Company Management Dashboard
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
                  height: 380,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={company.image}
                    alt={company.name}
                    sx={{
                      height: 160,
                      objectFit: "contain",
                      p: 2,
                      backgroundColor: "#f5f5f5"
                    }}
                  />
                  <Chip
                    label={company.status}
                    color={getStatusColor(company.status)}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontWeight: "bold"
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, px: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {company.name}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {company.industry} • {company.founded}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, height: 60, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {company.description.substring(0, 120)}
                    {company.description.length > 120 ? "..." : ""}
                  </Typography>

                  {company.adminRemarks && (
                    <Box sx={{ mb: 2, p: 1, backgroundColor: "#f8f9fa", borderRadius: 1 }}>
                      <Typography variant="caption" color="textSecondary" fontWeight="bold">
                        Admin Note:
                      </Typography>
                      <Typography variant="caption" display="block">
                        {company.adminRemarks.substring(0, 40)}
                        {company.adminRemarks.length > 40 ? "..." : ""}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleView(company)}
                    startIcon={<InfoIcon />}
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Company Details Modal - Updated to match the form structure */}
      <Dialog
        open={Boolean(selectedCompany)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        {selectedCompany && (
          <>
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
                  src={selectedCompany.image}
                  alt={selectedCompany.name}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6">{selectedCompany.name}</Typography>
              </Box>
              <Chip
                label={selectedCompany.status}
                color={getStatusColor(selectedCompany.status)}
                sx={{ fontWeight: "bold" }}
              />
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Tabs for navigation */}
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
                  <>
                    <Grid item xs={12} md={7}>
                      <Box sx={{ mb: 2 }}>
                        <BusinessIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" display="inline">
                          Company Information
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Company Name"
                            value={selectedCompany.name}
                            fullWidth
                            variant="outlined"
                            slotProps={{ input: { readOnly: true } }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Email"
                            value={selectedCompany.email}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Website"
                            value={selectedCompany.website}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Industry"
                            value={selectedCompany.industry}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Company Type"
                            value={selectedCompany.companyType}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Total Workforce"
                            value={selectedCompany.totalWorkforce}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Description"
                            value={selectedCompany.description}
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
                  </>
                )}

                {/* Address Details Tab */}
                {activeTab === "address" && (
                  <>
                    <Grid item xs={12} md={7}>
                      <Box sx={{ mb: 2 }}>
                        <LocationOnIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" display="inline">
                          Address Details
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Country"
                            value={selectedCompany.country}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Full Address"
                            value={selectedCompany.fullAddress}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            multiline
                            rows={2}
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="House No. / Street / Building"
                            value={selectedCompany.houseNo}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Zip Code / Postal Code"
                            value={selectedCompany.zipCode}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Additional Information
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Founded"
                            value={selectedCompany.founded}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Headquarters"
                            value={selectedCompany.headquarters}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Annual Revenue"
                            value={selectedCompany.revenue}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

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
                  </>
                )}

                {/* Required Documents Tab - UPDATED FOR DOWNLOADING PDFs */}
                {activeTab === "documents" && (
                  <>
                    <Grid item xs={12} md={7}>
                      <Box sx={{ mb: 2 }}>
                        <AttachFileIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" display="inline">
                          Required Documents
                        </Typography>
                      </Box>

                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.logo.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Company Logo"
                            secondary={selectedCompany.documents.logo.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.logo.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.logo.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.businessPermit.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Business Permit"
                            secondary={selectedCompany.documents.businessPermit.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.businessPermit.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.businessPermit.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.binForms.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="BIN Forms"
                            secondary={selectedCompany.documents.binForms.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.binForms.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.binForms.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.pdpaFiles.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="PDPA Files"
                            secondary={selectedCompany.documents.pdpaFiles.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.pdpaFiles.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.pdpaFiles.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.philhealthCert.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="PhilHealth Certificate"
                            secondary={selectedCompany.documents.philhealthCert.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.philhealthCert.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.philhealthCert.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <DocumentStatusIcon isAvailable={selectedCompany.documents.doleCert.available} />
                          </ListItemIcon>
                          <ListItemText
                            primary="DOLE Certificate"
                            secondary={selectedCompany.documents.doleCert.available ? "Uploaded" : "Not Uploaded"}
                          />
                          {selectedCompany.documents.doleCert.available && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => handleDownload(selectedCompany.documents.doleCert.filename)}
                            >
                              Download
                            </Button>
                          )}
                        </ListItem>
                      </List>
                    </Grid>

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
                  </>
                )}
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
    </Box >
  );
};

export default Employer;
