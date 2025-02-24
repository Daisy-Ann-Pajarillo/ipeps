import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar } from '@mui/material';
import { School, AccessTime, Payment } from '@mui/icons-material';
import ScholarshipApplicationView from './ScholarshipApplicationView';
import SearchData from '../../../components/layout/Search';

const ScholarshipApplications = ({ isCollapsed }) => {
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationTimes, setApplicationTimes] = useState({});
  const headerHeight = '72px';

  useEffect(() => {
    const loadApplications = () => {
      const appliedItemsList = JSON.parse(localStorage.getItem('appliedItems') || '{}');
      const applicationTimesList = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
      const allScholarships = JSON.parse(localStorage.getItem('allScholarships') || '[]');

      const appliedScholarshipsData = Object.keys(appliedItemsList)
        .filter(key => key.startsWith('scholarship-') && appliedItemsList[key])
        .map(key => {
          const scholarshipId = parseInt(key.replace('scholarship-', ''));
          const scholarship = allScholarships.find(s => s.id === scholarshipId);
          if (scholarship) {
            return {
              ...scholarship,
              applicationTime: applicationTimesList[`scholarship-${scholarshipId}`]
            };
          }
          return null;
        })
        .filter(Boolean);

      setAppliedScholarships(appliedScholarshipsData);
      setApplicationTimes(applicationTimesList);
    };

    loadApplications();
    window.addEventListener('storage', loadApplications);
    return () => window.removeEventListener('storage', loadApplications);
  }, []);

  const handleWithdrawal = (scholarshipId) => {
    // Remove from local state first
    setAppliedScholarships(prev => prev.filter(s => s.id !== scholarshipId));
    setSelectedScholarship(null);

    // Update localStorage
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
    const allScholarships = JSON.parse(localStorage.getItem('allScholarships') || '[]');

    // Remove from applied items
    delete appliedItems[`scholarship-${scholarshipId}`];
    delete applicationTimes[`scholarship-${scholarshipId}`];

    // Update localStorage
    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    // Trigger update
    window.dispatchEvent(new Event('storage'));
  };

  const [scholarships] = useState([
    {
      id: 1,
      title: 'Excellence Scholarship Program 2024',
      provider: 'Global Education Foundation',
      coverage: 'Full Tuition',
      deadline: 'March 31, 2024',
      type: 'Merit-based',
      requirements: ['Minimum GPA of 3.5', 'Leadership experience', 'Community service'],
      value: '₱100,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-psd/scholarship-program-psd-post-social-media_1322208-245.jpg',
      description: `Full scholarship opportunity for outstanding students!`,
    },
    {
      id: 2,
      title: 'STEM Future Leaders Grant',
      provider: 'Tech Innovators Foundation',
      coverage: 'Partial Tuition',
      deadline: 'April 15, 2024',
      type: 'Need-based',
      requirements: ['Pursuing STEM degree', 'Financial need proof'],
      value: '₱75,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/stem-scholarship-announcement_123827-234.jpg',
      description: `Supporting future STEM leaders with financial aid!`,
    },
    {
      id: 3,
      title: 'Global Citizens Scholarship',
      provider: 'World Scholarship Organization',
      coverage: 'Full Tuition + Living Stipend',
      deadline: 'May 1, 2024',
      type: 'International',
      requirements: ['Essay submission', 'Language proficiency'],
      value: '₱150,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/global-education-scholarship-banner_654123-567.jpg',
      description: `Empowering students with global education opportunities!`,
    },
    {
      id: 4,
      title: 'Women in Tech Scholarship',
      provider: 'SheCodes Foundation',
      coverage: 'Full Tuition',
      deadline: 'June 10, 2024',
      type: 'Diversity-based',
      requirements: ['Female applicants only', 'Tech-related course'],
      value: '₱120,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/women-tech-scholarship-promo_789654-345.jpg',
      description: `Encouraging women to thrive in technology fields!`,
    },
    {
      id: 5,
      title: 'Entrepreneurs of Tomorrow Grant',
      provider: 'Startup Innovators Fund',
      coverage: 'Tuition + Seed Funding',
      deadline: 'July 5, 2024',
      type: 'Entrepreneurial',
      requirements: ['Business idea proposal', 'Leadership experience'],
      value: '₱200,000 total',
      duration: 'One-time',
      scholarshipImage: 'https://img.freepik.com/premium-photo/startup-scholarship-ad_987654-432.jpg',
      description: `Helping young entrepreneurs bring ideas to life!`,
    },
    {
      id: 6,
      title: 'Healthcare Heroes Scholarship',
      provider: 'Medical Excellence Foundation',
      coverage: 'Full Tuition + Medical Supplies',
      deadline: 'August 20, 2024',
      type: 'Healthcare-based',
      requirements: ['Pursuing medical degree', 'Volunteer experience'],
      value: '₱150,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/medical-scholarship-poster_765432-678.jpg',
      description: `Supporting future healthcare professionals!`,
    },
    {
      id: 7,
      title: 'Green Future Scholarship',
      provider: 'Eco-Friendly Initiatives',
      coverage: 'Partial Tuition',
      deadline: 'September 15, 2024',
      type: 'Environmental',
      requirements: ['Sustainability project', 'Community involvement'],
      value: '₱80,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/environmental-scholarship-announcement_456123-789.jpg',
      description: `Promoting sustainability and environmental advocacy!`,
    },
    {
      id: 8,
      title: 'Creative Arts Excellence Award',
      provider: 'National Arts Council',
      coverage: 'Full Tuition + Art Supplies',
      deadline: 'October 30, 2024',
      type: 'Artistic',
      requirements: ['Portfolio submission', 'Creative talent'],
      value: '₱110,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/art-scholarship-advertisement_321987-543.jpg',
      description: `Empowering young artists to achieve excellence!`,
    },
    {
      id: 9,
      title: 'Athletic Excellence Grant',
      provider: 'Sports Development League',
      coverage: 'Full Tuition + Training Support',
      deadline: 'November 10, 2024',
      type: 'Athletic',
      requirements: ['Sports achievements', 'Commitment to training'],
      value: '₱130,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/sports-scholarship-announcement_908765-345.jpg',
      description: `Helping student-athletes reach their full potential!`,
    },
    {
      id: 10,
      title: 'Innovators in Science Grant',
      provider: 'Future Scientists Initiative',
      coverage: 'Full Tuition + Research Funding',
      deadline: 'December 5, 2024',
      type: 'Scientific Research',
      requirements: ['STEM major', 'Research proposal'],
      value: '₱140,000 per year',
      duration: '4 years',
      scholarshipImage: 'https://img.freepik.com/premium-photo/science-scholarship-banner_876543-432.jpg',
      description: `Funding the next generation of scientific breakthroughs!`,
    }
  ]);
  const [sortedScholarships, setSortedScholarships] = useState(scholarships);
  const [query, setQuery] = useState("");
  
  const filterAndSortScholarships = (query, scholarships) => {
    if (!query.trim()) return scholarships; // Return all if query is empty
  
    return scholarships
      .filter(({ title, provider, description }) =>
        [title, provider, description].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      )
      .sort((a, b) => b.rating - a.rating || b.openPositions - a.openPositions);
  };
  
  useEffect(() => {
    setSortedScholarships(filterAndSortScholarships(query, scholarships));
  }, [query, scholarships]); // Runs when `query` or `companies` change
  
  return (
    <>
      <SearchData
          placeholder="Find a Scholarship..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="w-full"
      />
      <Box sx={{
        display: 'flex',
        position: 'fixed',
        top: headerHeight,
        left: isCollapsed ? '80px' : '250px',
        right: 0,
        bottom: 0,
        transition: 'left 0.3s'
      }}>
        {/* Applications List Panel */}
        <Box sx={{
          width: '60%',
          height: '100%',
          overflowY: 'auto',
          p: 3,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <Typography variant="h4" gutterBottom>
            Scholarship Applications
          </Typography>
          <Grid container spacing={2}>
            {sortedScholarships.map(scholarship => (
              <Grid item xs={12} key={scholarship.id}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedScholarship(scholarship)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selectedScholarship?.id === scholarship.id ? 'primary.main' : 'divider',
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
                      src={scholarship.scholarshipImage}
                      sx={{ width: 60, height: 60 }}
                    >
                      {scholarship.provider[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{scholarship.title}</Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {scholarship.provider}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip icon={<School />} label={scholarship.type} size="small" />
                        <Chip icon={<Payment />} label={scholarship.value} size="small" />
                        <Chip icon={<AccessTime />} label={scholarship.deadline} size="small" />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
            {sortedScholarships.length <= 0 && (
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
                    No scholarship applications yet
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Application View Panel */}
        <Box sx={{
          width: '40%',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}>
          <ScholarshipApplicationView
            scholarship={selectedScholarship}
            onWithdraw={handleWithdrawal}
          />
        </Box>
      </Box>
    </>
  );
};

export default ScholarshipApplications;
