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
  const [savedScholarshipIds, setSavedScholarshipIds] = useState([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load saved scholarships
  const loadSavedScholarships = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-saved-scholarships", {
        auth: { username: auth.token },
      });

      if (response.data.success && Array.isArray(response.data.scholarships)) {
        const savedIds = response.data.scholarships.map(
          (s) => s.employer_scholarshippost_id
        );
        setSavedScholarshipIds(savedIds);
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
    }
  };

  // Load applied scholarships
  const loadAppliedScholarships = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-applied-scholarships", {
        auth: { username: auth.token },
      });

      if (
        response.data.success &&
        Array.isArray(response.data.applications)
      ) {
        const appliedIds = response.data.applications.map(
          (a) => a.employer_scholarshippost_id
        );
        setAppliedScholarshipIds(appliedIds);
      }
    } catch (error) {
      console.error("Error fetching applied scholarships:", error);
    }
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
          const scholarshipList = response.data.scholarship_postings;
          setScholarships(scholarshipList);

          if (scholarshipList.length > 0 && !selectedScholarship) {
            setSelectedScholarship(scholarshipList[0]);
          }

          await Promise.all([
            loadSavedScholarships(),
            loadAppliedScholarships(),
          ]);
        } else {
          setScholarships([]);
          toast.error("No scholarships found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to load scholarships");
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

    // If selected scholarship is not in filtered list, update selection
    if (
      selectedScholarship &&
      !updatedScholarships.some(
        (s) => s.scholarship_id === selectedScholarship.scholarship_id
      )
    ) {
      if (updatedScholarships.length > 0) {
        setSelectedScholarship(updatedScholarships[0]);
      } else {
        setSelectedScholarship(null);
      }
    }
  }, [query, entryLevel, scholarshipType, sortBy, scholarships, selectedScholarship]);

  const handleScholarshipClick = (scholarshipId) => {
    const scholarship = scholarships.find(
      (s) => s.scholarship_id === scholarshipId
    );
    setSelectedScholarship(scholarship);
  };

  const handleSaveScholarship = async (scholarshipId) => {
    try {
      const response = await axios.post(
        "/api/save-scholarship",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setSavedScholarshipIds((prev) =>
        prev.includes(scholarshipId)
          ? prev.filter((id) => id !== scholarshipId)
          : [...prev, scholarshipId]
      );

      toast.success(
        savedScholarshipIds.includes(scholarshipId)
          ? "Scholarship removed from saved"
          : "Scholarship saved successfully"
      );
    } catch (error) {
      toast.error("Failed to save/unsave scholarship");
    }
  };

  const handleApplyScholarship = async (scholarshipId) => {
    try {
      const checkResponse = await axios.post(
        "/api/check-scholarship-status",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (checkResponse.data.is_applied) {
        toast.info("You have already applied for this scholarship");
        return;
      }

      const applyResponse = await axios.post(
        "/api/apply-scholarships",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      if (applyResponse.data.application_id) {
        setAppliedScholarshipIds([...appliedScholarshipIds, scholarshipId]);
        toast.success("Application submitted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div>
      <ToastContainer />

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
                key={scholarship.scholarship_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedScholarship?.scholarship_id ===
                  scholarship.scholarship_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() =>
                  handleScholarshipClick(scholarship.scholarship_id)
                }
              >
                <div className="flex gap-3">
                  {/* Logo */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={scholarship.logo || "http://bij.ly/4ib59B1"}
                      alt={scholarship.scholarship_title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {scholarship.scholarship_title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {scholarship.scholarship_description}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {scholarship.employer.full_name || "N/A"}
                    </div>
                  </div>

                  {/* Applied Status */}
                  {appliedScholarshipIds.includes(
                    scholarship.scholarship_id
                  ) && (
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
              isSaved={savedScholarshipIds.includes(
                selectedScholarship.scholarship_id
              )}
              isApplied={appliedScholarshipIds.includes(
                selectedScholarship.scholarship_id
              )}
              onSave={() =>
                handleSaveScholarship(selectedScholarship.scholarship_id)
              }
              onApply={() =>
                handleApplyScholarship(selectedScholarship.scholarship_id)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipSearch;