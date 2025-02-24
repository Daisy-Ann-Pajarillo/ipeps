import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar, Button } from '@mui/material';
import { AccessTime, LocationOn, Payment } from '@mui/icons-material';
import JobApplicationView from './JobApplicationView';
import SearchData from '../../../components/layout/Search';


const JobApplications = ({ isCollapsed }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});
  const headerHeight = '72px';

  useEffect(() => {
    const loadApplications = () => {
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedItems') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
      const allJobs = JSON.parse(localStorage.getItem('allJobs') || '[]');

      const appliedJobsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('job-') && appliedItemsList[key])
        .map(key => {
          const jobId = parseInt(key.replace('job-', ''));
          const job = allJobs.find(job => job.id === jobId);
          if (job) {
            return {
              ...job,
              applicationTime: applicationTimesList[`job-${jobId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setAppliedJobs(appliedJobsData);
      setApplicationTimes(applicationTimesList);
    };

    loadApplications();
    window.addEventListener('storage', loadApplications);
    return () => window.removeEventListener('storage', loadApplications);
  }, []);

  const canWithdraw = (jobId) => {
    const applicationTime = applicationTimes[`job-${jobId}`];
    if (!applicationTime) return false;
    const now = new Date().getTime();
    const timeDiff = now - applicationTime;
    return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours
  };

  const getTimeRemaining = (jobId) => {
    const applicationTime = applicationTimes[`job-${jobId}`];
    if (!applicationTime) return null;
    const now = new Date().getTime();
    const timeLeft = (applicationTime + 24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) return 'Application submitted';
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  const handleWithdrawal = (jobId) => {
    // Remove the job from the applied jobs list
    setAppliedJobs(prev => prev.filter(job => job.id !== jobId));
    
    // Immediately clear the selected application
    setSelectedApplication(null);
    
    // Update localStorage (if needed)
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`job-${jobId}`];
    delete applicationTimes[`job-${jobId}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));
  };
  const [jobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Manila',
      type: 'Full-time',
      experienceLevel: 'Entry Level',
      vacancies: 3,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
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
      title: 'IT Technician',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 3,
      title: 'Junior Developer',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 4,
      title: 'Senior Developer',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 5,
      title: 'Data Analyst',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 6,
      title: 'Computer Engineer',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 7,
      title: 'Network Administrator',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },
    {
      id: 8,
      title: 'Database Administrator',
      company: 'XYZ Solutions',
      location: 'Iloilo City',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      vacancies: 5,
      salary: '₱30,000 - ₱50,000 / month',
      companyImage: 'http://bij.ly/4ib59B1',
      description: `Join Our Team – Exciting Career Opportunities Await!`,
    },

    // Add more mock jobs here
  ]);
  const [sortedJobs, setSortedJobs] = useState(jobs);
  const [query, setQuery] = useState("");

  const filterAndSortScholarships = (query, jobs) => {
    if (!query.trim()) return jobs; // Return all if query is empty

    return jobs
      .filter(({ title, company, description }) =>
        [title, company, description].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      )
      .sort((a, b) => b.rating - a.rating || b.openPositions - a.openPositions);
  };

  useEffect(() => {
    setSortedJobs(filterAndSortScholarships(query, jobs));
  }, [query, jobs]); // Runs when `query` or `companies` change

  return (
    <Box>
      <SearchData
        placeholder="Find a training..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />

      <Box 
        sx={{ 
          display: 'flex',
          position: 'fixed',
          top: headerHeight,
          left: isCollapsed ? '80px' : '250px',
          right: 0,
          bottom: 0,
          transition: 'left 0.3s'
        }}
      >
        {/* Applications List Panel */}
        <Box 
          sx={{ 
            width: '60%',
            height: '100%',
            overflowY: 'auto',
            p: 3,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Job Applications
          </Typography>
          <Grid container spacing={2}>
            {sortedJobs.map(job => (
              <Grid item xs={12} key={job.id}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedApplication(job)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selectedApplication?.id === job.id ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={job.companyImage}
                      sx={{ width: 60, height: 60 }}
                    >
                      {job.company[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {job.company}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip icon={<LocationOn />} label={job.location} size="small" />
                        <Chip icon={<Payment />} label={job.salary} size="small" />
                        <Chip 
                          icon={<AccessTime />} 
                          label={getTimeRemaining(job.id)}
                          size="small" 
                          color={canWithdraw(job.id) ? "error" : "success"}
                        />
                      </Box>
                      <Box>
                        {job.skills?.map(skill => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>

                  </Box>
                </Paper>
              </Grid>
            ))}
            {appliedJobs.length === 0 && (
              <Grid item xs={12}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography color="text.secondary">
                    No job applications yet
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Application View Panel */}
        <Box 
          sx={{ 
            width: '40%',
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'white',
          }}
        >
          <JobApplicationView 
            application={selectedApplication} 
            onWithdraw={handleWithdrawal}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default JobApplications;
