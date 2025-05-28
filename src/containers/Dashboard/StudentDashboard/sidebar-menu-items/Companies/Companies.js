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
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import CompanyModal from './CompanyModal';

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
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen w-full">
      {/* Modern Thin Header */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900">
            <BusinessIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Companies</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Explore businesses and opportunities</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredCompanies.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Companies Found</span>
        </div>
      </header>

      {/* Search Bar Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 bg-[#1a237e] flex-shrink-0">
        <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/50 rounded-full shadow-none h-10 w-full max-w-xl">
          <span className="pl-3 pr-1 text-gray-400 dark:text-gray-300 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search companies, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 h-full px-0"
          />
        </div>
        {/* Add any additional filters here if needed */}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden">
        {/* Companies List */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
          <div className="flex flex-col gap-3 overflow-y-auto lg:pr-4" style={{ height: 'calc(100vh - 180px)' }}>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2">
                <img src={logoNav} alt="IPEPS Logo" className="w-16 h-16 sm:w-24 sm:h-24 loading-logo" />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-base">
                  Loading Companies...
                </Typography>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500 dark:text-gray-400 text-base">No companies found matching your criteria</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 p-3 flex gap-3 items-center ${
                    selectedCompany?.id === company.id ? 'ring-2 ring-blue-400 border-blue-500' : ''
                  }`}
                >
                  <Avatar className="w-20 h-20 flex-shrink-0 text-2xl font-bold bg-blue-600">
                    {company.logo}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {company.location}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {company.website}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {company.description}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Company Details - Desktop View */}
        {selectedCompany && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 sticky top-4" 
               style={{ zIndex: 1000 }}>
            <CompanyModal
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
            />
          </div>
        )}

        {/* Company Details - Mobile Modal View */}
        {selectedCompany && (
          <div 
            className="lg:hidden fixed inset-0"
            style={{ zIndex: Number.MAX_SAFE_INTEGER }}
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              style={{ 
                position: 'fixed',
                zIndex: Number.MAX_SAFE_INTEGER,
                pointerEvents: 'auto'
              }}
            >
              <div className="fixed inset-0 overflow-hidden">
                <div className="fixed inset-0" onClick={() => setSelectedCompany(null)} />
                <div 
                  className="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out translate-y-0"
                  style={{ 
                    zIndex: Number.MAX_SAFE_INTEGER,
                    pointerEvents: 'auto'
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
                    <div 
                      className="absolute right-4 top-4"
                      style={{ zIndex: Number.MAX_SAFE_INTEGER }}
                    >
                      <button
                        onClick={() => setSelectedCompany(null)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <CompanyModal
                      company={selectedCompany}
                      onClose={() => setSelectedCompany(null)}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
