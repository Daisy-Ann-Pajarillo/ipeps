import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from "@mui/material";
import { Search } from "@mui/icons-material";
import JobSeekerAppliedTheirJob from "./data/JobSeekerAppliedTheirJob";

const JobPreference = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabFilters, setTabFilters] = useState({ fromDate: "", toDate: "", location: "", industry: "" });
  const [municipalities, setMunicipalities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (Array.isArray(JobSeekerAppliedTheirJob)) {
      setMunicipalities([...new Set(JobSeekerAppliedTheirJob.map(job => job.municipality))]);
      setIndustries([...new Set(JobSeekerAppliedTheirJob.map(job => job.jobTitle))]);
    }
  }, []);

  const fetchData = () => {
    let filteredData = JobSeekerAppliedTheirJob;

    if (tabFilters.fromDate) {
      filteredData = filteredData.filter(job => job.dateFrom >= tabFilters.fromDate);
    }
    if (tabFilters.toDate) {
      filteredData = filteredData.filter(job => job.dateTo <= tabFilters.toDate);
    }
    if (tabFilters.location) {
      filteredData = filteredData.filter(job => job.municipality === tabFilters.location);
    }
    if (tabFilters.industry) {
      filteredData = filteredData.filter(job => job.jobTitle === tabFilters.industry);
    }

    const jobCounts = filteredData.reduce((acc, job) => {
      acc[job.jobTitle] = (acc[job.jobTitle] || 0) + job.totalOfApplicants;
      return acc;
    }, {});

    setFilteredResults(Object.entries(jobCounts));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
        variant="scrollable"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        {[
          "Occupation By Sex",
          "Occupation By Course",
          "Location By Sex",
          "Location By Course",
          "Occupation by Age Bracket",
          "Location by Age Bracket",
          "Occupation by Educational Attainment",
          "Location by Educational Attainment"
        ].map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          variant="outlined"
          label="From Date"
          type="date"
          value={tabFilters.fromDate}
          onChange={(e) => setTabFilters({ ...tabFilters, fromDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          variant="outlined"
          label="To Date"
          type="date"
          value={tabFilters.toDate}
          onChange={(e) => setTabFilters({ ...tabFilters, toDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl variant="outlined" size="small" sx={{ width: "200px" }}>
          <InputLabel>City/Municipality</InputLabel>
          <Select
            value={tabFilters.location}
            onChange={(e) => setTabFilters({ ...tabFilters, location: e.target.value })}
            label="City/Municipality"
          >
            {municipalities.map(location => (
              <MenuItem key={location} value={location}>{location}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ width: "200px" }}>
          <InputLabel>Industry</InputLabel>
          <Select
            value={tabFilters.industry}
            onChange={(e) => setTabFilters({ ...tabFilters, industry: e.target.value })}
            label="Industry"
          >
            {industries.map(industry => (
              <MenuItem key={industry} value={industry}>{industry}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" startIcon={<Search />} onClick={fetchData}>
          Search
        </Button>
      </Box>

      {/* Results */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ width: '100%', p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {[
                  "Occupation By Sex",
                  "Occupation By Course",
                  "Location By Sex",
                  "Location By Course",
                  "Occupation by Age Bracket",
                  "Location by Age Bracket",
                  "Occupation by Educational Attainment",
                  "Location by Educational Attainment"
                ][tabIndex]}
              </Typography>

              {filteredResults.length > 0 ? (
                filteredResults.map(([key, value], index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2">{key}: {value} job seekers</Typography>
                    <LinearProgress variant="determinate" value={(value / 500) * 100} sx={{ height: 8, borderRadius: 5 }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ width: '100%', p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Data Summary</Typography>
              {filteredResults.length > 0 ? (
                filteredResults.map(([key, value], index) => (
                  <Typography key={index} variant="body2" gutterBottom>
                    {key}: {value} job seekers
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobPreference;
