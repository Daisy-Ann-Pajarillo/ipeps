import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Rating,
} from "@mui/material";
import {
  LocationOn,
  Language,
  People,
  Bookmark,
  BookmarkBorder,
  Verified,
  Close as CloseIcon,
} from "@mui/icons-material";
import logoNav from '../../../../Home/images/logonav.png';

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

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followedCompanies, setFollowedCompanies] = useState({});
  const [query, setQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useEffect(() => {
    let filtered = companies;
    if (query.trim()) {
      filtered = companies.filter(({ name, industry, location }) =>
        [name, industry, location].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    setFilteredCompanies(filtered);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 px-8 py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h3" className="text-white font-bold mb-3">
          Explore Companies
        </Typography>
        <Typography variant="h6" className="text-blue-100 mb-8">
          Discover top employers and training providers in Iloilo
        </Typography>
        {/* Search Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 -mb-20 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>
      </section>

      {/* Companies Grid */}
      <div className="w-full max-w-7xl px-4 pt-24 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-16">
              <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo mb-4" />
              <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
                No companies found.
              </Typography>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => handleCompanyClick(company)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="bg-blue-600 text-white w-16 h-16 text-2xl font-bold">
                    {company.logo}
                  </Avatar>
                  <div>
                    <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      {company.name}
                      {company.verified && <Verified className="text-blue-500" fontSize="small" />}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
                      {company.industry}
                    </Typography>
                  </div>
                  <IconButton
                    onClick={(e) => handleFollowCompany(e, company.id)}
                    size="small"
                    className="ml-auto"
                  >
                    {followedCompanies[company.id] ? (
                      <Bookmark className="text-blue-500" />
                    ) : (
                      <BookmarkBorder />
                    )}
                  </IconButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip icon={<LocationOn fontSize="small" />} label={company.location} size="small" variant="outlined" />
                  <Chip icon={<Language fontSize="small" />} label={company.website} size="small" variant="outlined" />
                  <Chip icon={<People fontSize="small" />} label={company.employeeCount} size="small" variant="outlined" />
                </div>
                <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                  {company.description}
                </Typography>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1">
                    <Rating value={company.rating} readOnly size="small" />
                    <span className="text-gray-500 text-sm">({company.reviews} reviews)</span>
                  </div>
                  <Chip label={`${company.openPositions} open positions`} color="primary" size="small" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Company Modal */}
      {selectedCompany && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="flex items-center gap-3">
              <Avatar className="bg-blue-600 text-white w-14 h-14 text-2xl font-bold">{selectedCompany.logo}</Avatar>
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
              <Box className="flex flex-wrap gap-2">
                <Chip icon={<LocationOn />} label={selectedCompany.location} variant="outlined" />
                <Chip icon={<Language />} label={selectedCompany.website} variant="outlined" clickable />
                <Chip icon={<People />} label={`${selectedCompany.employeeCount} Employees`} variant="outlined" />
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>{selectedCompany.description}</Typography>
              <Box className="flex items-center gap-1">
                <Rating value={selectedCompany.rating} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  {selectedCompany.rating} ({selectedCompany.reviews} reviews)
                </Typography>
              </Box>
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
