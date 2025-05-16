import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import {
  LocationOn,
  Language,
  Close as CloseIcon,
} from "@mui/icons-material";
import logoNav from '../../../../Home/images/logonav.png';

// Dummy companies data (replace with API call)
const companies = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    logo: "TS",
    location: "New York, NY",
    website: "www.techsolutions.com",
    description: "Leading provider of innovative tech solutions.",
  },
  {
    id: 2,
    name: "Global Innovations Ltd",
    logo: "GI",
    location: "San Francisco, CA",
    website: "www.globalinnovations.com",
    description: "Global leader in technology consulting services.",
  },
];

// SAMPLE API CALL (uncomment and use in useEffect for real backend integration)
/*
import axios from "../../../../../axios";
const [companies, setCompanies] = useState([]);
useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await axios.get("/api/companies"); // <-- Replace with your backend endpoint
      setCompanies(response.data.companies); // Adjust according to your API response structure
    } catch (error) {
      setCompanies([]);
    }
  };
  fetchCompanies();
}, []);
*/

const Companies = () => {
  const [query, setQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let filtered = companies;
    if (query.trim()) {
      filtered = companies.filter(({ name, location }) =>
        [name, location].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    setFilteredCompanies(filtered);
  }, [query]);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 px-4 sm:px-8 py-8 sm:py-12 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          Explore Companies
        </Typography>
        <Typography variant="subtitle1" className="text-blue-100 mb-4 text-xs sm:text-base md:text-lg">
          Discover top employers and training providers in Iloilo
        </Typography>
        {/* Search Section */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-8 sm:-mb-12 md:-mb-16 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
          />
        </div>
      </section>

      {/* Companies Grid */}
      <div className="w-full max-w-7xl px-2 sm:px-4 pt-16 sm:pt-24 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-10 sm:py-16">
              <img src={logoNav} alt="IPEPS Logo" className="w-16 h-16 sm:w-24 sm:h-24 loading-logo mb-4" />
              <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No companies found.
              </Typography>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-xl p-3 sm:p-6 flex flex-col gap-3 sm:gap-4 items-center cursor-pointer"
                onClick={() => handleCompanyClick(company)}
              >
                <Avatar className="bg-blue-600 text-white w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-2xl font-bold mb-2">
                  {company.logo}
                </Avatar>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg text-center">
                  {company.name}
                </Typography>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Chip icon={<LocationOn fontSize="small" />} label={company.location} size="small" variant="outlined" className="text-xs sm:text-sm" />
                  <Chip icon={<Language fontSize="small" />} label={company.website} size="small" variant="outlined" className="text-xs sm:text-sm" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Company Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box className="flex items-center gap-3">
            <Avatar className="bg-blue-600 text-white w-12 h-12 text-lg font-bold">{selectedCompany?.logo}</Avatar>
            <div>
              <Typography variant="h6" className="text-base">{selectedCompany?.name}</Typography>
              <div className="flex flex-wrap gap-1 mt-1">
                <Chip icon={<LocationOn fontSize="small" />} label={selectedCompany?.location} size="small" variant="outlined" className="text-xs" />
                <Chip icon={<Language fontSize="small" />} label={selectedCompany?.website} size="small" variant="outlined" className="text-xs" />
              </div>
            </div>
          </Box>
          <IconButton aria-label="close" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mt-2">
            {selectedCompany?.description}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
