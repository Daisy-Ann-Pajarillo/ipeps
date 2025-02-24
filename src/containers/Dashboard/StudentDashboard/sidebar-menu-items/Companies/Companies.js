import React, { useState, useEffect } from "react";
import SearchData from "../../../components/layout/Search";
import CompanyModal from "./CompanyModal";
import {
  LocationOn,
  Language,
  People,
  Bookmark,
  BookmarkBorder,
  Verified,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Rating,
  DialogActions,
  Box,
  Button
} from "@mui/material";

const Companies = ({ isCollapsed }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followedCompanies, setFollowedCompanies] = useState({});
  const [query, setQuery] = useState("");
  const [sortedCompanies, setSortedCompanies] = useState([]);

  const companies = [
    {
      id: 1,
      name: "Tech Solutions Inc.",
      logo: "TS",
      industry: "Information Technology",
      location: "New York, NY",
      website: "www.techsolutions.com",
      employeeCount: "1000-5000",
      rating: 4.5,
      reviews: 245,
      verified: true,
      description: "Leading provider of innovative tech solutions",
      openPositions: 15,
      jobs: [
        { title: "Software Engineer", location: "Remote" },
        { title: "Project Manager", location: "New York, NY" },
      ],
      trainings: [
        { title: "Cybersecurity Workshop", duration: "2 weeks" },
        { title: "AI & Machine Learning Bootcamp", duration: "1 month" },
      ],
    },
    {
      id: 2,
      name: "Global Innovations Ltd",
      logo: "GI",
      industry: "Technology Consulting",
      location: "San Francisco, CA",
      website: "www.globalinnovations.com",
      employeeCount: "5000-10000",
      rating: 4.3,
      reviews: 189,
      verified: true,
      description: "Global leader in technology consulting services",
      openPositions: 23,
      jobs: [{ title: "Data Scientist", location: "San Francisco, CA" }],
      trainings: [],
    },
  ];

  useEffect(() => {
    const filterAndSortCompanies = (query) => {
      if (!query.trim()) return companies;
      return companies
        .filter(({ name, industry, location }) =>
          [name, industry, location].some((field) =>
            field.toLowerCase().includes(query.toLowerCase())
          )
        )
        .sort((a, b) => b.rating - a.rating || b.openPositions - a.openPositions);
    };
    setSortedCompanies(filterAndSortCompanies(query));
  }, [query]);

  const handleFollowCompany = (e, companyId) => {
    e.stopPropagation();
    setFollowedCompanies((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full p-4">
      <SearchData
        placeholder="Find a company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {sortedCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg cursor-pointer transition"
            onClick={() => handleCompanyClick(company)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="bg-blue-500 text-white w-14 h-14">{company.logo}</Avatar>
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    {company.name}
                    {company.verified && <Verified className="text-blue-500 ml-1 text-sm" />}
                  </h3>
                  <p className="text-gray-500 text-sm">{company.industry}</p>
                </div>
              </div>
              <IconButton onClick={(e) => handleFollowCompany(e, company.id)} size="small">
                {followedCompanies[company.id] ? (
                  <Bookmark className="text-blue-500" />
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
            </div>

            <div className="flex flex-wrap gap-2 my-3">
              <Chip
                icon={<LocationOn fontSize="small" />}
                label={company.location}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<Language fontSize="small" />}
                label={company.website}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<People fontSize="small" />}
                label={company.employeeCount}
                size="small"
                variant="outlined"
              />
            </div>

            <p className="text-gray-600 text-sm">{company.description}</p>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-1">
                <Rating value={company.rating} readOnly size="small" />
                <span className="text-gray-500 text-sm">({company.reviews} reviews)</span>
              </div>
              <Chip label={`${company.openPositions} open positions`} color="primary" size="small" />
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
  <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="flex items-center gap-3">
        <Avatar className="bg-blue-500 text-white w-14 h-14">{selectedCompany.logo}</Avatar>
        <div>
          <Typography variant="h6">{selectedCompany.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedCompany.industry}
          </Typography>
        </div>
      </div>
      <IconButton aria-label="close" onClick={() => setIsModalOpen(false)}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      <Box className="space-y-4">
        {/* Company Info */}
        <Box className="flex flex-wrap gap-2">
          <Chip icon={<LocationOn />} label={selectedCompany.location} variant="outlined" />
          <Chip icon={<Language />} label={selectedCompany.website} variant="outlined" clickable />
          <Chip icon={<People />} label={`${selectedCompany.employeeCount} Employees`} variant="outlined" />
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>{selectedCompany.description}</Typography>

        {/* Ratings & Reviews */}
        <Box className="flex items-center gap-1">
          <Rating value={selectedCompany.rating} readOnly size="small" />
          <Typography variant="body2" color="textSecondary">
            {selectedCompany.rating} ({selectedCompany.reviews} reviews)
          </Typography>
        </Box>

        {/* Job Openings */}
        <Typography variant="h6" sx={{ mt: 3 }}>Job Openings</Typography>
        {selectedCompany.jobs?.length > 0 ? (
          selectedCompany.jobs.map((job, index) => (
            <Box key={index} className="border p-3 rounded-md shadow-sm">
              <Typography variant="subtitle1">{job.title}</Typography>
              <Typography variant="body2" color="textSecondary">{job.location}</Typography>
              <Typography variant="body2">{job.description || "No description available"}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">No job openings available.</Typography>
        )}

        {/* Trainings */}
        <Typography variant="h6" sx={{ mt: 3 }}>Training Programs</Typography>
        {selectedCompany.trainings?.length > 0 ? (
          selectedCompany.trainings.map((training, index) => (
            <Box key={index} className="border p-3 rounded-md shadow-sm">
              <Typography variant="subtitle1">{training.title}</Typography>
              <Typography variant="body2">{training.duration}</Typography>
              <Typography variant="body2">{training.description || "No description available"}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">No training programs available.</Typography>
        )}
      </Box>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setIsModalOpen(false)} color="secondary">Close</Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => alert("Follow feature coming soon!")}
      >
        Follow Company
      </Button>
    </DialogActions>
  </Dialog>
)}

    </div>
  );
};

export default Companies;
