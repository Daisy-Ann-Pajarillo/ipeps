import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button, Paper } from '@mui/material';
import { School, AccessTime, Payment } from '@mui/icons-material';
import ScholarshipView from '../ScholarshipSearch/ScholarshipView';
import SearchData from '../../../components/layout/Search';
const SavedScholarships = ({ isCollapsed }) => {
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedScholarships, setAppliedScholarships] = useState({});
  const [applicationTimes, setApplicationTimes] = useState({});
  const headerHeight = '72px';

  useEffect(() => {
    const loadSavedScholarships = () => {
      const savedList = JSON.parse(localStorage.getItem('savedScholarships') || '{}');
      const allScholarships = JSON.parse(localStorage.getItem('allScholarships') || '[]');

      // Get only saved scholarships
      const savedScholarshipsData = allScholarships.filter(scholarship => 
        savedList[scholarship.id]
      );

      setSavedScholarships(savedScholarshipsData);
      console.log('Loaded saved scholarships:', savedScholarshipsData); // Debug log
    };

    loadSavedScholarships();
    window.addEventListener('storage', loadSavedScholarships);
    return () => window.removeEventListener('storage', loadSavedScholarships);
  }, []);

  const handleRemoveFromSaved = (scholarshipId) => {
    const savedList = JSON.parse(localStorage.getItem('savedScholarships') || '{}');
    delete savedList[scholarshipId];
    localStorage.setItem('savedScholarships', JSON.stringify(savedList));
    
    setSavedScholarships(prev => prev.filter(s => s.id !== scholarshipId));
    if (selectedScholarship?.id === scholarshipId) {
      setSelectedScholarship(null);
    }
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleApplyScholarship = (scholarshipId) => {
    // Same application logic as in ScholarshipSearch
    const now = new Date().getTime();
    const scholarship = savedScholarships.find(s => s.id === scholarshipId);
    
    if (!scholarship) return;

    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');
    
    appliedItems[`scholarship-${scholarshipId}`] = true;
    applicationTimes[`scholarship-${scholarshipId}`] = now;

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    setAppliedScholarships(prev => ({
      ...prev,
      [`scholarship-${scholarshipId}`]: true
    }));
    setApplicationTimes(prev => ({
      ...prev,
      [`scholarship-${scholarshipId}`]: now
    }));

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
    <Box>
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
        {/* Saved Scholarships List */}
        <Box sx={{ 
          width: '60%',
          height: '100%',
          overflowY: 'auto',
          p: 3,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <Typography variant="h4" gutterBottom>
            Saved Scholarships
          </Typography>
          <Grid container spacing={2}>
            {sortedScholarships.map(scholarship => (
              <Grid item xs={12} key={scholarship.id}>
                <Card
                  onClick={() => setSelectedScholarship(scholarship)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSaved(scholarship.id);
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={scholarship.scholarshipImage}
                        sx={{ width: 80, height: 80 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{scholarship.title}</Typography>
                        <Typography color="text.secondary">{scholarship.provider}</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip icon={<School />} label={scholarship.type} size="small" sx={{ mr: 1 }} />
                          <Chip icon={<Payment />} label={scholarship.value} size="small" sx={{ mr: 1 }} />
                          <Chip icon={<AccessTime />} label={scholarship.deadline} size="small" />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
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
                    No saved scholarships yet
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Scholarship View Panel */}
        <Box sx={{ 
          width: '40%',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}>
          {selectedScholarship && (
            <ScholarshipView 
              scholarship={selectedScholarship}
              isSaved={true}
              isApplied={appliedScholarships[`scholarship-${selectedScholarship.id}`]}
              applicationTime={applicationTimes[`scholarship-${selectedScholarship.id}`]}
              onSave={() => handleRemoveFromSaved(selectedScholarship.id)}
              onApply={() => handleApplyScholarship(selectedScholarship.id)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedScholarships;
