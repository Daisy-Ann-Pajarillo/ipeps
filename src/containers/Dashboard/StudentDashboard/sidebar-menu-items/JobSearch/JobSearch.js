import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import JobView from "./JobView";
import SearchData from "../../../components/layout/Search";

const JobSearch = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [query, setQuery] = useState("");
  const [entryLevel, setEntryLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});

  // Fetch job postings from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get-job-postings");
        const data = await response.json();
        setJobs(data.job_postings); // Assuming the API returns an object with job_postings
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query and other criteria
  useEffect(() => {
    let updatedJobs = [...jobs];

    // Filtering based on search query
    if (query) {
      updatedJobs = updatedJobs.filter(
        (j) =>
          j.job_title.toLowerCase().includes(query.toLowerCase()) ||
          j.job_description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtering by experience level
    if (entryLevel) {
      updatedJobs = updatedJobs.filter((j) => j.experience_level === entryLevel);
    }

    // Filtering by job type
    if (jobType) {
      updatedJobs = updatedJobs.filter((j) => j.job_type === jobType);
    }

    // Sorting logic
    if (sortBy === "Most Recent") {
      updatedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "Salary") {
      updatedJobs.sort((a, b) => a.estimated_salary_from - b.estimated_salary_from);
    }

    setFilteredJobs(updatedJobs);
  }, [query, entryLevel, jobType, sortBy, jobs]);

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j.job_id === jobId);
    setSelectedJob(job);
  };

  //Save Job
  const handleSave = (jobId) => {
    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId], // Toggle saved state
    }));
  };

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId], // Toggle applied state
    }));
  };

  return (
    <Box>
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

      <Box className="flex">
        <Box className="w-3/5 overflow-y-auto h-dvh p-3 border-r border-gray-300">
          <Typography variant="subtitle1" className="mb-2">
            Total: {filteredJobs.length} jobs found
          </Typography>

          {filteredJobs.map((job) => (
            <Card
              key={job.job_id}
              className={`mb-2 cursor-pointer transition-all duration-200 ${selectedJob?.job_id === job.job_id ? "bg-gray-200" : "bg-white"
                } hover:bg-primary-400`}
              onClick={() => handleJobClick(job.job_id)}
            >
              <CardContent>
                <Box className="flex items-start gap-2">
                  <Box className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src="http://bij.ly/4ib59B1" // Placeholder for company image
                      alt={job.job_title}
                      className="w-full h-full object-contain p-2"
                    />
                  </Box>

                  <Box className="flex-1">
                    <Typography variant="h5" component="div" gutterBottom>
                      {job.job_title}
                    </Typography>
                    <Typography className="text-gray-600">
                      {job.country} • {job.city_municipality}
                    </Typography>
                    <Typography variant="body2">
                      {job.job_type} • {job.experience_level}
                    </Typography>
                    <Typography variant="body2">💰 {job.estimated_salary_from} - {job.estimated_salary_to}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box className="w-2/5 h-dvh overflow-y-auto bg-white">
          {selectedJob && (
            <JobView
              job={selectedJob}
              initialIsSaved={savedJobs[selectedJob.job_id] || false}
              initialIsApplied={appliedJobs[selectedJob.job_id] || false}
              canWithdraw={appliedJobs[selectedJob.job_id]} // Can withdraw if applied
              onSave={() => handleSave(selectedJob.job_id)}
              onApply={() => handleApply(selectedJob.job_id)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default JobSearch;