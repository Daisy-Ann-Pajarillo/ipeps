import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import SearchData from "../../../components/layout/Search";

const Scholarships_Postings = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [scholarships, setScholarships] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesQuery =
      !query || scholarship.title.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      !status || scholarship.status.toLowerCase() === status.toLowerCase();

    const matchesCompany =
      !company ||
      (scholarship.employer?.company_name &&
        scholarship.employer.company_name.toLowerCase() ===
          company.toLowerCase());

    return matchesQuery && matchesStatus && matchesCompany;
  });

  const fetchScholarship = () => {
    axios
      .get("/api/public/all-postings", {
        auth: { username: auth.token },
      })
      .then((response) => {
        setScholarships(response.data.scholarship_postings.data || []);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  };

  useEffect(() => {
    if (auth.token) {
      fetchScholarship();
    }
  }, [auth.token]);

  const updateScholarshipStatus = async (scholarshipId, newStatus) => {
    await axios
      .put(
        "/api/update-posting-status",
        {
          posting_type: "scholarship",
          posting_id: scholarshipId,
          status: newStatus,
        },
        { auth: { username: auth.token } }
      )
      .then((response) => {
        if (response.data.success) {
          toast.info(
            `Job post ${newStatus === "active" ? "accepted" : newStatus}`
          );
          fetchScholarship();
        }
      })
      .catch(() => toast.info("Failed to update training posting."));
  };
  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <SearchData
        placeholder="Search scholarships..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full dark:text-white"
        componentData={[
          {
            title: "Company",
            options: [
              "",
              ...new Set(
                scholarships.map((t) => t.employer?.company_name || "")
              ),
            ],
          },
          {
            title: "Status",
            options: ["", ...new Set(scholarships.map((s) => s.status))],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setCompany(value);
          if (index === 1) setStatus(value);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
            >
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs text-white rounded-md uppercase ${
                  scholarship.status === "pending"
                    ? "bg-orange-500"
                    : scholarship.status === "active"
                    ? "bg-green-500"
                    : scholarship.status === "expired"
                    ? "bg-gray-500"
                    : "bg-red-500"
                }`}
              >
                {scholarship.status}
              </span>
              <h2 className="text-lg font-semibold dark:text-white">
                {scholarship.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {scholarship.employer.company_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {scholarship.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact: {scholarship.employer.email}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Status: {scholarship.status}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expires on: {scholarship.expiration_date}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Updated at: {scholarship.updated_at}
              </p>
              {scholarship.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() =>
                      updateScholarshipStatus(scholarship.id, "active")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() =>
                      updateScholarshipStatus(scholarship.id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No scholarships found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Scholarships_Postings;
