import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import TrainingView from "./TrainingView";
import SearchData from "../../../components/layout/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainingSearch = ({ isCollapsed }) => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedTrainingIds, setAppliedTrainingIds] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load applied trainings to know which trainings user has applied to
  const loadAppliedTrainings = async () => {
    if (!auth.token) return;

    try {
      const response = await axios.get("/api/get-applied-trainings", {
        auth: { username: auth.token },
      });

      console.log("API Response for Applied Trainings:", response.data); // Log API response

      if (response.data.success && Array.isArray(response.data.applications)) {
        const appliedIds = response.data.applications.map(
          (application) => application.employer_trainingpost_id.toString() // Ensure IDs are strings
        );
        console.log("Extracted Applied Training IDs:", appliedIds); // Log extracted IDs
        setAppliedTrainingIds(appliedIds);
      }
    } catch (error) {
      console.error("Error fetching applied trainings:", error);
    }
  };

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
          } else {
            setTrainings([]);
            toast.error("No trainings found or invalid response format");
          }

          await loadAppliedTrainings();
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
        (a, b) =>
          (b.estimated_cost_from || 0) - (a.estimated_cost_from || 0)
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



  return (
    <div className="">
      <ToastContainer />

      {/* Search */}
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={3}
        componentData={[
          {
            title: "Experience Level",
            options: ["", "Beginner", "Intermediate", "Advanced"],
          },
          {
            title: "Training Type",
            options: ["", "Online", "In-Person", "Hybrid"],
          },
          {
            title: "Sort By",
            options: ["", "Most Recent", "Cost"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setEntryLevel(value);
          if (index === 1) setTrainingType(value);
          if (index === 2) setSortBy(value);
        }}
      />

      <div className="flex mt-4">
        {/* Training List */}
        <div
          className={`${selectedTraining ? "w-3/5" : "w-full"
            } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700 `}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {filteredTrainings.length} trainings found
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                Loading trainings...
              </p>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">
                No trainings found matching your criteria
              </p>
            </div>
          ) : (
            filteredTrainings.map((training) => (
              <div
                key={training.training_id}
                className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${selectedTraining?.training_id === training.training_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
                  } hover:bg-primary-400 dark:hover:bg-primary-600`}
                onClick={() => handleTrainingClick(training.training_id)}
              >
                <div className="flex gap-3">
                  {/* Provider Logo */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={training.providerImage || "http://bij.ly/4ib59B1"}
                      alt={training.training_title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Training Info */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {training.training_title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {training.training_description}
                    </div>
                  </div>

                  {/* Application Status Indicator */}
                  {appliedTrainingIds.includes(training.training_id) && (
                    <div className="flex items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enrolled
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Training Details View */}
        {selectedTraining && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <TrainingView
              training={selectedTraining}
              isEnrolled={appliedTrainingIds.includes(selectedTraining.employer_trainingpost_id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSearch;