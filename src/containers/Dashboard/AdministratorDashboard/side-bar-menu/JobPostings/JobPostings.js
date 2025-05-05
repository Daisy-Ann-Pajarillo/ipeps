import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from "react-toastify";

export default function JobBoard() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminRemarks, setAdminRemarks] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const itemsPerPage = 6;

  function refresh() {
    axios
      .get("/api/public/all-postings", {
        auth: {
          username: auth.token,
        },
      })
      .then((response) => {
        setJobs(response.data.job_postings.data);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  }

  useEffect(() => {
    axios
      .get("/api/public/all-postings", {
        auth: {
          username: auth.token,
        },
      })
      .then((response) => {
        const jobData = response.data.job_postings.data;
        setJobs(jobData);

        // Remove auto-selection of the first job
        setSelectedJob(null);
      })
      .catch((error) => {
        console.error("Error fetching postings:", error);
      });
  }, [auth.token]);

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      query === "" || job.title?.toLowerCase().includes(query.toLowerCase());
    const matchesTitle =
      title === "" || job.title?.toLowerCase() === title.toLowerCase();
    const matchesLocation =
      location === "" ||
      job.city_municipality?.toLowerCase() === location.toLowerCase();
    const matchesStatus =
      status === "" || job.status?.toLowerCase() === status.toLowerCase();
    return matchesTitle && matchesLocation && matchesStatus && matchesQuery;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const statusOrder = { pending: 1, active: 2, rejected: 3, expired: 4 };
    return (statusOrder[a.status?.toLowerCase()] || 5) - (statusOrder[b.status?.toLowerCase()] || 5);
  });

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredJobs.length / itemsPerPage))
    );
  };

  const handleRemarksChange = (jobId, value) => {
    setAdminRemarks((prev) => ({
      ...prev,
      [jobId]: value,
    }));
  };

  const acceptJobPosting = async (jobId, statusUpdate) => {
    console.log(jobId, statusUpdate);
    const jobPostingData = {
      posting_type: "job",
      posting_id: jobId,
      status: statusUpdate,
      admin_remarks: adminRemarks[jobId] || "", // Include remarks in the request
    };
    console.log(jobPostingData);
    await axios
      .put("/api/update-posting-status", jobPostingData, {
        auth: {
          username: auth.token,
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.info(
            `Job post ${statusUpdate === "active" ? "accepted" : statusUpdate}`
          );
          // Clear remarks after successful update
          setAdminRemarks((prev) => {
            const newRemarks = { ...prev };
            delete newRemarks[jobId];
            return newRemarks;
          });
          refresh();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.info("Failed to update job posting.");
      });
  };

  const viewJobPosting = (job) => {
    setSelectedJob(job);
  };

  const backToList = () => {
    setSelectedJob(null);
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 min-h-screen">
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


      {/*TO VIEW JOB POSTING INDIVIDUALLY IT WILL SHOW THE FOLLOWING:*/}
      {selectedJob ? (
        <div className="space-y-6">
          <button
            onClick={backToList}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <NavigateBeforeIcon className="h-4 w-4 mr-2" />
            Back to Job Postings
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Job Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Job Title
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedJob.title || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Company Name
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedJob.employer?.company_name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedJob.city_municipality || "N/A"},{" "}
                    {selectedJob.country || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedJob.status || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificate</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedJob.certificate_received || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Training Institution</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedJob.training_institution || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Other Skills</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedJob.other_skills || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Remarks</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedJob.admin_remarks || "No remarks provided."}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Salary Range
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    Php {selectedJob.estimated_salary_from?.toLocaleString() || "-"} - Php{" "}
                    {selectedJob.estimated_salary_to?.toLocaleString() || "-"} / year
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vacancies
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedJob.no_of_vacancies || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Expiration Date
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedJob.expiration_date).toLocaleDateString() || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedJob.created_at).toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Job Description
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {selectedJob.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <SearchData
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full mb-4"
              componentData={[
                {
                  title: "Title",
                  options: ["", ...new Set(jobs.map((job) => job.title))],
                },
                {
                  title: "Location",
                  options: [
                    "",
                    ...new Set(jobs.map((job) => job.city_municipality)),
                  ],
                },
                {
                  title: "Status",
                  options: ["", ...new Set(jobs.map((job) => job.status))],
                },
              ]}
              onComponentChange={(index, value) => {
                if (index === 0) setTitle(value);
                if (index === 1) setLocation(value);
                if (index === 2) setStatus(value);
              }}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Job Postings
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredJobs.length > 0 ? indexOfFirstJob + 1 : 0}-
              {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
              {filteredJobs.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    <h4
                      className={`absolute top-3 right-3 rounded-md uppercase text-[10px] px-2 py-1 text-white
                        ${job.status === "pending" ? "bg-orange-500" : ""}
                        ${job.status === "active" ? "bg-green-500" : ""}
                        ${job.status === "expired" ? "bg-neutral-500" : ""}
                        ${job.status === "rejected" ? "bg-red-500" : ""}`}
                    >
                      {job.status}
                    </h4>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {job.title || "Unknown Title"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {job.employer?.company_name || "Unknown Company"}
                    </p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                      <LocationOnIcon className="mr-1 text-blue-500" size={18} />
                      <span>
                        {job.city_municipality || "Unknown Location"},{" "}
                        {job.country || "Unknown Country"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                      <span>
                        Php {job.estimated_salary_from.toLocaleString() || "-"} -
                        Php {job.estimated_salary_to.toLocaleString() || "-"} /
                        year
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm line-clamp-3">
                      {job.description || "No description available."}
                    </p>


                    <div className="mt-4 space-y-1 text-sm">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-purple-100">
                          {job.job_type || "N/A"}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                          {job.experience_level || "N/A"}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100">
                          Vacancies: {job.no_of_vacancies || "N/A"}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Certificate:</span>{" "}
                        {job.certificate_received || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Course:</span>{" "}
                        {job.course_name || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">
                          Training Institution:
                        </span>{" "}
                        {job.training_institution || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Other Skills:</span>
                        <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100">
                          {job.other_skills || "N/A"}
                        </span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Expiration Date:</span>{" "}
                        {new Date(job.expiration_date).toLocaleDateString() ||
                          "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(job.created_at).toLocaleDateString() || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Updated:</span>{" "}
                        {new Date(job.updated_at).toLocaleDateString() || "N/A"}
                      </p>
                    </div>
                  </div>

                  {job.status === "pending" && (
                    <div className="mt-5">
                      <label
                        htmlFor={`admin-remarks-${job.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Admin Remarks
                      </label>
                      <textarea
                        id={`admin-remarks-${job.id}`}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="2"
                        placeholder="Add your remarks here..."
                        value={adminRemarks[job.id] || ""}
                        onChange={(e) =>
                          handleRemarksChange(job.id, e.target.value)
                        }
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 mt-5">
                    {job.status === "pending" && (
                      <>
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                          onClick={() => acceptJobPosting(job.id, "active")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                          onClick={() => acceptJobPosting(job.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                      onClick={() => viewJobPosting(job)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No jobs found.
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex items-center bg-white rounded-lg shadow overflow-hidden">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 flex items-center ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                <NavigateBeforeIcon fontSize="small" className="mr-1" />
                Previous
              </button>

              <div className="px-4 py-2 border-l border-r border-gray-200">
                Page {currentPage} of{" "}
                {Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage))}
              </div>

              <button
                onClick={nextPage}
                disabled={
                  currentPage >= Math.ceil(filteredJobs.length / itemsPerPage)
                }
                className={`px-4 py-2 flex items-center ${currentPage >= Math.ceil(filteredJobs.length / itemsPerPage)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Next
                <NavigateNextIcon fontSize="small" className="ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}