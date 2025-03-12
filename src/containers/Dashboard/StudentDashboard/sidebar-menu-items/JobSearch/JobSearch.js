import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import JobView from "./JobView";
import SearchData from "../../../components/layout/Search";

const JobSearch = ({ isCollapsed }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/all-job-postings", {
          auth: {
            username: auth.token,
          },
        });
        setJobs(response.data.job_postings);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let updatedJobs = [...jobs];

    if (query) {
      updatedJobs = updatedJobs.filter(
        (j) =>
          j.job_title.toLowerCase().includes(query.toLowerCase()) ||
          j.job_description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (entryLevel) {
      updatedJobs = updatedJobs.filter(
        (j) => j.experience_level === entryLevel
      );
    }

    if (jobType) {
      updatedJobs = updatedJobs.filter((j) => j.job_type === jobType);
    }

    if (sortBy === "Most Recent") {
      updatedJobs.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "Salary") {
      updatedJobs.sort(
        (a, b) => a.estimated_salary_from - b.estimated_salary_from
      );
    }

    setFilteredJobs(updatedJobs);
  }, [query, entryLevel, jobType, sortBy, jobs]);

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j.job_id === jobId);
    setSelectedJob(job);
  };

  const handleSave = (jobId) => {
    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <div className="">
      {/* Search */}
      <SearchData
        placeholder="Find a job..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={3}
        componentData={[
          {
            title: "Experience Level",
            options: ["", "Entry", "Mid-level", "Senior"],
          },
          {
            title: "Job Type",
            options: ["", "Full-time", "Part-time", "Contract", "Internship"],
          },
          {
            title: "Sort By",
            options: ["", "Most Recent", "Salary"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setEntryLevel(value);
          if (index === 1) setJobType(value);
          if (index === 2) setSortBy(value);
        }}
      />

      <div className="flex mt-4">
        {/* Job List */}
        <div
          className={`${
            selectedJob ? "w-3/5" : "w-full"
          } overflow-y-auto h-[90vh] p-3 border-r border-gray-300 dark:border-gray-700 `}
        >
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total: {filteredJobs.length} jobs found
          </div>

          {filteredJobs.map((job) => (
            <div
              key={job.job_id}
              className={`mb-2 cursor-pointer rounded-lg p-4 transition duration-200 ${
                selectedJob?.job_id === job.job_id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-primary-400 dark:hover:bg-primary-600`}
              onClick={() => handleJobClick(job.job_id)}
            >
              <div className="flex gap-3">
                {/* Company Logo */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="http://bij.ly/4ib59B1"
                    alt={job.job_title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Job Info */}
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {job.job_title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {job.country} • {job.city_municipality}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {job.job_type} • {job.experience_level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    💰 {job.estimated_salary_from} - {job.estimated_salary_to}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedJob && (
          <div className="w-2/5 h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <JobView
              job={selectedJob}
              initialIsSaved={savedJobs[selectedJob.job_id] || false}
              initialIsApplied={appliedJobs[selectedJob.job_id] || false}
              canWithdraw={appliedJobs[selectedJob.job_id]}
              onSave={() => handleSave(selectedJob.job_id)}
              onApply={() => handleApply(selectedJob.job_id)}
              job_id={selectedJob.job_id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
