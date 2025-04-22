import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Search,
  CheckCircle,
  Close as XCircle,
  Error as AlertCircle,
  AccessTime as Clock,
  FilterList as Filter,
  CalendarToday as Calendar,
  Person as User,
  Business as Building,
  Description as FileText,
  ExpandMore,
  InfoOutlined,
  Visibility
} from "@mui/icons-material";

const ScholarshipApplications = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedApplication, setExpandedApplication] = useState(null);

  // Fetch authentication details
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch scholarship applications
  useEffect(() => {
    if (!auth.token) return; // Skip if token is not available
    setIsLoading(true);
    axios
      .get("/api/get-all-users-applied-scholarships", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setApplications(response.data.applied_scholarships || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to load scholarship applications");
        setIsLoading(false);
      });
  }, [auth.token]);

  // Filter logic
  const filtered = applications.filter((item) => {
    const matchesQuery =
      !query ||
      item.scholarship_title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus =
      !status ||
      item.application_status.toLowerCase() === status.toLowerCase();
    const matchesCompany =
      !company ||
      item.company_name.toLowerCase().includes(company.toLowerCase());
    return matchesQuery && matchesStatus && matchesCompany;
  });

  // Update scholarship status
  const updateScholarshipStatus = (id, newStatus) => {
    // Find the application with the matching ID
    const applicationToUpdate = applications.find(
      (app) => app.application_id === id
    );

    if (!applicationToUpdate) {
      console.error("Application not found for ID:", id);
      toast.error("Application not found. Please try again.");
      return;
    }

    // Extract the user_id from the application's user_details
    const { user_id } = applicationToUpdate.user_details;

    console.log("Updating scholarship status with data:", {
      application_id: id,
      status: newStatus,
      user_id: user_id,
    });

    axios
      .put(
        `/api/update-scholarship-status`, // Adjust the endpoint if needed
        {
          application_id: id,
          status: newStatus,
          user_id: user_id,
        },
        {
          auth: { username: auth.token }, // Authentication headers
        }
      )
      .then(() => {
        toast.success(
          `Application ${newStatus === "approved" ? "approved" : "rejected"} successfully`
        );
        setApplications((prev) =>
          prev.map((item) =>
            item.application_id === id
              ? { ...item, application_status: newStatus }
              : item
          )
        );
      })
      .catch((error) => {
        console.error("Error updating scholarship status:", error);
        toast.error("Status update failed. Please try again.");
      });
  };

  // Status badge rendering
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  // Toggle expanded application
  const toggleExpandApplication = (id) => {
    setExpandedApplication((prev) => (prev === id ? null : id));
  };

  // Unique companies and statuses for filters
  const uniqueCompanies = [
    "",
    ...(applications.length > 0
      ? Array.from(new Set(applications.map((a) => a.company_name || ""))).filter(Boolean)
      : []),
  ];
  const uniqueStatuses = [
    "",
    ...(applications.length > 0
      ? Array.from(new Set(applications.map((a) => a.application_status))).filter(Boolean)
      : []),
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scholarship Applications
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Review and manage scholarship applications
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-72 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search scholarships..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            Filters {isFilterOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Filter Options */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm appearance-none bg-none"
                  >
                    <option value="">All Companies</option>
                    {uniqueCompanies.slice(1).map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm appearance-none bg-none"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.slice(1).map((option, idx) => (
                      <option key={idx} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No applications found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search filters or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((application) => (
              <div
                key={application.application_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {application.scholarship_title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Building className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                          {application.company_name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                          {application.user_details.fullname}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(application.application_status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandApplication(application.application_id);
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                      <Visibility className="h-4 w-4 mr-1.5" />
                      View
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedApplication === application.application_id && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className="p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Scholarship Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <InfoOutlined className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              Scholarship Information
                            </h4>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Title
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.scholarship_title}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Company
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.company_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Application Date
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.applied_at}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Expiration Date
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.expired_at}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Last Updated
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.updated_at}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Status
                                </p>
                                <div className="mt-1">
                                  {getStatusBadge(application.application_status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Applicant Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              Applicant Information
                            </h4>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Full Name
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.user_details.fullname}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Email
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.user_details.email}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Username
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  @{application.user_details.username}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  User Type
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {application.user_details.user_type}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Admin Remarks */}
                        <div className="space-y-4 mt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <InfoOutlined className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              Admin Remarks
                            </h4>
                          </div>
                          <textarea
                            placeholder="Enter your remarks here..."
                            className="block w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                          ></textarea>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex justify-end mt-6 gap-3">
                        <button
                          className="inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateScholarshipStatus(
                              application.application_id,
                              "approved"
                            );
                          }}
                          disabled={application.application_status === "approved"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          className="inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateScholarshipStatus(
                              application.application_id,
                              "declined"
                            );
                          }}
                          disabled={application.application_status === "declined"}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipApplications;