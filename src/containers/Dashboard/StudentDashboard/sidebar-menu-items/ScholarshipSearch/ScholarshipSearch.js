import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Grid, Avatar, Chip, IconButton } from '@mui/material';
import { tokens } from '../../../theme';
import ScholarshipView from './ScholarshipView';
import { School, AccessTime, Payment, BookmarkBorder, Bookmark } from '@mui/icons-material';
import SearchData from '../../../components/layout/Search';

const ScholarshipSearch = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState({});
  const [appliedScholarships, setAppliedScholarships] = useState({});
  const [applicationTimes, setApplicationTimes] = useState({});
  const headerHeight = '72px';
  const [scholarships, setScholarships] = useState([]);

  // Fetch scholarships from API
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get-scholarship-postings');

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug: Log the API response

        // Access the scholarship postings from the response
        const scholarshipsArray = data.scholarship_postings || [];
        setScholarships(scholarshipsArray);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    // Load saved and applied scholarships from localStorage
    const savedList = JSON.parse(localStorage.getItem('savedScholarships') || '{}');
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimesList = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    setSavedScholarships(savedList);
    setAppliedScholarships(appliedItems);
    setApplicationTimes(applicationTimesList);
  }, []);

  const handleSaveScholarship = (scholarshipId) => {
    const scholarship = scholarships.find(s => s.scholarship_id === scholarshipId);
    if (!scholarship) return;

    setSavedScholarships(prev => {
      const newSaved = { ...prev, [scholarshipId]: !prev[scholarshipId] };

      // Update savedScholarships in localStorage
      localStorage.setItem('savedScholarships', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleApplyScholarship = (scholarshipId) => {
    const now = new Date().getTime();
    const scholarship = scholarships.find(s => s.scholarship_id === scholarshipId);

    if (!scholarship) return;

    // Update applied items
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    appliedItems[`scholarship-${scholarshipId}`] = true;
    applicationTimes[`scholarship-${scholarshipId}`] = now;

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    // Update state
    setApplicationTimes(prev => ({
      ...prev,
      [`scholarship-${scholarshipId}`]: now
    }));
    setAppliedScholarships(prev => ({
      ...prev,
      [`scholarship-${scholarshipId}`]: true
    }));
  };

  const handleWithdrawApplication = (scholarshipId) => {
    const appliedItems = JSON.parse(localStorage.getItem('appliedItems') || '{}');
    const applicationTimes = JSON.parse(localStorage.getItem('applicationTimes') || '{}');

    delete appliedItems[`scholarship-${scholarshipId}`];
    delete applicationTimes[`scholarship-${scholarshipId}`];

    localStorage.setItem('appliedItems', JSON.stringify(appliedItems));
    localStorage.setItem('applicationTimes', JSON.stringify(applicationTimes));

    setAppliedScholarships(prev => {
      const newState = { ...prev };
      delete newState[`scholarship -${scholarshipId}`];
      return newState;
    });
    setApplicationTimes(prev => {
      const newState = { ...prev };
      delete newState[`scholarship-${scholarshipId}`];
      return newState;
    });
  };

  const [sortedScholarships, setSortedScholarships] = useState([]);
  const [query, setQuery] = useState("");

  const filterAndSortScholarships = (query, scholarships) => {
    if (!query.trim()) return scholarships;

    return scholarships
      .filter(({ scholarship_title, scholarship_description }) =>
        [scholarship_title, scholarship_description].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      );
  };

  useEffect(() => {
    setSortedScholarships(filterAndSortScholarships(query, scholarships));
  }, [query, scholarships]);

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
        {/* Scholarship Listings Panel */}
        <Box sx={{
          width: '60%',
          height: '100%',
          overflowY: 'auto',
          p: 3,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <Grid container spacing={2}>
            {sortedScholarships.map((scholarship) => (
              <Grid item xs={12} key={scholarship.scholarship_id}>
                <Card
                  onClick={() => setSelectedScholarship(scholarship)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: colors.primary[400] }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src="https://img.freepik.com/premium-psd/scholarship-program-psd-post-social-media_1322208-245.jpg" // Placeholder image
                        sx={{ width: 80, height: 80 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{scholarship.scholarship_title}</Typography>
                        <Typography color="text.secondary">{scholarship.scholarship_description}</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip icon={<School />} label="Scholarship" size="small" />
                        </Box>
                      </Box>
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        handleSaveScholarship(scholarship.scholarship_id);
                      }}>
                        {savedScholarships[scholarship.scholarship_id] ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
              isSaved={savedScholarships[selectedScholarship.scholarship_id]}
              isApplied={appliedScholarships[`scholarship-${selectedScholarship.scholarship_id}`]}
              applicationTime={applicationTimes[`scholarship-${selectedScholarship.scholarship_id}`]}
              onSave={() => handleSaveScholarship(selectedScholarship.scholarship_id)}
              onApply={() => handleApplyScholarship(selectedScholarship.scholarship_id)}
              onWithdraw={() => handleWithdrawApplication(selectedScholarship.scholarship_id)}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default ScholarshipSearch;