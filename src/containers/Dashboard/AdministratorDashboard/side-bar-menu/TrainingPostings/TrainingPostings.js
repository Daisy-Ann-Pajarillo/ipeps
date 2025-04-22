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
  const [adminRemarks, setAdminRemarks] = useState({});
  const [selectedTraining, setSelectedTraining] = useState(null);
  const itemsPerPage = 6; // Show exactly 6 trainings per page

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("/api/public/all-postings", {
        auth: {
          username: auth.token,
        },
      });
      const trainingData = response.data.training_postings.data;
      setTrainings(trainingData);
      // Auto-select first training
      if (trainingData.length > 0 && !selectedTraining) {
        setSelectedTraining(trainingData[0]);
      }
    } catch (error) {
      console.error("Error fetching postings:", error);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchTrainings();
    }
  }, [auth.token]);

  const updateTrainingStatus = async (trainingId, newStatus) => {
    await axios
      .put(
        "/api/update-posting-status",
        {
          posting_type: "training",
          posting_id: trainingId,
          status: newStatus,
          remarks: adminRemarks[trainingId] || "" // Include remarks in the request
        },
        { auth: { username: auth.token } }
      )
      .then((response) => {
        if (response.data.success) {
          toast.info(
            `Job post ${newStatus === "active" ? "accepted" : newStatus}`
          );
          // Clear remarks after successful update
          setAdminRemarks(prev => {
            const newRemarks = { ...prev };
            delete newRemarks[trainingId];
            return newRemarks;
          });
          fetchTrainings();
        }
      })
      .catch(() => toast.info("Failed to update training posting."));
  };

  const handleRemarksChange = (trainingId, value) => {
    setAdminRemarks(prev => ({
      ...prev,
      [trainingId]: value
    }));
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

  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    const statusOrder = { pending: 1, active: 2, rejected: 3, expired: 4 };
    return (statusOrder[a.status?.toLowerCase()] || 5) - (statusOrder[b.status?.toLowerCase()] || 5);
  });

  // Get current trainings based on pagination
  const indexOfLastTraining = currentPage * itemsPerPage;
  const indexOfFirstTraining = indexOfLastTraining - itemsPerPage;
  const currentTrainings = sortedTrainings.slice(
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

  const viewTraining = (training) => {
    setSelectedTraining(training);
  };

  const backToList = () => {
    setSelectedTraining(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {selectedTraining ? (
        <div className="space-y-6">
          <button
            onClick={backToList}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <NavigateBeforeIcon className="h-4 w-4 mr-2" />
            Back to Training Postings
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Training Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Training Title
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedTraining.title}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Organization
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedTraining.employer?.company_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </h3>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded-md text-white text-sm
                      ${selectedTraining.status === "pending" ? "bg-orange-500" : ""}
                      ${selectedTraining.status === "active" ? "bg-green-500" : ""}
                      ${selectedTraining.status === "expired" ? "bg-neutral-500" : ""}
                      ${selectedTraining.status === "rejected" ? "bg-red-500" : ""}`}>
                      {selectedTraining.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedTraining.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Admin Remarks
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedTraining.remarks || "No remarks provided."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Available Slots
                  </h3>
                  <p className="mt-1">
                    <span className="px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100">
                      {selectedTraining.slots}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Expiration Date
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedTraining.expiration_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Training Description
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedTraining.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
            {currentTrainings.map((training) => (
              <div
                key={training.id}
                className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  <h4 className={`absolute top-3 right-3 rounded-md uppercase text-[10px] px-2 py-1 text-white
                    ${training.status === "pending" ? "bg-orange-500" : ""}
                    ${training.status === "active" ? "bg-green-500" : ""}
                    ${training.status === "expired" ? "bg-neutral-500" : ""}
                    ${training.status === "rejected" ? "bg-red-500" : ""}`}
                  >
                    {training.status}
                  </h4>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {training.title || "Unknown Title"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {training.employer?.company_name || "Unknown Organization"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm line-clamp-3">
                    {training.description || "No description available."}
                  </p>
                </div>

                {training.status === "pending" && (
                  <div className="mt-5">
                    <label
                      htmlFor={`admin-remarks-${training.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Admin Remarks
                    </label>
                    <textarea
                      id={`admin-remarks-${training.id}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows="2"
                      placeholder="Add your remarks here..."
                      value={adminRemarks[training.id] || ""}
                      onChange={(e) => handleRemarksChange(training.id, e.target.value)}
                    />
                  </div>
                )}

                <div className="flex space-x-3 mt-5">
                  {training.status === "pending" && (
                    <>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                        onClick={() => updateTrainingStatus(training.id, "active")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                        onClick={() => updateTrainingStatus(training.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => viewTraining(training)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 flex items-center ${currentPage === 1
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
            className={`px-4 py-2 flex items-center ${currentPage >= Math.ceil(filteredTrainings.length / itemsPerPage)
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