import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Grid,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { tokens } from "../../../theme";
import ScholarshipView from "./ScholarshipView";
import {
  School,
  AccessTime,
  Payment,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import SearchData from "../../../components/layout/Search";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScholarshipSearch = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedScholarships, setSavedScholarships] = useState({});
  const [appliedScholarships, setAppliedScholarships] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load saved and applied scholarships
  useEffect(() => {
    const loadSavedAndApplied = () => {
      const savedList = JSON.parse(localStorage.getItem("savedScholarships") || "{}");
      const appliedItems = JSON.parse(localStorage.getItem("appliedItems") || "{}");
      setSavedScholarships(savedList);
      setAppliedScholarships(appliedItems);
    };
    loadSavedAndApplied();
  }, []);

  // Fetch all scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/all-scholarship-postings", {
          auth: { username: auth.token },
        });

        if (response.data && Array.isArray(response.data.scholarship_postings)) {
          setScholarships(response.data.scholarship_postings);
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

    fetchScholarships();
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
      updatedScholarships.sort(
        (a, b) =>
          (b.amount || 0) - (a.amount || 0)
      );
    }

    setFilteredScholarships(updatedScholarships);

    // If the currently selected scholarship is no longer in the filtered list,
    // either clear the selection or select the first available scholarship
    if (
      selectedScholarship &&
      !updatedScholarships.some(
        (scholarship) => scholarship.scholarship_id === selectedScholarship.scholarship_id
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
    const scholarship = scholarships.find((s) => s.scholarship_id === scholarshipId);
    setSelectedScholarship(scholarship);
  };

  const handleSaveScholarship = async (scholarshipId) => {
    const isSaving = !savedScholarships[scholarshipId];
    try {
      await axios.post(
        "/api/save-scholarship",
        { employer_scholarshippost_id: scholarshipId },
        {
          headers: { "Content-Type": "application/json" },
          auth: { username: auth.token },
        }
      );
      setSavedScholarships((prev) => {
        const newSaved = { ...prev, [scholarshipId]: isSaving };
        localStorage.setItem("savedScholarships", JSON.stringify(newSaved));
        if (isSaving) {
          toast.success("Scholarship Saved Successfully");
        } else {
          toast.info("Scholarship Unsaved");
        }
        return newSaved;
      });
    } catch (error) {
      console.error("Error saving scholarship:", error);
      toast.error("Failed to Save Scholarship");
    }
  };

  const handleApplyScholarship = async (scholarshipId) => {
    try {
      await axios.post(
        "/api/apply-scholarships",
        { employer_scholarshippost_id: scholarshipId },
        { auth: { username: auth.token } }
      );

      setAppliedScholarships((prev) => {
        const newApplied = { ...prev, [scholarshipId]: true };
        localStorage.setItem("appliedItems", JSON.stringify(newApplied));
        toast.success("Application Submitted Successfully");
        return newApplied;
      });
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      toast.error("Failed to Apply for Scholarship");
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
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedScholarship?.scholarship_id === scholarship.scholarship_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() => handleScholarshipClick(scholarship.scholarship_id)}
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
                  {appliedScholarships[scholarship.scholarship_id] && (
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
              isSaved={savedScholarships[selectedScholarship.scholarship_id]}
              isApplied={appliedScholarships[selectedScholarship.scholarship_id]}
              onSave={() => handleSaveScholarship(selectedScholarship.scholarship_id)}
              onApply={() => handleApplyScholarship(selectedScholarship.scholarship_id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipSearch;