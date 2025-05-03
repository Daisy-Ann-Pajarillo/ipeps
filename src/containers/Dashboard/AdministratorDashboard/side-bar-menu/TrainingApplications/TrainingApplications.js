import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  FilterList,
  ArrowBackIos,
  ArrowForwardIos,
  Visibility,
  CheckCircle,
  Cancel,
  School,
  BusinessCenter,
  CalendarToday,
} from "@mui/icons-material";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TrainingApplications = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    fetchTrainingApplications();
  }, [auth.token]);

  const fetchTrainingApplications = () => {
    axios
      .get("/api/get-all-users-applied-trainings", {
        auth: { username: auth.token },
      })
      .then((res) => {
        setApplications(res.data.applied_trainings || []);
      })
      .catch((err) => {
        console.error("Error fetching trainings:", err);
        toast.error("Failed to load training applications");
      });
  };
  const handleAcceptApplication = (applicationId) => {
    setIsLoading(true);

    // Find the application with the matching ID
    const applicationToUpdate = applications.find(
      (app) => app.application_id === applicationId
    );

    if (!applicationToUpdate) {
      console.error("Application not found for ID:", applicationId);
      toast.error("Application not found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Extract the user_id from the application's user_details
    const { user_id } = applicationToUpdate.user_details;

    // Log the payload for debugging
    console.log("Approving training application with data:", {
      application_id: applicationId,
      status: "approved",
      user_id: user_id,
    });

    axios
      .put(
        "/api/update-training-status", // Adjust the endpoint if needed
        {
          application_id: applicationId,
          status: "approved",
          user_id: user_id,
        },
        {
          auth: { username: auth.token }, // Authentication headers
        }
      )
      .then((res) => {
        toast.success("Application approved successfully");

        // Update local state
        const updatedApplications = applications.map((app) =>
          app.application_id === applicationId
            ? { ...app, application_status: "approved" }
            : app
        );
        setApplications(updatedApplications);

        // Update selected application if it's open
        if (selectedApp && selectedApp.application_id === applicationId) {
          setSelectedApp({ ...selectedApp, application_status: "approved" });
        }
      })
      .catch((err) => {
        console.error("Error approving application:", err);
        toast.error("Failed to approve application");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRejectApplication = (applicationId) => {
    setIsLoading(true);

    // Find the application with the matching ID
    const applicationToUpdate = applications.find(
      (app) => app.application_id === applicationId
    );

    if (!applicationToUpdate) {
      console.error("Application not found for ID:", applicationId);
      toast.error("Application not found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Extract the user_id from the application's user_details
    const { user_id } = applicationToUpdate.user_details;

    // Log the payload for debugging
    console.log("Rejecting training application with data:", {
      application_id: applicationId,
      status: "declined",
      user_id: user_id,
    });

    axios
      .put(
        "/api/update-training-status", // Adjust the endpoint if needed
        {
          application_id: applicationId,
          status: "declined",
          user_id: user_id,
        },
        {
          auth: { username: auth.token }, // Authentication headers
        }
      )
      .then((res) => {
        toast.success("Application rejected successfully");

        // Update local state
        const updatedApplications = applications.map((app) =>
          app.application_id === applicationId
            ? { ...app, application_status: "rejected" }
            : app
        );
        setApplications(updatedApplications);

        // Update selected application if it's open
        if (selectedApp && selectedApp.application_id === applicationId) {
          setSelectedApp({ ...selectedApp, application_status: "rejected" });
        }
      })
      .catch((err) => {
        console.error("Error rejecting application:", err);
        toast.error("Failed to reject application");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedApp(null);
  };

  const viewApplicationDetails = (app) => {
    setSelectedApp(app);
  };

  const backToList = () => {
    setSelectedApp(null);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesQuery =
      query === "" ||
      app.training_title?.toLowerCase().includes(query.toLowerCase());
    const matchesCompany =
      company === "" ||
      app.company_name?.toLowerCase() === company.toLowerCase();
    const matchesStatus =
      status === "" ||
      app.application_status?.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesCompany && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewApplicantDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/get-user-info/${userId}`, {
        auth: { username: auth.token },
      });
      setSelectedUserDetails(response.data);
      setOpenDetailDialog(true);
    } catch (error) {
      toast.error("Failed to load applicant details.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
    setSelectedUserDetails(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {selectedApp ? "Training Application Details" : "Training Applications"}
        </h1>

        {!selectedApp && (
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search training title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FilterList className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {!selectedApp && isFilterOpen && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {[...new Set(applications.map((app) => app.application_status))]
                  .filter(Boolean)
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {[...new Set(applications.map((app) => app.company_name))]
                  .filter(Boolean)
                  .map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {selectedApp ? (
        <div className="space-y-6">
          <button
            onClick={backToList}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowBackIos className="h-3 w-3 mr-2" />
            Back to Applications
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Training Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Training Title</h3>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">{selectedApp.training_title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedApp.company_name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <div className="mt-1">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedApp.application_status)}`}>
                      {selectedApp.application_status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Training Description</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedApp.training_description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Application ID</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedApp.application_id}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Date</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{formatDate(selectedApp.applied_at)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{formatDate(selectedApp.expired_at)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{formatDate(selectedApp.updated_at)}</p>
                </div>
              </div>
            </div>


            {selectedApp.user_details && (
              <>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Application Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                      <p className="mt-1 text-gray-900 dark:text-white font-medium">{selectedApp.user_details.fullname}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedApp.user_details.email}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h3>
                      <p className="mt-1 text-gray-900 dark:text-white font-medium">{selectedApp.user_details.job_preferences.country}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanent Address</h3>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedApp.user_details.personal_information.permanent_address.barangay || 'N/A'}, {selectedApp.user_details.personal_information.permanent_address.country}, {selectedApp.user_details.personal_information.permanent_address.municipality}, {selectedApp.user_details.personal_information.permanent_address.province}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Type</h3>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedApp.user_details.user_type}</p>
                    </div>

                  </div>
                </div>
                {/* Accept/Reject Action Buttons */}
                {selectedApp.application_status?.toLowerCase() === "pending" && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-4">
                    <button
                      onClick={() => handleRejectApplication(selectedApp.application_id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Cancel className="h-5 w-5 mr-2" />
                      {isLoading ? "Processing..." : "Reject Application"}
                    </button>
                    <button
                      onClick={() => handleAcceptApplication(selectedApp.application_id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 border border-transparent rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {isLoading ? "Processing..." : "Accept Application"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {currentItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <School className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search filters or check back later.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Training
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.map((app) => (
                      <tr key={app.application_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <School className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{app.training_title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {app.application_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <BusinessCenter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900 dark:text-white">{app.company_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(app.application_status)}`}>
                            {app.application_status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarToday className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(app.applied_at)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleAcceptApplication(app.application_id)}
                              disabled={isLoading}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Accept Application"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectApplication(app.application_id)}
                              disabled={isLoading}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Application"
                            >
                              <Cancel className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleViewApplicantDetails(app.user_details.user_id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              title="View Applicant Details"
                            >
                              <Visibility className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium">{filteredApplications.length > 0 ? indexOfFirstItem + 1 : 0}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredApplications.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredApplications.length}</span> applications
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <ArrowBackIos className="mr-1 h-3 w-3" />
                    Previous
                  </button>

                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${pageNum === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    Next
                    <ArrowForwardIos className="ml-1 h-3 w-3" />
                  </button>

                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="ml-1 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[5, 10, 25, 50].map((val) => (
                      <option key={val} value={val}>
                        {val} per page
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Applicant Details Dialog */}
      {/* User Details Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Applicant Information
          <Divider sx={{ my: 2 }} />

            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUserDetails ? (
            <Box sx={{ p: 3 }}>
              {/* ABOUT Section */}
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedUserDetails.user_id ?? "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {selectedUserDetails.username ?? "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedUserDetails.email ?? "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedUserDetails.user_type ?? "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Render sections based on user type */}
              {(() => {
                const userType = (selectedUserDetails.user_type || "").toUpperCase();

                // For ADMIN: Only show About section (already rendered above)
                if (userType === "ADMIN") {
                  return null;
                }

                // For EMPLOYER: Show Personal Information, but hide all other sections
                if (userType === "EMPLOYER") {
                  return (
                    <>
                      {/* PERSONAL INFORMATION Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Personal Information
                      </Typography>
                      {selectedUserDetails.personal_information ? (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Employer Personal Info ID</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.employer_personal_info_id || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.user_id || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Prefix</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.prefix || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.first_name || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Middle Name</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.middle_name || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.last_name || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Suffix</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.suffix || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.company_type || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Classification</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.company_classification || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Industry</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.company_industry || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Workforce</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.company_workforce || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.email || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Employer Position</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.employer_position || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Employer ID Number</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.employer_id_number || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary Country</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_country || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary Province</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_province || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary Municipality</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_municipality || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary Zip Code</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_zip_code || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary Barangay</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_barangay || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Temporary House/Street/Village</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.temporary_house_no_street_village || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Permanent Country</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.permanent_country || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Permanent Municipality</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.permanent_municipality || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Permanent Zip Code</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.permanent_zip_code || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Permanent Barangay</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.permanent_barangay || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Permanent House/Street/Village</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.permanent_house_no_street_village || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Cellphone Number</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.cellphone_number || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Landline Number</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.landline_number || "N/A"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Valid ID URL</Typography>
                            <Typography variant="body1">{selectedUserDetails.personal_information.valid_id_url || "N/A"}</Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No personal information available.
                        </Typography>
                      )}
                    </>
                  );
                }

                // For JOBSEEKER and STUDENT: Show everything
                if (["JOBSEEKER", "STUDENT"].includes(userType)) {
                  return (
                    <>
                      {/* PERSONAL INFORMATION Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Personal Information
                      </Typography>
                      {selectedUserDetails.personal_information ? (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Prefix
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.prefix || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              First Name
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.first_name || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Middle Name
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.middle_name || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Last Name
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.last_name || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Suffix
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.suffix || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Sex
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.sex || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Date of Birth
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.date_of_birth
                                ? new Date(selectedUserDetails.personal_information.date_of_birth).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Place of Birth
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.place_of_birth || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Civil Status
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.civil_status || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Height
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.height || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Weight
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.weight || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Religion
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.religion || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.cellphone_number || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No personal information available.
                        </Typography>
                      )}

                      {/* EDUCATIONAL BACKGROUND Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Educational Background
                      </Typography>
                      {selectedUserDetails.educational_background?.length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedUserDetails.educational_background.map((edu, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  School Name
                                </Typography>
                                <Typography variant="body1">  
                                  {edu.school_name || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Degree or Qualification
                                </Typography>
                                <Typography variant="body1">
                                  {edu.degree_or_qualification || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Field of Study
                                </Typography>
                                <Typography variant="body1">
                                  {edu.field_of_study || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Program Duration
                                </Typography>
                                <Typography variant="body1">
                                  {edu.program_duration || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date From
                                </Typography>
                                <Typography variant="body1">
                                  {edu.date_from
                                    ? new Date(edu.date_from).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date To
                                </Typography>
                                <Typography variant="body1">
                                  {edu.date_to
                                    ? new Date(edu.date_to).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No educational background available.
                        </Typography>
                      )}

                      {/* WORK EXPERIENCE Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Work Experience
                      </Typography>
                      {selectedUserDetails.work_experiences?.length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedUserDetails.work_experiences.map((work, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Company Name
                                </Typography>
                                <Typography variant="body1">
                                  {work.company_name || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Company Address
                                </Typography>
                                <Typography variant="body1">
                                  {work.company_address || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Position
                                </Typography>
                                <Typography variant="body1">
                                  {work.position || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Employment Status
                                </Typography>
                                <Typography variant="body1">
                                  {work.employment_status || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date Start
                                </Typography>
                                <Typography variant="body1">
                                  {work.date_start
                                    ? new Date(work.date_start).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date End
                                </Typography>
                                <Typography variant="body1">
                                  {work.date_end
                                    ? new Date(work.date_end).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No work experience available.
                        </Typography>
                      )}

                      {/* TRAININGS Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Trainings
                      </Typography>
                      {selectedUserDetails.trainings?.length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedUserDetails.trainings.map((training, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Course Name
                                </Typography>
                                <Typography variant="body1">
                                  {training.course_name || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Training Institution
                                </Typography>
                                <Typography variant="body1">
                                  {training.training_institution || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Start Date
                                </Typography>
                                <Typography variant="body1">
                                  {training.start_date
                                    ? new Date(training.start_date).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  End Date
                                </Typography>
                                <Typography variant="body1">
                                  {training.end_date
                                    ? new Date(training.end_date).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Certificates Received
                                </Typography>
                                <Typography variant="body1">
                                  {training.certificates_received || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Hours of Training
                                </Typography>
                                <Typography variant="body1">
                                  {training.hours_of_training || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Skills Acquired
                                </Typography>
                                <Typography variant="body1">
                                  {training.skills_acquired || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Credential ID
                                </Typography>
                                <Typography variant="body1">
                                  {training.credential_id || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Credential URL
                                </Typography>
                                <Typography variant="body1">
                                  {training.credential_url || "N/A"}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No trainings available.
                        </Typography>
                      )}

                      {/* PROFESSIONAL LICENSES Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Professional Licenses
                      </Typography>
                      {selectedUserDetails.professional_licenses?.length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedUserDetails.professional_licenses.map((license, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  License
                                </Typography>
                                <Typography variant="body1">
                                  {license.license || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Name
                                </Typography>
                                <Typography variant="body1">
                                  {license.name || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date
                                </Typography>
                                <Typography variant="body1">
                                  {license.date
                                    ? new Date(license.date).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Valid Until
                                </Typography>
                                <Typography variant="body1">
                                  {license.valid
                                    ? new Date(license.valid).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No professional licenses available.
                        </Typography>
                      )}

                      {/* OTHER SKILLS Section */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Other Skills
                      </Typography>
                      {selectedUserDetails.other_skills?.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {selectedUserDetails.other_skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.skills || "N/A"}
                              sx={{
                                backgroundColor: "#e0f7fa",
                                color: "#00796b",
                                fontWeight: "bold",
                                borderRadius: "4px",
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No other skills available.
                        </Typography>
                      )}
                    </>
                  );
                }

                // Default: Show nothing extra
                return null;
              })()}
            </Box>
          ) : (
            <Typography variant="body1" align="center">
              Loading user details...
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingApplications;