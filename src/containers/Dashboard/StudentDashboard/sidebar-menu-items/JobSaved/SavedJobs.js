import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Button,
  Grid,
} from "@mui/material";
import { tokens } from "../../../theme";
import SavedJobsView from "./SavedJobsView";
import SearchData from "../../../components/layout/Search";
import axios from "../../../../../axios";

const SavedJobs = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applicationTimes, setApplicationTimes] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const response = await axios.get("/api/get-saved-jobs");
        const data = response.data;

        if (Array.isArray(data.jobs)) { // Access the jobs array correctly
          setSavedJobs(data.jobs);

          if (data.jobs.length > 0) {
            setSelectedJob(data.jobs[0]); // Set the first job as selected by default
          }
        } else {
          console.error("Fetched jobs data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    loadSavedJobs();
  }, []);


  // Update filtered jobs whenever savedJobs or searchQuery changes
  useEffect(() => {
    const updatedJobs = savedJobs.filter((job) =>
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(updatedJobs);
  }, [savedJobs, searchQuery]);

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

  const handleRemoveFromSaved = (jobId) => {
    const updatedJobs = savedJobs.filter((job) => job.saved_job_id !== jobId);
    setSavedJobs(updatedJobs);

    // If the removed job was selected, select another one
    if (selectedJob && selectedJob.saved_job_id === jobId) {
      setSelectedJob(updatedJobs.length > 0 ? updatedJobs[0] : null);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
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
            // Implement sorting logic if needed
          }}
        />
      </Box>

      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Job Listings */}
        <Grid item xs={12} md={6} lg={5}
          sx={{
            height: { xs: 'auto', md: '100%' },
            overflow: 'auto',
            borderRight: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Saved Jobs: {filteredJobs.length}
            </Typography>

            {filteredJobs.map((job) => (
              <Card
                key={job.saved_job_id}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  bgcolor: selectedJob?.saved_job_id === job.saved_job_id
                    ? 'action.selected'
                    : 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {job.job_title}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(job.saved_job_id);
                      }}
                    >
                      Remove
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {job.companyImage && (
                        <img
                          src={job.companyImage}
                          alt={job.company || "Company"}
                          style={{
                            width: '50%',
                            height: '50%',
                            objectFit: 'cover', // Changed from 'contain' to 'cover'
                            padding: 0 // Removed padding to ensure full square
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.city_municipality || "City"}, {job.country || "Country"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {job.job_type || "Job Type"} • {job.experience_level || "Experience"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        Salary: ${job.estimated_salary_from || 0} - ${job.estimated_salary_to || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Right Panel - Job Details */}
        <Grid item xs={6} md={6} lg={7} sx={{ height: { xs: 'auto', md: '100%' }, overflow: 'auto' }}>
          {selectedJob ? (
            <SavedJobsView
              job={selectedJob}
              isApplied={appliedJobs[selectedJob.saved_job_id]}
              canWithdraw={canWithdraw(selectedJob.saved_job_id)}
              applicationTime={applicationTimes[selectedJob.saved_job_id]}
              onApply={() => handleApplyJob(selectedJob.saved_job_id)}
              onWithdraw={() => handleWithdrawApplication(selectedJob.saved_job_id)}
            />
          ) : (
            <Box className="w-full lg:w-2/5 h-full overflow-y-auto bg-white dark:bg-gray-800">
              <Typography variant="h6" color="text.secondary">
                Select a job to view details
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SavedJobs;