import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import SearchData from "../../../components/layout/Search";

const ScholarshipApplications = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("/api/get-all-users-applied-scholarships", {
        auth: {
          username: auth.token,
        },
      })
      .then((response) => {
        setApplications(response.data.applied_scholarships || []);
      })
      .catch((error) => {
        console.error("Error fetching scholarships:", error);
      });
  }, [auth.token]);

  const filtered = applications.filter((item) => {
    const matchesQuery = !query || item.scholarship_title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = !status || item.application_status.toLowerCase() === status.toLowerCase();
    const matchesCompany = !company || item.company_name.toLowerCase() === company.toLowerCase();
    return matchesQuery && matchesStatus && matchesCompany;
  });

  const updateScholarshipStatus = (id, newStatus) => {
    axios
      .post(`/api/update-scholarship-status/${id}`, { status: newStatus }, {
        auth: { username: auth.token }
      })
      .then(() => {
        toast.success(`Scholarship ${newStatus}`);
        setApplications((prev) =>
          prev.map((item) =>
            item.application_id === id
              ? { ...item, application_status: newStatus }
              : item
          )
        );
      })
      .catch(() => toast.error("Update failed"));
  };

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen text-sm">
      <SearchData
        placeholder="Search scholarships..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full dark:text-white"
        componentData={[
          {
            title: "Company",
            options: ["", ...new Set(applications.map((a) => a.company_name || ""))],
          },
          {
            title: "Status",
            options: ["", ...new Set(applications.map((a) => a.application_status))],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCompany(value);
          if (index === 1) setStatus(value);
        }}
      />

      <ToastContainer />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No applications found.</p>
      ) : (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Applied</th>
                <th className="px-4 py-2 text-left">Expires</th>
                <th className="px-4 py-2 text-left">Updated</th>
                <th className="px-4 py-2 text-left">Applicant</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">User Type</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
              {filtered.map((application) => (
                <tr key={application.application_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 whitespace-pre-line">{application.scholarship_title}</td>
                  <td className="px-4 py-2">{application.company_name}</td>
                  <td className="px-4 py-2 capitalize">{application.application_status}</td>
                  <td className="px-4 py-2">{application.applied_at}</td>
                  <td className="px-4 py-2">{application.expired_at}</td>
                  <td className="px-4 py-2">{application.updated_at}</td>
                  <td className="px-4 py-2">{application.user_details.fullname}</td>
                  <td className="px-4 py-2">{application.user_details.email}</td>
                  <td className="px-4 py-2">{application.user_details.username}</td>
                  <td className="px-4 py-2">{application.user_details.user_type}</td>
                  <td className="px-4 py-2 flex flex-col gap-1">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => updateScholarshipStatus(application.application_id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => updateScholarshipStatus(application.application_id, "rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );



};

export default ScholarshipApplications;
