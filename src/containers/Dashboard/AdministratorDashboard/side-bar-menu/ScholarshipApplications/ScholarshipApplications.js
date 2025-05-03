import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Visibility,
  CheckCircle,
  Cancel,
  ArrowBackIos,
  ArrowForwardIos,
  Search,
  FilterList,
} from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Divider,
  Grid, // Ensure Grid is imported from @mui/material
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";

const ScholarshipApplications = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    fetchScholarshipApplications();
  }, [auth.token]);

  const fetchScholarshipApplications = () => {
    axios
      .get("/api/get-all-users-applied-scholarships", {
        auth: { username: auth.token },
      })
      .then((res) => {
        setApplications(res.data.applied_scholarships || []);
      })
      .catch((err) => {
        console.error("Error fetching scholarships:", err);
        toast.error("Failed to load scholarship applications");
      });
  };

  const handleAcceptApplication = (applicationId) => {
    setIsLoading(true);
    const applicationToUpdate = applications.find(
      (app) => app.application_id === applicationId
    );
    if (!applicationToUpdate) {
      toast.error("Application not found. Please try again.");
      setIsLoading(false);
      return;
    }
    const { user_id } = applicationToUpdate.user_details;
    axios
      .put(
        "/api/update-scholarship-status",
        { application_id: applicationId, status: "approved", user_id },
        { auth: { username: auth.token } }
      )
      .then(() => {
        toast.success("Application approved successfully");
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: "approved" }
              : app
          )
        );
      })
      .catch(() => toast.error("Failed to approve application"))
      .finally(() => setIsLoading(false));
  };

  const handleRejectApplication = (applicationId) => {
    setIsLoading(true);
    const applicationToUpdate = applications.find(
      (app) => app.application_id === applicationId
    );
    if (!applicationToUpdate) {
      toast.error("Application not found. Please try again.");
      setIsLoading(false);
      return;
    }
    const { user_id } = applicationToUpdate.user_details;
    axios
      .put(
        "/api/update-scholarship-status",
        { application_id: applicationId, status: "declined", user_id },
        { auth: { username: auth.token } }
      )
      .then(() => {
        toast.success("Application rejected successfully");
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: "rejected" }
              : app
          )
        );
      })
      .catch(() => toast.error("Failed to reject application"))
      .finally(() => setIsLoading(false));
  };

  const handleViewApplicantDetails = async (userId, application) => {
    try {
      const response = await axios.get(`/api/admin/get-user-info/${userId}`, {
        auth: { username: auth.token },
      });
      setSelectedUserDetails(response.data);
      setSelectedApp(application); // Set the selected application
      setOpenDetailDialog(true);
    } catch {
      toast.error("Failed to load applicant details.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
    setSelectedUserDetails(null);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesQuery =
      query === "" ||
      app.user_details?.fullname.toLowerCase().includes(query.toLowerCase()) ||
      app.user_details?.email.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "" || app.application_status === status;
    return matchesQuery && matchesStatus;
  });

  const paginatedApplications = filteredApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Scholarship Applications
        </h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setStatus(status === "" ? "pending" : "")}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FilterList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Scholarship Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.user_details?.fullname || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {app.user_details?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.scholarship_title || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {app.company_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.application_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : app.application_status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.application_status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.applied_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                          title="Reject application"
                        >
                          <Cancel fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleViewApplicantDetails(app.user_details.user_id, app)} // Pass the application data
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
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                page === 0
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
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                (page + 1) * rowsPerPage >= filteredApplications.length
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
          Review Application          
          <Divider sx={{ my: 2 }} />

            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUserDetails ? (
            <Box sx={{ p: 3 }}>
              {/* Scholarship Details Section */}
              {selectedApp && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Scholarship Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Title
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.scholarship_title}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.scholarship_description}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Slots
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.slots}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Occupied Slots
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.occupied_slots}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Remarks
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.remarks}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.created_at
                          ? new Date(selectedApp.created_at).toLocaleDateString()
                          : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Updated At
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.updated_at
                          ? new Date(selectedApp.updated_at).toLocaleDateString()
                          : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Expiration Date
                      </Typography>
                      <Typography variant="body1">
                        {selectedApp.expiration_date
                          ? new Date(selectedApp.expiration_date).toLocaleDateString()
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

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
                            <Typography variant="subtitle2" color="text.secondary">
                              Permanent Municipality
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.permanent_municipality || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Permanent Zip Code
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.permanent_zip_code || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Permanent Barangay
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.permanent_barangay || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Permanent House/Street/Village
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.permanent_house_no_street_village || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Cellphone Number
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.cellphone_number || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Landline Number
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.landline_number || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Valid ID URL
                            </Typography>
                            <Typography variant="body1">
                              {selectedUserDetails.personal_information.valid_id_url || "N/A"}
                            </Typography>
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

export default ScholarshipApplications;