import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Visibility,
  Delete,
  CheckCircle,
  Search,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  ArrowBackIos,
  ArrowForwardIos,
  Person,
} from "@mui/icons-material";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { Cancel } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

function JobApplications() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobApplications, setJobApplications] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedApp, setSelectedApp] = useState(null); // Track selected application
  const [isLoading, setIsLoading] = useState(false); // Track loading state


  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Fetch authentication details
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch job applications
  useEffect(() => {
    fetchApplications();
  }, [auth.token]);

  const fetchApplications = () => {
    axios
      .get("/api/get-all-users-applied-jobs", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setJobApplications(response.data.applied_jobs || []);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load job applications");
      });
  };


  // Handle accepting an application
  const handleAcceptApplication = (applicationId) => {
    // Find the application with the matching ID
    const applicationToUpdate = jobApplications.find(
      (app) => app.application_id === applicationId
    );

    if (!applicationToUpdate) {
      console.error("Application not found for ID:", applicationId);
      toast.error("Application not found. Please try again.");
      return;
    }

    // Extract user_id from the selected application
    const { user_id } = applicationToUpdate.user_details;

    const payload = {
      application_id: applicationId,
      status: "approved",
      user_id: user_id, // Include the user_id in the payload
    };

    console.log("Payload being sent to the API:", payload);

    setIsLoading(true);

    axios.put("/api/update-job-status", // Adjust the endpoint if needed
      payload,
      {
        auth: { username: auth.token }, // Authentication headers
      }
    )
      .then(() => {
        toast.success("Application approved successfully");
        // Update local state
        setJobApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: "approved" }
              : app
          )
        );
        setSelectedApp((prev) =>
          prev && prev.application_id === applicationId
            ? { ...prev, application_status: "approved" }
            : prev
        );
      })
      .catch((err) => {
        console.error("Error approving application:", err);
        toast.error("Failed to approve application");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle rejecting an application
  const handleRejectApplication = (applicationId) => {
    // Find the application with the matching ID
    const applicationToUpdate = jobApplications.find(
      (app) => app.application_id === applicationId
    );

    if (!applicationToUpdate) {
      console.error("Application not found for ID:", applicationId);
      toast.error("Application not found. Please try again.");
      return;
    }

    // Extract user_id from the selected application
    const { user_id } = applicationToUpdate.user_details;

    setIsLoading(true);

    axios.put("/api/update-job-status", // Adjust the endpoint if needed
      {
        application_id: applicationId,
        status: "rejected",
        user_id: user_id, // Include the user_id in the payload
      },
      {
        auth: { username: auth.token }, // Authentication headers
      }
    )
      .then(() => {
        toast.success("Application rejected successfully");
        // Update local state
        setJobApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: "rejected" }
              : app
          )
        );
        setSelectedApp((prev) =>
          prev && prev.application_id === applicationId
            ? { ...prev, application_status: "rejected" }
            : prev
        );
      })
      .catch((err) => {
        console.error("Error rejecting application:", err);
        toast.error("Failed to reject application");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedApplications = React.useMemo(() => {
    const sortableApplications = [...jobApplications];
    if (sortConfig.key) {
      sortableApplications.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "fullname") {
          aValue = a.user_details?.fullname || "";
          bValue = b.user_details?.fullname || "";
        } else if (sortConfig.key === "email") {
          aValue = a.user_details?.email || "";
          bValue = b.user_details?.email || "";
        } else {
          aValue = a[sortConfig.key] || "";
          bValue = b[sortConfig.key] || "";
        }
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableApplications;
  }, [jobApplications, sortConfig]);

  const filteredApplications = sortedApplications
    .filter(
      (item) =>
        item.user_details?.fullname
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        item.job_title.toLowerCase().includes(query.toLowerCase()) ||
        item.company_name.toLowerCase().includes(query.toLowerCase())
    )
    .filter((item) => (status ? item.application_status === status : true));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedApplications = filteredApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "interviewed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUpward className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDownward className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Job Applications
        </h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, job title..."
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
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("fullname")}
                >
                  <div className="flex items-center">
                    <span>Applicant</span>
                    <SortIcon column="fullname" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("job_title")}
                >
                  <div className="flex items-center">
                    <span>Job Details</span>
                    <SortIcon column="job_title" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("application_status")}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    <SortIcon column="application_status" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("applied_at")}
                >
                  <div className="flex items-center">
                    <span>Applied</span>
                    <SortIcon column="applied_at" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((app) => (
                  <tr
                    key={app.application_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <Person className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.user_details?.fullname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {app.user_details?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {app.job_title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {app.company_name} • {app.city_municipality}, {app.country}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {app.job_type} • {app.experience_level}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ₱{app.estimated_salary_from.toLocaleString()} -{" "}
                        ₱{app.estimated_salary_to.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          app.application_status
                        )}`}
                      >
                        {app.application_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.applied_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAcceptApplication(app.application_id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900"
                          title="Accept application"
                        >
                          <CheckCircle fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app.application_id)}
                          disabled={
                            isLoading ||
                            app.application_status?.toLowerCase() !== "pending"
                          }
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject application"
                        >
                          <Cancel fontSize="small" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                          title="View details"
                        >
                          <Visibility fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No matching applications found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">
                  {filteredApplications.length > 0 ? page * rowsPerPage + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min((page + 1) * rowsPerPage, filteredApplications.length)}
                </span>{" "}
                of <span className="font-medium">{filteredApplications.length}</span> applications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${page === 0
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <ArrowBackIos className="mr-1 h-3 w-3" />
                Previous
              </button>
              <button
                onClick={() => handleChangePage(null, page + 1)}
                disabled={(page + 1) * rowsPerPage >= filteredApplications.length}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${(page + 1) * rowsPerPage >= filteredApplications.length
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                Next
                <ArrowForwardIos className="ml-1 h-3 w-3" />
              </button>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
      </div>
    </div>
  );
}

export default JobApplications;