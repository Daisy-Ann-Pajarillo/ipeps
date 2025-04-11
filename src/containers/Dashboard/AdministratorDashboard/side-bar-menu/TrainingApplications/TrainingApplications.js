import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import SearchData from "../../../components/layout/Search";

const TrainingApplications = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("/api/get-all-users-applied-trainings", {
        auth: { username: auth.token },
      })
      .then((res) => {
        console.log(res);
        setApplications(res.data.applied_trainings || []);
      })
      .catch((err) => console.error("Error fetching trainings:", err));
  }, [auth.token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-600";
      case "rejected":
        return "bg-red-600";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <ToastContainer autoClose={3000} theme="light" />
      <SearchData
        placeholder="Search training title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        componentData={[
          {
            title: "Status",
            options: [
              "",
              ...new Set(applications.map((app) => app.application_status)),
            ],
          },
          {
            title: "Company",
            options: [
              "",
              ...new Set(applications.map((app) => app.company_name)),
            ],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setStatus(value);
          if (index === 1) setCompany(value);
        }}
      />

      {selectedApp ? (
        <div className="mt-6">
          <button
            onClick={backToList}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            &larr; Back to Applications
          </button>

          <h1 className="text-2xl font-bold mb-6 text-center">Training Application Details</h1>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900 w-1/4">Application ID</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.application_id}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Training Title</td>
                  <td className="px-6 py-4 whitespace-normal text-gray-700">{selectedApp.training_title}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Company Name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.company_name}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Training Description</td>
                  <td className="px-6 py-4 whitespace-normal text-gray-700">{selectedApp.training_description}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Status</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(selectedApp.application_status)}`}>
                      {selectedApp.application_status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Applied Date</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.applied_at}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Expiry Date</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.expired_at}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Last Updated</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.updated_at}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Training Posting ID</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.training_posting_id}</td>
                </tr>
                {selectedApp.user_details && (
                  <>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Username</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.user_details.username}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Full Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.user_details.fullname}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">Email</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.user_details.email}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">User Type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.user_details.user_type}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 font-medium text-gray-900">User ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{selectedApp.user_details.user_id}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h1 className="text-2xl font-bold mb-6">Your Training Applications</h1>

          {currentItems.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-700">No applications found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Training Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((app) => (
                    <tr key={app.application_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm font-medium text-gray-900">{app.training_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{app.company_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(app.application_status)}`}>
                          {app.application_status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{app.applied_at}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewApplicationDetails(app)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredApplications.length > itemsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingApplications;