import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import SearchData from "../../../components/layout/Search";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const TrainingPostings = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [trainings, setTrainings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show exactly 6 trainings per page

  const fetchTrainings = () => {
    axios
      .get("/api/public/all-postings", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setTrainings(response.data.training_postings.data);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  };

  useEffect(() => {
    fetchTrainings();
  }, [auth.token]);

  const updateTrainingStatus = async (trainingId, newStatus) => {
    await axios
      .put(
        "/api/update-posting-status",
        {
          posting_type: "training",
          posting_id: trainingId,
          status: newStatus,
        },
        { auth: { username: auth.token } }
      )
      .then((response) => {
        if (response.data.success) {
          toast.info(
            `Job post ${newStatus === "active" ? "accepted" : newStatus}`
          );
          fetchTrainings();
        }
      })
      .catch(() => toast.info("Failed to update training posting."));
  };

  const filteredTrainings = trainings.filter((training) => {
    const matchesQuery =
      query === "" ||
      training.title?.toLowerCase().includes(query.toLowerCase());
    const matchesCompany =
      company === "" ||
      training.employer.company_name?.toLowerCase() === company.toLowerCase();
    const matchesStatus =
      status === "" || training.status?.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesCompany && matchesStatus;
  });

  // Get current trainings based on pagination
  const indexOfLastTraining = currentPage * itemsPerPage;
  const indexOfFirstTraining = indexOfLastTraining - itemsPerPage;
  const currentTrainings = filteredTrainings.slice(
    indexOfFirstTraining,
    indexOfLastTraining
  );

  // Change page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredTrainings.length / itemsPerPage))
    );
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <SearchData
        placeholder="Search trainings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        componentData={[
          {
            title: "Status",
            options: ["", ...new Set(trainings.map((t) => t.status))],
          },
          {
            title: "Company",
            options: [
              "",
              ...new Set(trainings.map((t) => t.employer.company_name)),
            ],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setStatus(value);
          if (index === 1) setCompany(value);
        }}
      />
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Count display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Training Postings
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredTrainings.length > 0 ? indexOfFirstTraining + 1 : 0}-
          {Math.min(indexOfLastTraining, filteredTrainings.length)} of{" "}
          {filteredTrainings.length}
        </div>
      </div>

      {/* Display exactly 6 trainings per page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentTrainings.length > 0 ? (
          currentTrainings.map((training) => (
            <div
              key={training.id}
              className="relative p-4 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs text-white rounded-md uppercase ${
                  training.status === "pending"
                    ? "bg-orange-500"
                    : training.status === "active"
                    ? "bg-green-500"
                    : training.status === "expired"
                    ? "bg-gray-500"
                    : "bg-red-500"
                }`}
              >
                {training.status}
              </span>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {training.title || "Unknown Title"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {training.employer?.company_name || "Unknown Organization"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {training.description || "No description available."}
              </p>
              <div className="mt-4 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Expiration Date:</span>{" "}
                  {training.expiration_date || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Employer:</span>{" "}
                  {training.employer?.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {training.location || "Unknown Location"}
                </p>
                <p>
                  <span className="font-semibold">Skills Gained:</span>{" "}
                  {training.skills_gained || "N/A"}
                </p>
              </div>
              {training.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => updateTrainingStatus(training.id, "active")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() =>
                      updateTrainingStatus(training.id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center w-full">No trainings found.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 flex items-center ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <NavigateBeforeIcon fontSize="small" className="mr-1" />
            Previous
          </button>

          <div className="px-4 py-2 border-l border-r border-gray-200">
            Page {currentPage} of{" "}
            {Math.max(1, Math.ceil(filteredTrainings.length / itemsPerPage))}
          </div>

          <button
            onClick={nextPage}
            disabled={
              currentPage >= Math.ceil(filteredTrainings.length / itemsPerPage)
            }
            className={`px-4 py-2 flex items-center ${
              currentPage >= Math.ceil(filteredTrainings.length / itemsPerPage)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
            <NavigateNextIcon fontSize="small" className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPostings;



