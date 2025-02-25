import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Grid
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchData from "../../../components/layout/Search"; // Importing SearchData

const jobListings = [
  { id: 1, title: "Frontend Developer", company: "Tech Solutions Inc.", location: "San Francisco, CA", salary: "$90,000 - $110,000", description: "We are looking for a skilled frontend developer proficient in React and Material UI." },
  { id: 2, title: "Backend Engineer", company: "Innovatech", location: "Remote", salary: "$100,000 - $130,000", description: "Seeking a backend engineer with expertise in Node.js and PostgreSQL." },
  { id: 3, title: "UI/UX Designer", company: "Creative Labs", location: "New York, NY", salary: "$80,000 - $100,000", description: "Join our design team to craft intuitive user experiences with Figma and Adobe XD." }
];

export default function JobBoard() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  // **Filter Jobs Based on Search Query & Dropdown Selections**
  const filteredJobs = jobListings.filter((job) => {
    const matchesQuery =
      query === "" || job.title.toLowerCase().includes(query.toLowerCase());

    const matchesCompany = company === "" || job.company.toLowerCase() === company.toLowerCase();
    const matchesLocation = location === "" || job.location.toLowerCase() === location.toLowerCase();

    return matchesQuery && matchesCompany && matchesLocation;
  });

  return (
    <Box >
      {/* Search & Filter Component */}
      <SearchData
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        componentData={[
          { title: "Company", options: ["", ...new Set(jobListings.map((job) => job.company))] },
          { title: "Location", options: ["", ...new Set(jobListings.map((job) => job.location))] }
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCompany(value);
          if (index === 1) setLocation(value);
        }}
      />

      {/* Job Listings */}
      <Grid container spacing={2} className="flex flex-wrap p-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card sx={{ padding: 2, marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{job.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">{job.company}</Typography>
                  <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
                    <LocationOnIcon sx={{ marginRight: 0.5 }} /> {job.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
                    <AttachMoneyIcon sx={{ marginRight: 0.5 }} /> {job.salary}
                  </Typography>
                  <Typography variant="body1" paragraph>{job.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="success">Accept</Button>
                  <Button variant="contained" color="error">Reject</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography textAlign="center" width="100%">No jobs found.</Typography>
        )}
      </Grid>
    </Box>
  );
}
