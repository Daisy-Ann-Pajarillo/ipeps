import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Visibility, Delete, CheckCircle } from '@mui/icons-material';
import SearchData from "../../../components/layout/Search";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";

function JobApplications() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobApplications, setJobApplications] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("/api/get-all-users-applied-jobs", {
        auth: {
          username: auth.token,
        },
      })
      .then((response) => {
        setJobApplications(response.data.applied_jobs);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  }, [auth.token]);

  const filteredApplications = jobApplications
    .filter((item) =>
      item.user_details?.fullname.toLowerCase().includes(query.toLowerCase())
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

  return (
    <div className="p-4 space-y-4">
      <SearchData
        placeholder="Search applicants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        componentData={[
          { title: "Status", options: ["", "pending", "shortlisted", "interviewed", "rejected"] }
        ]}
        onComponentChange={(index, value) => setStatus(value)}
      />
      <div className="p-4 space-y-4 dark:bg-gray-900 min-h-screen transition-colors duration-300">

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-auto">
          <table className="min-w-[1200px] text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2">Application ID</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">User Type</th>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Job Type</th>
                <th className="px-4 py-2">Experience Level</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Salary</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Applied At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((app) => (
                  <tr key={app.application_id}>
                    <td className="px-4 py-2">{app.application_id}</td>
                    <td className="px-4 py-2">{app.user_details?.fullname}</td>
                    <td className="px-4 py-2">{app.user_details?.email}</td>
                    <td className="px-4 py-2">{app.user_details?.username}</td>
                    <td className="px-4 py-2">{app.user_details?.user_type}</td>
                    <td className="px-4 py-2">{app.job_title}</td>
                    <td className="px-4 py-2">{app.job_type}</td>
                    <td className="px-4 py-2">{app.experience_level}</td>
                    <td className="px-4 py-2">{app.company_name}</td>
                    <td className="px-4 py-2">{app.city_municipality}</td>
                    <td className="px-4 py-2">{app.country}</td>
                    <td className="px-4 py-2">
                      ₱{app.estimated_salary_from.toLocaleString()} - ₱{app.estimated_salary_to.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{app.application_status}</td>
                    <td className="px-4 py-2">{app.applied_at}</td>
                    <td className="px-4 py-2">{app.updated_at}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button className="text-blue-500 hover:text-blue-400 dark:hover:text-blue-300">
                        <Visibility fontSize="small" />
                      </button>
                      <button className="text-red-500 hover:text-red-400 dark:hover:text-red-300">
                        <Delete fontSize="small" />
                      </button>
                      <button className="text-green-500 hover:text-green-400 dark:hover:text-green-300">
                        <CheckCircle fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No matching job applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {(page * rowsPerPage) + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, filteredApplications.length)} of{" "}
            {filteredApplications.length} applications
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 0}
              onClick={() => handleChangePage(null, page - 1)}
              className={`px-2 py-1 rounded ${page === 0 ? 'text-gray-400' : 'text-blue-600 hover:underline dark:text-blue-400 dark:hover:underline'}`}
            >
              Previous
            </button>
            <button
              disabled={(page + 1) * rowsPerPage >= filteredApplications.length}
              onClick={() => handleChangePage(null, page + 1)}
              className={`px-2 py-1 rounded ${(page + 1) * rowsPerPage >= filteredApplications.length ? 'text-gray-400' : 'text-blue-600 hover:underline dark:text-blue-400 dark:hover:underline'}`}
            >
              Next
            </button>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="ml-2 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-200"
            >
              {[5, 10, 25].map((val) => (
                <option key={val} value={val}>
                  {val} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplications;
