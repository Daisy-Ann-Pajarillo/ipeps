import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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
        setJobs(response.data.job_postings.data);
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
  const acceptJobPosting = async (jobId, statusUpdate) => {
    console.log(jobId, statusUpdate);
    const jobPostingData = {
      posting_type: "job",
      posting_id: jobId, // Fixed casing issue (jobid → jobId)
      status: statusUpdate,
    };
    console.log(jobPostingData);
    await axios
      .put("/api/update-posting-status", jobPostingData, {
        auth: {
          username: auth.token, // Ensure `auth.token` is defined
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.info(
            `Job post ${statusUpdate === "active" ? "accepted" : statusUpdate}`
          );
          refresh();
        }
      })
      .catch((error) => {
        console.error("error:", error);
        toast.info("Failed to update job posting.");
      });
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 min-h-screen">
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
            options: ["", ...new Set(jobs.map((job) => job.city_municipality))],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300"
            >
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
                <AttachMoneyIcon className="mr-1 text-green-500" size={18} />
                <span>
                  ${job.estimated_salary_from.toLocaleString() || "-"} - $
                  {job.estimated_salary_to.toLocaleString() || "-"} / year
                </span>
              </div>

              <div>
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
                    <span className="font-semibold">Training Institution:</span>{" "}
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
                <div className="flex space-x-3 mt-5">
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
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No jobs found.
          </p>
        )}
      </div>
    </div>
  );
}
