import React, { useState, useEffect } from 'react';
import {
  Box, 
  TextField, 
  Button,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from '../../../../../axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allPostings, setAllPostings] = useState({
    jobs: [],
    trainings: [],
    scholarships: []
  });
  
  // Announcement state
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  // Fetch all postings when component mounts
  useEffect(() => {
    const fetchAllPostings = async () => {
      try {
        const response = await axios.get('/api/public/all-postings', {
          auth: { username: auth.token }
        });
        
        if (response.data) {
          setAllPostings({
            jobs: response.data.job_postings?.data || [],
            trainings: response.data.training_postings?.data || [],
            scholarships: response.data.scholarship_postings?.data || []
          });
        }
      } catch (error) {
        console.error('Error fetching postings:', error);
      }
    };
    
    if (auth && auth.token) {
      fetchAllPostings();
    }
  }, [auth.token]);
  
  useEffect(() => {
    // Mock announcements data - replace with API call in production
    setAnnouncements([
      {
        id: 1,
        title: 'System Maintenance',
        content: 'The system will be down for maintenance on Saturday from 2-4 AM. Please save your work before this time.',
        date: '2024-01-25',
        isImportant: true
      },
      {
        id: 2,
        title: 'New Feature Available',
        content: 'You can now filter candidates by skills and experience level. Try it out in the Applicants section!',
        date: '2024-01-20',
        isImportant: false
      }
    ]);
  }, []);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    handleFilterClose();
  };
  
  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncement(true);
    handleNotificationsClose();
  };

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
  };
  
  // Count unread important announcements
  const unreadCount = announcements.filter(a => a.isImportant).length;
  
  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setIsSearching(true);
    
    // Get results based on filter type
    let results = [];
    const query = searchQuery.toLowerCase();
    
    if (filterType === 'all' || filterType === 'jobs') {
      const jobResults = allPostings.jobs.filter(job => 
        job.title?.toLowerCase().includes(query) || 
        job.description?.toLowerCase().includes(query)
      ).map(job => ({
        id: job.id,
        title: job.title,
        type: 'job',
        path: `/dashboard/job-posting`
      }));
      results = [...results, ...jobResults];
    }
    
    if (filterType === 'all' || filterType === 'trainings') {
      const trainingResults = allPostings.trainings.filter(training => 
        training.title?.toLowerCase().includes(query) || 
        training.description?.toLowerCase().includes(query)
      ).map(training => ({
        id: training.id,
        title: training.title,
        type: 'training',
        path: `/dashboard/training-posting`
      }));
      results = [...results, ...trainingResults];
    }
    
    if (filterType === 'all' || filterType === 'scholarships') {
      const scholarshipResults = allPostings.scholarships.filter(scholarship => 
        scholarship.title?.toLowerCase().includes(query) || 
        scholarship.description?.toLowerCase().includes(query)
      ).map(scholarship => ({
        id: scholarship.id,
        title: scholarship.title,
        type: 'scholarship',
        path: `/dashboard/scholarship-posting`
      }));
      results = [...results, ...scholarshipResults];
    }
    
    setSearchResults(results);
    setShowSearchResults(true);
    setIsSearching(false);
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleResultClick = (result) => {
    navigate(result.path);
    setShowSearchResults(false);
    setSearchQuery('');
  };
  
  const handleClickOutside = () => {
    // Small delay to allow click to register first
    setTimeout(() => {
      setShowSearchResults(false);
    }, 150);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: isCollapsed ? '80px' : '250px',
        right: 0,
        zIndex: 1100,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.75rem 1.5rem',
        transition: 'left 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}
    >
      {/* Search Bar with Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '60%', position: 'relative' }}>
        <TextField
          placeholder={`Search ${filterType === 'all' ? 'all' : filterType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleClickOutside}
          sx={{
            backgroundColor: '#f5f5f7',
            borderRadius: '8px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { border: 'none' }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleFilterClick}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleFilterClose}
                >
                  <MenuItem onClick={() => handleFilterSelect('all')}>All</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('jobs')}>Jobs</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('trainings')}>Trainings</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('scholarships')}>Scholarships</MenuItem>
                </Menu>
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            ml: 1.5,
            backgroundColor: '#002763',
            '&:hover': { backgroundColor: '#001a45' }
          }}
        >
          Search
        </Button>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: 'calc(100% - 80px)',
              mt: 1,
              zIndex: 1200,
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              maxHeight: '300px',
              overflow: 'auto'
            }}
          >
            <List dense>
              {searchResults.map((result) => (
                <ListItem 
                  key={`${result.type}-${result.id}`}
                  button 
                  onClick={() => handleResultClick(result)}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f5f7' },
                    borderLeft: '3px solid',
                    borderLeftColor: 
                      result.type === 'job' ? '#002763' : 
                      result.type === 'training' ? '#7E57C2' : '#FF7043'
                  }}
                >
                  <ListItemText 
                    primary={result.title} 
                    secondary={result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {showSearchResults && searchResults.length === 0 && searchQuery && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: 'calc(100% - 80px)',
              mt: 1,
              zIndex: 1200,
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              p: 2,
              textAlign: 'center'
            }}
          >
            <Typography color="text.secondary">No results found</Typography>
          </Box>
        )}
      </Box>

      {/* Announcements Icon */}
      <IconButton onClick={handleNotificationsClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      {/* Announcements Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Announcements
          </Typography>
        </Box>
        <Divider />
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <MenuItem 
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              sx={{ 
                py: 1.5,
                borderLeft: announcement.isImportant ? '4px solid #f44336' : 'none',
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight={announcement.isImportant ? 'bold' : 'normal'}>
                  {announcement.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {announcement.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(announcement.date).toLocaleDateString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No announcements</MenuItem>
        )}
      </Menu>

      {/* Announcement Dialog */}
      <Dialog
        open={showAnnouncement}
        onClose={handleCloseAnnouncement}
        maxWidth="sm"
        fullWidth
      >
        {selectedAnnouncement && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedAnnouncement.title}</Typography>
                <IconButton onClick={handleCloseAnnouncement}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography paragraph>{selectedAnnouncement.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                Posted on: {new Date(selectedAnnouncement.date).toLocaleDateString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAnnouncement}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DashboardHeader;
