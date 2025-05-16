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
  const [employerName, setEmployerName] = useState(""); // Store employer full name

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

            // Extract employer full name from first item or default
            const fullName = formattedTrainings.length > 0
              ? formattedTrainings[0].employer?.full_name || "Unknown Provider"
              : "Unknown Provider";

            setEmployerName(fullName);

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
          (t.provider &&
            t.provider.toLowerCase().includes(query.toLowerCase())) ||
          (t.country &&
            t.country.toLowerCase().includes(query.toLowerCase())) ||
          (t.city_municipality &&
            t.city_municipality.toLowerCase().includes(query.toLowerCase()))
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

  // Format cost for display
  const formatCost = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };

  // Add styles to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Centered Header Section */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-800 dark:to-purple-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-lg flex flex-col items-center text-center">
        <Typography variant="h4" className="text-white font-bold mb-2 text-lg sm:text-2xl md:text-3xl">
          Explore Training Programs
        </Typography>
        <Typography variant="subtitle1" className="text-purple-100 mb-4 text-xs sm:text-base md:text-lg">
          Enhance your skills with our curated training opportunities
        </Typography>

        {/* Modern Search & Filter Section - Unified with JobSearch */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 -mb-12 sm:-mb-16 md:-mb-20 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search trainings..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
              />
            </div>
            {/* Filters */}
            <select
              value={entryLevel}
              onChange={(e) => setEntryLevel(e.target.value)}
              className="px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
            >
              <option value="">Experience Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
              className="px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-xs sm:text-sm transition-all duration-200"
            >
              <option value="">Training Type</option>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section with responsive layout */}
      <div className="flex flex-col lg:flex-row p-2 sm:p-4 md:p-8 pt-8 sm:pt-12 md:pt-14 gap-6 md:gap-8">
        {/* Training Details (top on mobile, right on desktop) */}
        {selectedTraining && (
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:order-2">
            <TrainingView training={selectedTraining} />
          </div>
        )}
        {/* Training List */}
        <div className={`${selectedTraining ? "lg:w-3/5" : "w-full"} pr-0 lg:pr-6 lg:order-1`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {filteredTrainings.length} trainings found
            </Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm"
            >
              <option value="">Sort By</option>
              <option value="Most Recent">Most Recent</option>
              <option value="Cost">Cost</option>
            </select>
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
                  } p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={training.providerImage || "http://bij.ly/4ib59B1"}
                        alt={training.training_title}
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {training.training_title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {training.provider || ""}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {training.training_type || "Not specified"}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {training.experience_level || "Any Level"}
                        </span>
                      </div>
                      {training.employer?.full_name && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Posted by: {training.employer.full_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSearch;