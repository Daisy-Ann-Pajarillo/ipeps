import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import ScholarshipView from "./ScholarshipView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";

const ScholarshipSearch = ({ isCollapsed }) => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState({});
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Check saved and applied status for each scholarship
  const checkScholarshipStatuses = async (scholarshipList) => {
    const savedIds = {};
    const appliedIds = {};

    if (auth.token && scholarshipList.length > 0) {
      // Get user's saved scholarships to check saved status
      try {
        const savedResponse = await axios.get("/api/get-saved-scholarships", {
          auth: { username: auth.token },
        });

        if (
          savedResponse.data.success &&
          Array.isArray(savedResponse.data.scholarships)
        ) {
          // Create a map of saved scholarship IDs
          savedResponse.data.scholarships.forEach((item) => {
            savedIds[item.employer_scholarshippost_id] = true;
          });
        }
      } catch (error) {
        console.error("Error fetching saved scholarships:", error);
      }

      // Get user's applied scholarships to check applied status
      try {
        const appliedResponse = await axios.get(
          "/api/get-applied-scholarships",
          {
            auth: { username: auth.token },
          }
        );

        if (
          appliedResponse.data.success &&
          Array.isArray(appliedResponse.data.applications)
        ) {
          // Create a map of applied scholarship IDs
          appliedResponse.data.applications.forEach((item) => {
            appliedIds[item.employer_scholarshippost_id] = true;
          });
        }
      } catch (error) {
        console.error("Error fetching applied scholarships:", error);
      }
    }

    setSavedScholarshipIds(savedIds);
    setAppliedScholarshipIds(appliedIds);
  };

  // Fetch all scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/all-scholarship-postings", {
          auth: { username: auth.token },
        });

        if (
          response.data &&
          Array.isArray(response.data.scholarship_postings)
        ) {
          const scholarshipList = response.data.scholarship_postings.map(
            (scholarship) => ({
              ...scholarship,
              // Ensure consistent ID property name
              employer_scholarshippost_id: scholarship.scholarship_id,
            })
          );

          setScholarships(scholarshipList);
          // Auto-select first scholarship
          if (scholarshipList.length > 0 && !selectedScholarship) {
            setSelectedScholarship(scholarshipList[0]);
          }

          // Check which scholarships are saved/applied
          await checkScholarshipStatuses(scholarshipList);
        } else {
          setScholarships([]);
          toast.error("No scholarships found or invalid response format", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to load scholarships", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setScholarships([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.token) {
      fetchScholarships();
    }
  }, [auth.token]);

  // Filter and sort scholarships
  useEffect(() => {
    let updatedScholarships = [...scholarships];

    // Text search filter
    if (query) {
      updatedScholarships = updatedScholarships.filter(
        (s) =>
          s.scholarship_title.toLowerCase().includes(query.toLowerCase()) ||
          s.scholarship_description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Experience level filter
    if (entryLevel) {
      updatedScholarships = updatedScholarships.filter(
        (s) => s.experience_level === entryLevel
      );
    }

    // Scholarship type filter
    if (scholarshipType) {
      updatedScholarships = updatedScholarships.filter(
        (s) => s.scholarship_type === scholarshipType
      );
    }

    // Sort options
    if (sortBy === "Most Recent") {
      updatedScholarships.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Amount") {
      updatedScholarships.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    }

    setFilteredScholarships(updatedScholarships);

    // If the currently selected scholarship is no longer in the filtered list,
    // either clear the selection or select the first available scholarship
    if (
      selectedScholarship &&
      !updatedScholarships.some(
        (scholarship) =>
          scholarship.employer_scholarshippost_id ===
          selectedScholarship.employer_scholarshippost_id
      )
    ) {
      if (updatedScholarships.length > 0) {
        setSelectedScholarship(updatedScholarships[0]);
      } else {
        setSelectedScholarship(null);
      }
    }
  }, [
    query,
    entryLevel,
    scholarshipType,
    sortBy,
    scholarships,
    selectedScholarship,
  ]);

  const handleScholarshipClick = (scholarshipId) => {
    const scholarship = scholarships.find(
      (s) => s.employer_scholarshippost_id === scholarshipId
    );
    setSelectedScholarship(scholarship);
  };

  const handleSaveScholarship = async (scholarshipId) => {
    try {
      // This endpoint toggles the saved status (save/unsave)
      const response = await axios.post(
        "/api/save-scholarship",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      // Update state based on the current action (save or unsave)
      const isSaved = !savedScholarshipIds[scholarshipId];

      // Only update the saved status, preserve application status
      setSavedScholarshipIds((prev) => {
        const newSaved = { ...prev };
        if (isSaved) {
          newSaved[scholarshipId] = true;
        } else {
          delete newSaved[scholarshipId];
        }
        return newSaved;
      });

      // Show a single toast notification based on the action performed
      if (isSaved) {
        toast.success("Scholarship saved successfully", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      } else {
        toast.info("Scholarship removed from saved", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error saving/unsaving scholarship:", error);
      toast.error(
        error.response?.data?.error || "Failed to save/unsave scholarship",
        {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        }
      );
    }
  };

  const handleApplyScholarship = async (scholarshipId) => {
    try {
      // First check if already applied
      const checkResponse = await axios.post(
        "/api/check-scholarship-status",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (checkResponse.data.is_applied) {
        toast.info("You have already applied for this scholarship", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });

        // Update the applied state to reflect that it's applied
        setAppliedScholarshipIds((prev) => ({
          ...prev,
          [scholarshipId]: true,
        }));

        return;
      }

      // Apply for the scholarship
      const response = await axios.post(
        "/api/apply-scholarships",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (response.data.application_id) {
        // Update application state
        setAppliedScholarshipIds((prev) => ({
          ...prev,
          [scholarshipId]: true,
        }));

        toast.success("Application submitted successfully", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      if (
        error.response?.data?.error ===
        "You have already applied for this scholarship"
      ) {
        toast.info("You have already applied for this scholarship", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });

        // Update the applied state even in case of this error
        setAppliedScholarshipIds((prev) => ({
          ...prev,
          [scholarshipId]: true,
        }));
      } else {
        toast.error(
          error.response?.data?.error || "Failed to apply for scholarship",
          {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          }
        );
      }
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      {/* Search */}
      <SearchData
        placeholder="Find a scholarship..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={3}
        componentData={[
          {
            title: "Experience Level",
            options: ["", "Undergraduate", "Graduate", "PhD"],
          },
          {
            title: "Scholarship Type",
            options: ["", "Full", "Partial", "Research Grant"],
          },
          {
            title: "Sort By",
            options: ["", "Most Recent", "Amount"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setEntryLevel(value);
          if (index === 1) setScholarshipType(value);
          if (index === 2) setSortBy(value);
        }}
      />

      <div className="flex mt-4">
        {/* Scholarship List */}
        <div
          className={`${selectedScholarship ? "w-3/5" : "w-full"
            } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700`}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {filteredScholarships.length} scholarships found
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                Loading scholarships...
              </p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No scholarships found matching your criteria
              </p>
            </div>
          ) : (
            filteredScholarships.map((scholarship) => (
              <div
                key={scholarship.employer_scholarshippost_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedScholarship?.employer_scholarshippost_id ===
                    scholarship.employer_scholarshippost_id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() =>
                  handleScholarshipClick(
                    scholarship.employer_scholarshippost_id
                  )
                }
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
                      {scholarship.scholarship_description}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      💰 {scholarship.amount || "N/A"}
                    </div>
                  </div>

                  {/* Application Status Indicator */}
                  {appliedScholarshipIds[
                    scholarship.employer_scholarshippost_id
                  ] && (
                      <div className="flex items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Applied
                        </span>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Scholarship Details View */}
        {selectedScholarship && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <ScholarshipView
              scholarship={selectedScholarship}
              isSaved={
                savedScholarshipIds[
                selectedScholarship.employer_scholarshippost_id
                ]
              }
              isApplied={
                appliedScholarshipIds[
                selectedScholarship.employer_scholarshippost_id
                ]
              }
              onSave={() =>
                handleSaveScholarship(
                  selectedScholarship.employer_scholarshippost_id
                )
              }
              onApply={() =>
                handleApplyScholarship(
                  selectedScholarship.employer_scholarshippost_id
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipSearch;
