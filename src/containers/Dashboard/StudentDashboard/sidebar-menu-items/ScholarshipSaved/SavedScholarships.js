import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedScholarshipsView from "./SavedScholarshipView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedScholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load applied scholarships to check which scholarships the user has already applied for
  const loadAppliedScholarships = async () => {
    try {
      if (auth.token) {
        const response = await axios.get("/api/get-applied-scholarships", {
          auth: { username: auth.token },
        });
        if (
          response.data.success &&
          Array.isArray(response.data.applications)
        ) {
          // Extract just the scholarship IDs from applied scholarships
          const appliedIds = response.data.applications.map(
            (app) => app.scholarship_id
          );
          setAppliedScholarshipIds(appliedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching applied scholarships:", error);
    }
  };

  // Load saved scholarships
  const loadSavedScholarships = async () => {
    try {
      setIsLoading(true);
      if (auth.token) {
        const response = await axios.get("/api/get-saved-scholarships", {
          auth: { username: auth.token },
        });
        if (
          response.data.success &&
          Array.isArray(response.data.scholarships)
        ) {
          // Map backend data to component format
          const scholarships = response.data.scholarships.map((scholarship) => ({
            saved_scholarship_id: scholarship.saved_scholarship_id,
            employer_scholarshippost_id: scholarship.employer_scholarshippost_id,
            scholarship_id: scholarship.employer_scholarshippost_id, // Add scholarship_id field for compatibility
            scholarship_title: scholarship.scholarship_title,
            scholarship_description: scholarship.scholarship_description,
            scholarship_type: scholarship.scholarship_type,
            amount: scholarship.amount,
            deadline: scholarship.deadline,
            country: scholarship.country,
            city_municipality: scholarship.city_municipality,
            created_at: scholarship.created_at,
            logo: scholarship.logo_url || "http://bij.ly/4ib59B1",
          }));
          setSavedScholarships(scholarships);
          if (scholarships.length > 0 && !selectedScholarship) {
            setSelectedScholarship(scholarships[0]);
          }
        } else {
          setSavedScholarships([]);
          setSelectedScholarship(null);
        }
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
      toast.error(error.response?.data?.message || "Failed to load saved scholarships");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadSavedScholarships();
      loadAppliedScholarships();
    }
  }, [auth.token]);

  // Filter scholarships based on search query
  const filteredScholarships = savedScholarships.filter(
    (scholarship) =>
      scholarship.scholarship_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.scholarship_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.city_municipality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort scholarships based on selected option
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "Amount") {
      return (b.amount || 0) - (a.amount || 0);
    } else if (sortBy === "Deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });

  // Handle scholarship application
  const handleApplyScholarship = async (scholarshipId) => {
    try {
      const response = await axios.post(
        "/api/apply-scholarship",
        {
          employer_scholarshippost_id: scholarshipId,
        },
        {
          auth: { username: auth.token },
        }
      );
      if (response.data.success) {
        toast.success("Successfully applied to scholarship");
        // Update the applied scholarships list
        setAppliedScholarshipIds([...appliedScholarshipIds, scholarshipId]);
        // Refresh saved scholarships to get updated status
        loadSavedScholarships();
      }
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      toast.error(error.response?.data?.message || "Failed to apply for scholarship");
    }
  };

  // Handle scholarship removal from saved scholarships
  const handleRemoveFromSaved = async (scholarshipId) => {
    try {
      await axios.post(
        "/api/saved-scholarships",
        {
          employer_scholarshippost_id: scholarshipId,
        },
        {
          auth: { username: auth.token },
        }
      );
      const updatedScholarships = savedScholarships.filter(
        (scholarship) => scholarship.employer_scholarshippost_id !== scholarshipId
      );
      setSavedScholarships(updatedScholarships);
      if (selectedScholarship?.employer_scholarshippost_id === scholarshipId) {
        setSelectedScholarship(updatedScholarships[0] || null);
      }
      toast.success("Scholarship removed from saved");
    } catch (error) {
      console.error("Error removing saved scholarship:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove scholarship from saved list"
      );
    }
  };

  // Handle scholarship selection for detailed view
  const handleSelectScholarship = (scholarship) => {
    setSelectedScholarship(scholarship);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      {/* Search Bar */}
      <SearchData
        placeholder="Search saved scholarships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          {
            title: "Sort By",
            options: ["", "Most Recent", "Amount", "Deadline"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setSortBy(value);
        }}
      />
      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - Scholarship List */}
        <div
          className={`${selectedScholarship ? "w-3/5" : "w-full"
            } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700`}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {sortedScholarships.length} saved scholarships
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                Loading saved scholarships...
              </p>
            </div>
          ) : sortedScholarships.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No saved scholarships found
              </p>
            </div>
          ) : (
            sortedScholarships.map((scholarship) => (
              <div
                key={scholarship.saved_scholarship_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedScholarship?.saved_scholarship_id === scholarship.saved_scholarship_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() => handleSelectScholarship(scholarship)}
              >
                <div className="flex gap-3">
                  {/* Scholarship Logo */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={scholarship.logo || "http://bij.ly/4ib59B1"}
                      alt={scholarship.scholarship_title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  {/* Scholarship Info */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {scholarship.scholarship_title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {scholarship.country} • {scholarship.city_municipality}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      💰 {scholarship.amount || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ⏳ Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  {/* Remove Button */}
                  <button
                    className="text-red-500 hover:text-red-700 self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(scholarship.employer_scholarshippost_id);
                    }}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Right Panel - Scholarship Details */}
        {selectedScholarship && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <SavedScholarshipsView
              scholarship={selectedScholarship}
              isApplied={appliedScholarshipIds.includes(
                selectedScholarship.employer_scholarshippost_id
              )}
              onApply={() => handleApplyScholarship(selectedScholarship.employer_scholarshippost_id)}
              onRemoveSaved={() =>
                handleRemoveFromSaved(selectedScholarship.employer_scholarshippost_id)
              }
              onScholarshipStatusChanged={() => {
                loadSavedScholarships();
                loadAppliedScholarships();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedScholarships;