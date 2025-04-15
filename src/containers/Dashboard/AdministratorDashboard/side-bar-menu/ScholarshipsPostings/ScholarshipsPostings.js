import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import SearchData from "../../../components/layout/Search";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show exactly 6 scholarships per page

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

  // Get current scholarships based on pagination
  const indexOfLastScholarship = currentPage * itemsPerPage;
  const indexOfFirstScholarship = indexOfLastScholarship - itemsPerPage;
  const currentScholarships = filteredScholarships.slice(
    indexOfFirstScholarship,
    indexOfLastScholarship
  );

  // Change page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredScholarships.length / itemsPerPage))
    );
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

      {/* Count display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Scholarship Postings
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredScholarships.length > 0 ? indexOfFirstScholarship + 1 : 0}-
          {Math.min(indexOfLastScholarship, filteredScholarships.length)} of {filteredScholarships.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentScholarships.length > 0 ? (
          currentScholarships.map((scholarship) => (
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
          <p className="text-center text-gray-600 dark:text-gray-300 col-span-full">
            No scholarships found.
          </p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 flex items-center ${
              currentPage === 1
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <NavigateBeforeIcon fontSize="small" className="mr-1" />
            Previous
          </button>

          <div className="px-4 py-2 border-l border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {Math.max(1, Math.ceil(filteredScholarships.length / itemsPerPage))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(filteredScholarships.length / itemsPerPage)}
            className={`px-4 py-2 flex items-center ${
              currentPage >= Math.ceil(filteredScholarships.length / itemsPerPage)
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
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

export default Scholarships_Postings;
