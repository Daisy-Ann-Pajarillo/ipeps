import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import SavedJobsView from "./SavedJobsView";
import SearchData from "../../../components/layout/Search";

const SavedJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applicationTimes, setApplicationTimes] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Load saved jobs
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        if (auth.token) {
          const response = await axios.get("/api/get-saved-jobs", {
            auth: { username: auth.token },
          });
          const data = response.data;

          if (Array.isArray(data.jobs)) {
            setSavedJobs(data.jobs);
            //setSelectedJob(data.jobs[0] || null);
          }
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    loadSavedJobs();
  }, [auth.token]);

  // Filter jobs based on search query
  const filteredJobs = savedJobs.filter(
    (job) =>
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle job application
  const handleApplyJob = (jobId) => {
    const now = Date.now();
    setApplicationTimes((prev) => ({ ...prev, [jobId]: now }));
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  // Handle application withdrawal within 24 hours
  const handleWithdrawApplication = (jobId) => {
    setApplicationTimes((prev) => {
      const updatedTimes = { ...prev };
      delete updatedTimes[jobId];
      return updatedTimes;
    });

    setAppliedJobs((prev) => {
      const updatedApplied = { ...prev };
      delete updatedApplied[jobId];
      return updatedApplied;
    });
  };

  // Check if the user can withdraw the application within 24 hours
  const canWithdraw = (jobId) => {
    const now = Date.now();
    return (
      applicationTimes[jobId] &&
      now - applicationTimes[jobId] <= 24 * 60 * 60 * 1000
    );
  };

  // Handle job removal from saved jobs
  const handleRemoveFromSaved = (jobId) => {
    const updatedJobs = savedJobs.filter((job) => job.saved_job_id !== jobId);
    setSavedJobs(updatedJobs);

    if (selectedJob?.saved_job_id === jobId) {
      setSelectedJob(updatedJobs[0] || null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-200 dark:bg-gray-800 dark:text-white ">
      {/* Header with Dark Mode Toggle */}
      <SearchData
        placeholder="Find a job..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          {
            title: "Sort By",
            options: ["", "Most Recent", "Most Relevant", "Company Name"],
          },
        ]}
        onComponentChange={(index, value) => {
          // Add sorting logic if needed
        }}
      />

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - Job List */}
        <div
          className={`${
            selectedJob ? "w-2/5" : "w-full"
          } overflow-auto border-r border-gray-500 dark:border-gray-700`}
        >
          <div className="p-4">
            <div className="text-lg font-semibold mb-4">
              Saved Jobs: {filteredJobs.length}
            </div>

            {filteredJobs.map((job) => (
              <div
                key={job.saved_job_id}
                className={`border rounded-lg p-4 mb-4 cursor-pointer ${
                  selectedJob?.saved_job_id === job.saved_job_id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-700"
                } hover:bg-gray-50 dark:hover:bg-gray-600`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold truncate">{job.job_title}</div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(job.saved_job_id);
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                    {job.companyImage ? (
                      <img
                        src={job.companyImage}
                        alt={job.company || "Company"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      {job.city_municipality || "City"},{" "}
                      {job.country || "Country"}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      {job.job_type || "Job Type"} •{" "}
                      {job.experience_level || "Experience"}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      Salary: ${job.estimated_salary_from || 0} - $
                      {job.estimated_salary_to || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Job Details */}
        {selectedJob && (
          <div className="w-3/5 overflow-auto">
            <SavedJobsView
              job={selectedJob}
              isApplied={appliedJobs[selectedJob.saved_job_id]}
              canWithdraw={canWithdraw(selectedJob.saved_job_id)}
              applicationTime={applicationTimes[selectedJob.saved_job_id]}
              onApply={() => handleApplyJob(selectedJob.saved_job_id)}
              onWithdraw={() =>
                handleWithdrawApplication(selectedJob.saved_job_id)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
