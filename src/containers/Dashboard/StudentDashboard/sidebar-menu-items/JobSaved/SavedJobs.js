import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Button,
} from "@mui/material";
import { tokens } from "../../../theme";
import SavedJobsView from "./SavedJobsView";
import SearchData from "../../../components/layout/Search";
const SavedJobs = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobType, setJobType] = useState("");
  //const [sortBy, setSortBy] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const headerHeight = "72px";
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applicationTimes, setApplicationTimes] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);

  React.useEffect(() => {
    const loadSavedJobs = () => {
      const jobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      setSavedJobs(jobs);
    };

    loadSavedJobs();

    window.addEventListener("storage", loadSavedJobs);

    return () => window.removeEventListener("storage", loadSavedJobs);
  }, []);

  const handleApplyJob = (jobId) => {
    const now = new Date().getTime();
    setApplicationTimes((prev) => ({
      ...prev,
      [jobId]: now,
    }));
    setAppliedJobs((prev) => ({
      ...prev,
      [jobId]: true,
    }));
  };

  const handleWithdrawApplication = (jobId) => {
    setApplicationTimes((prev) => {
      const newTimes = { ...prev };
      delete newTimes[jobId];
      return newTimes;
    });
    setAppliedJobs((prev) => {
      const newApplied = { ...prev };
      delete newApplied[jobId];
      return newApplied;
    });
  };

  const canWithdraw = (jobId) => {
    if (!applicationTimes[jobId]) return false;
    const now = new Date().getTime();
    const applicationTime = applicationTimes[jobId];
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  const handleSearch = () => {
    console.log("Searching saved jobs...");
  };

  const handleRemoveFromSaved = (jobId) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    setSavedJobs(updatedJobs);
  };
  const [jobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "Manila",
      type: "Full-time",
      experienceLevel: "Entry Level",
      vacancies: 3,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!

Are you passionate about innovation, collaboration, and making a meaningful impact? We are looking for talented and driven individuals to join our dynamic team! At Tech Corp, we believe in fostering a culture of growth, creativity, and excellence.

As a part of our team, you'll have the opportunity to work on exciting projects, collaborate with industry professionals, and contribute to groundbreaking solutions. We offer a supportive work environment, competitive compensation, and opportunities for career advancemenj.

Why Work With Us?
✅ Competitive salary and benefits package
✅ Career growth and professional development opportunities
✅ Inclusive and diverse workplace culture
✅ Work-life balance with flexible work arrangements
✅ Access to the latest tools and technologies

Who We're Looking For:
We welcome individuals from various backgrounds with skills in software development, cloud computing, AI/ML, and full-stack developmenj. Whether you're an experienced professional or an ambitious newcomer, we value passion, dedication, and a willingness to learn.

If you're ready to take your career to the next level, we'd love to hear from you! Apply today and become part of a team that values innovation, teamwork, and excellence.

📩 How to Apply:
Send your resume and a brief cover letter to careers@techcorp.com or visit our careers page at techcorp.com/careers.

Join us and be a part of something great! 🚀`,
    },
    {
      id: 2,
      title: "IT Technician",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 4,
      title: "Senior Developer",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 5,
      title: "Data Analyst",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 6,
      title: "Computer Engineer",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 7,
      title: "Network Administrator",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 8,
      title: "Database Administrator",
      company: "XYZ Solutions",
      location: "Iloilo City",
      type: "Full-time",
      experienceLevel: "Senior Level",
      vacancies: 5,
      salary: "₱30,000 - ₱50,000 / month",
      companyImage: "http://bij.ly/4ib59B1",
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },

    // Add more mock jobs here
  ]);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // useEffect to filter and sort trainings dynamically
  useEffect(() => {
    let updatedTrainings = [...jobs];

    // Filtering based on search query
    if (query) {
      updatedTrainings = updatedTrainings.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sorting logic
    if (sortBy === "Company Name") {
      updatedTrainings.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sortBy === "Most Recent") {
      updatedTrainings.sort((a, b) => new Date(b.date) - new Date(a.date)); // Assuming `date` exists
    } else if (sortBy === "Most Relevant") {
      // Define relevance logic if applicable
    }

    // Update filtered trainings
    setFilteredJobs(updatedTrainings);
  }, [query, sortBy, jobs]); // Dependencies

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        components={1}
        componentData={[
          {
            title: "Sort By",
            options: ["", "Most Recent", "Most Relevant", "Company Name"],
          },
        ]}
        onComponentChange={(index, value) => {
          if (index === 0) setSortBy(value);
        }}
      />

      <Box>
        {/* Saved Jobs Panel */}
        <Box className="w-full lg:w-3/5 h-full overflow-y-auto p-6 border-r border-gray-300 dark:border-gray-600">
          <Typography variant="subtitle1" className="mb-4 dark:text-white">
            Saved Jobs: {filteredJobs.length}
          </Typography>

          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="mb-4 cursor-pointer dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              sx={{
                backgroundColor:
                  selectedJob?.id === job.id ? "#f5f5f5" : "white",
              }}
              onClick={() => setSelectedJob(job)}
            >
              <CardContent>
                {/* Remove Button */}
                <Box className="flex justify-end mb-2">
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(job.id);
                    }}
                  >
                    Remove
                  </Button>
                </Box>

                {/* Job Info */}
                <Box className="flex gap-4">
                  {/* Company Logo */}
                  <Box className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={job.companyImage}
                      alt={job.company}
                      className="w-full h-full object-contain p-2"
                    />
                  </Box>

                  {/* Job Details */}
                  <Box className="flex-1">
                    <Typography
                      variant="h5"
                      component="div"
                      className="mb-1 dark:text-white"
                    >
                      {job.title}
                    </Typography>
                    <Typography className="text-gray-600 dark:text-gray-300">
                      {job.company} • {job.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {job.type} • {job.experience}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Job View Panel */}
        <Box className="w-full lg:w-2/5 h-full overflow-y-auto bg-white dark:bg-gray-800">
          {selectedJob && (
            <SavedJobsView
              job={selectedJob}
              isApplied={appliedJobs[selectedJob.id]}
              canWithdraw={canWithdraw(selectedJob.id)}
              applicationTime={applicationTimes[selectedJob.id]}
              onApply={() => handleApplyJob(selectedJob.id)}
              onWithdraw={() => handleWithdrawApplication(selectedJob.id)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedJobs;
