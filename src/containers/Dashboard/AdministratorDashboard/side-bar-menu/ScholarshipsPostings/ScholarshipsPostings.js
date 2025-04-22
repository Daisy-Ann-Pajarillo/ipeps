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
  const [adminRemarks, setAdminRemarks] = useState({});
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

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    const statusOrder = { pending: 1, active: 2, rejected: 3, expired: 4 };
    return (statusOrder[a.status?.toLowerCase()] || 5) - (statusOrder[b.status?.toLowerCase()] || 5);
  });

  const fetchScholarship = () => {
    axios
      .get("/api/public/all-postings", {
        auth: { username: auth.token },
      })
      .then((response) => {
        const scholarshipData = response.data.scholarship_postings.data || [];
        setScholarships(scholarshipData);
        // Auto-select first scholarship
        if (scholarshipData.length > 0 && !selectedScholarship) {
          setSelectedScholarship(scholarshipData[0]);
        }
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

  const handleRemarksChange = (scholarshipId, value) => {
    setAdminRemarks(prev => ({
      ...prev,
      [scholarshipId]: value
    }));
  };

  const updateScholarshipStatus = async (scholarshipId, newStatus) => {
    await axios
      .put(
        "/api/update-posting-status",
        {
          posting_type: "scholarship",
          posting_id: scholarshipId,
          status: newStatus,
          remarks: adminRemarks[scholarshipId] || "" // Include remarks in the request
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
            delete newRemarks[scholarshipId];
            return newRemarks;
          });
          fetchScholarship();
        }
      })
      .catch(() => toast.info("Failed to update scholarship posting."));
  };

  const viewScholarship = (scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const backToList = () => {
    setSelectedScholarship(null);
  };

  // Get current scholarships based on pagination
  const indexOfLastScholarship = currentPage * itemsPerPage;
  const indexOfFirstScholarship = indexOfLastScholarship - itemsPerPage;
  const currentScholarships = sortedScholarships.slice(
    indexOfFirstScholarship,
    indexOfLastScholarship
  );

  // Change page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(sortedScholarships.length / itemsPerPage))
    );
  };

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      {selectedScholarship ? (
        <div className="space-y-6">
          <button
            onClick={backToList}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <NavigateBeforeIcon className="h-4 w-4 mr-2" />
            Back to Scholarship Postings
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Scholarship Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Scholarship Title
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedScholarship.title}
                  </p>
                </div>
                {/* Other details... */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Admin Remarks
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedScholarship.remarks || "No remarks provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedScholarship.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
              Showing {sortedScholarships.length > 0 ? indexOfFirstScholarship + 1 : 0}-
              {Math.min(indexOfLastScholarship, sortedScholarships.length)} of {sortedScholarships.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentScholarships.length > 0 ? (
              currentScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <h4 className={`absolute top-3 right-3 rounded-md uppercase text-[10px] px-2 py-1 text-white
                      ${scholarship.status === "pending" ? "bg-orange-500" : ""}
                      ${scholarship.status === "active" ? "bg-green-500" : ""}
                      ${scholarship.status === "expired" ? "bg-neutral-500" : ""}
                      ${scholarship.status === "rejected" ? "bg-red-500" : ""}`}
                    >
                      {scholarship.status}
                    </h4>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {scholarship.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {scholarship.employer?.company_name}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm line-clamp-3">
                      {scholarship.description}
                    </p>
                  </div>

                  {scholarship.status === "pending" && (
                    <div className="mt-5">
                      <label
                        htmlFor={`admin-remarks-${scholarship.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Admin Remarks
                      </label>
                      <textarea
                        id={`admin-remarks-${scholarship.id}`}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="2"
                        placeholder="Add your remarks here..."
                        value={adminRemarks[scholarship.id] || ""}
                        onChange={(e) => handleRemarksChange(scholarship.id, e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 mt-5">
                    {scholarship.status === "pending" && (
                      <>
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                          onClick={() => updateScholarshipStatus(scholarship.id, "active")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                          onClick={() => updateScholarshipStatus(scholarship.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                      onClick={() => viewScholarship(scholarship)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300 col-span-full">
                No scholarships found.
              </p>
            )}
          </div>
        </>
      )}
      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 flex items-center ${currentPage === 1
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            <NavigateBeforeIcon fontSize="small" className="mr-1" />
            Previous
          </button>

          <div className="px-4 py-2 border-l border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {Math.max(1, Math.ceil(sortedScholarships.length / itemsPerPage))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(sortedScholarships.length / itemsPerPage)}
            className={`px-4 py-2 flex items-center ${currentPage >= Math.ceil(sortedScholarships.length / itemsPerPage)
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