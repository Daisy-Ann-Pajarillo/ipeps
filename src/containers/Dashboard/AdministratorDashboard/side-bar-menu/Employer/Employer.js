import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import SearchData from "../../../components/layout/Search"; // Import SearchData

// Dummy Companies Data
const companies = [
  {
    name: "Rakuten",
    category: "E-commerce",
    status: "Active",
    description: "Rakuten is a Japanese electronic commerce and online retailing company.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Rakuten_Global_Brand_Logo.png",
  },
  {
    name: "Toyota",
    category: "Automobile",
    status: "Active",
    description: "Toyota is a Japanese multinational automotive manufacturer.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.png",
  },
  {
    name: "Sony",
    category: "Electronics",
    status: "Inactive",
    description: "Sony is a multinational conglomerate known for electronics and entertainment.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Sony_logo.svg",
  },
];

const Employer = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleView = (company) => setSelectedCompany(company);
  const handleClose = () => setSelectedCompany(null);

  // **Filter Companies Based on Search & Filters**
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || company.category === category) &&
      (status === "" || company.status === status)
  );

  return (
    <Box>
      {/* Search & Filter Section */}
      <SearchData
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        componentData={[
          { title: "Category", options: ["", "E-commerce", "Automobile", "Electronics"] },
          { title: "Status", options: ["", "Active", "Inactive"] }
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCategory(value);
          if (index === 1) setStatus(value);
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredCompanies.length === 0 ? (
        <Typography variant="h6" color="textSecondary" textAlign="center" mt={4}>
          No results found
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center" mt={3}>
          {filteredCompanies.map((company, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: 350, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: 2, boxShadow: 3 }}>
                <CardMedia component="img" image={company.image} alt={company.name} sx={{ height: 140, objectFit: "contain" }} />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">{company.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                    {company.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {company.category} ({company.status})
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleView(company)} sx={{ mt: 2 }}>
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Company Details Modal */}
      <Dialog open={Boolean(selectedCompany)} onClose={handleClose}>
        <DialogTitle>Company Information</DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Name" value={selectedCompany.name} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Category" value={selectedCompany.category} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Status" value={selectedCompany.status} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Description" value={selectedCompany.description} fullWidth multiline rows={3} InputProps={{ readOnly: true }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employer;
