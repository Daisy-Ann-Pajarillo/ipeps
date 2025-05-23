import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import TrainingView from "./TrainingView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material"; // Changed from @material-ui/core to @mui/material
import logoNav from '../../../../Home/images/logonav.png';
import pesoLogo from '../../../../Home/images/pesoLogo.png';


// Add loading animation styles
const styles = `
  @keyframes pulse-zoom {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  .loading-logo {
    animation: pulse-zoom 1.5s ease-in-out infinite;
  }
`;

const TrainingSearch = ({ isCollapsed }) => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch all trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setIsLoading(true);
        if (auth.token) {
          const response = await axios.get("/api/all-training-postings", {
            auth: { username: auth.token },
          });

          console.log("API Response for All Trainings:", response.data); // Log API response

          if (response.data && Array.isArray(response.data.training_postings)) {
            const formattedTrainings = response.data.training_postings.map((t) => ({
              ...t,
              training_id: t.training_id.toString(), // Ensure training IDs are strings
            }));

            setTrainings(formattedTrainings);

            // Auto-select first training
            if (formattedTrainings.length > 0 && !selectedTraining) {
              setSelectedTraining(formattedTrainings[0]);
            }
          } else {
            setTrainings([]);
            toast.error("No trainings found or invalid response format");
          }
        }
      } catch (error) {
        console.error("Error fetching training postings:", error);
        toast.error("Failed to load training postings");
        setTrainings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, [auth.token]);

  // Filter and sort trainings
  useEffect(() => {
    let updatedTrainings = [...trainings];

    // Text search filter
    if (query) {
      updatedTrainings = updatedTrainings.filter(
        (t) =>
          t.training_title.toLowerCase().includes(query.toLowerCase()) ||
          t.training_description.toLowerCase().includes(query.toLowerCase()) ||
          (t.city_municipality &&
            t.city_municipality.toLowerCase().includes(query.toLowerCase())) ||
          (t.country &&
            t.country.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Experience level filter
    if (entryLevel) {
      updatedTrainings = updatedTrainings.filter(
        (t) => t.experience_level === entryLevel
      );
    }

    // Training type filter
    if (trainingType) {
      updatedTrainings = updatedTrainings.filter(
        (t) => t.training_type === trainingType
      );
    }

    // Sort options
    if (sortBy === "Most Recent") {
      updatedTrainings.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Cost") {
      updatedTrainings.sort(
        (a, b) => (b.estimated_cost_from || 0) - (a.estimated_cost_from || 0)
      );
    }

    setFilteredTrainings(updatedTrainings);

    // If the currently selected training is no longer in the filtered list,
    // either clear the selection or select the first available training
    if (
      selectedTraining &&
      !updatedTrainings.some(
        (training) => training.training_id === selectedTraining.training_id
      )
    ) {
      if (updatedTrainings.length > 0) {
        setSelectedTraining(updatedTrainings[0]);
      } else {
        setSelectedTraining(null);
      }
    }
  }, [query, entryLevel, trainingType, sortBy, trainings, selectedTraining]);

  
  const handleTrainingClick = (trainingId) => {
    const training = trainings.find((t) => t.training_id === trainingId);
    setSelectedTraining(training);
  };
{/* 
  // Format cost for display
  const formatCost = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };
*/}
  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {/* Modern Thin Header */}      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-2 sm:px-6 py-2 gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Training Programs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find and enroll in training opportunities</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{filteredTrainings.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Available Programs</span>
        </div>
      </header>

      {/* Unified Filter/Search Row */}
      <div className="w-full bg-[#1a237e] dark:bg-[#0d1544] shadow-lg sm:shadow-xl py-4 px-2 sm:px-4">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex flex-row items-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full shadow-none h-10 w-full max-w-xl">
            <span className="pl-3 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search trainings, locations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-full px-0"
            />
          </div>
          <select
            value={entryLevel}
            onChange={(e) => setEntryLevel(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Mid</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={trainingType}
            onChange={(e) => setTrainingType(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <option value="">Type</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full sm:w-auto"
          >            <option value="">Sort</option>
            <option value="Most Recent">Recent</option>
            <option value="Cost">Cost</option>
          </select>
        </div>      </div>      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto">
        {/* Training List - Left Side */}
        <div className="flex-1 flex flex-col min-w-0 order-last lg:order-none">
          <div className="flex justify-between items-center mb-2 px-1">
          {/*
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {filteredTrainings.length} trainings found
            </Typography>
            */}
          </div>

          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-40 gap-2 sm:gap-4">
                <img
                  src={logoNav}
                  alt="IPEPS Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 loading-logo"
                />
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
                  Loading Trainings...
                </Typography>
              </div>
            ) : filteredTrainings.length === 0 ? (
              <div className="flex justify-center items-center h-32 sm:h-40">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No trainings found matching your criteria
                </p>
              </div>
            ) : (              
              filteredTrainings.map((training) => (
                <div
                  key={training.training_id}
                  onClick={() => handleTrainingClick(training.training_id)}
                  className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border ${
                    selectedTraining?.training_id === training.training_id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  } p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={training.providerImage || "http://bij.ly/4ib59B1"}
                        alt={training.training_title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {training.training_title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {training.training_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {training.experience_level || "Any Level"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {training.city_municipality}, {training.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>             
                ))
            )}
          </div>
        </div>
        
        {/* Training Details - Right Side */}
        {selectedTraining && (
          <div className="w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 lg:mb-0 h-fit self-start lg:sticky lg:top-8 order-first lg:order-none">
            <TrainingView training={selectedTraining} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSearch;