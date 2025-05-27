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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allPostings, setAllPostings] = useState({ jobs: [], trainings: [], scholarships: [] });

  const [notifications, setNotifications] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  useEffect(() => {
    const fetchAllPostings = async () => {
      try {
        const response = await axios.get('/api/public/all-postings', {
          auth: { username: auth.token }
        });
        setAllPostings({
          jobs: response.data.job_postings?.data || [],
          trainings: response.data.training_postings?.data || [],
          scholarships: response.data.scholarship_postings?.data || []
        });
      } catch (error) {
        console.error('Error fetching postings:', error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('/api/get-announcements', {
          auth: { username: auth.token }
        });
        setNotifications(response.data.announcements.reverse() || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    if (auth?.token) {
      fetchAllPostings();
      fetchAnnouncements();
    }
  }, [auth.token]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return setShowSearchResults(false);

    const query = searchQuery.toLowerCase();
    let results = [];

    if (filterType === 'all' || filterType === 'jobs') {
      results.push(...allPostings.jobs.filter(job =>
        job.title?.toLowerCase().includes(query) || job.description?.toLowerCase().includes(query)
      ).map(job => ({
        id: job.id,
        title: job.title,
        type: 'job',
        path: `/dashboard/job-posting`
      })));
    }

    if (filterType === 'all' || filterType === 'trainings') {
      results.push(...allPostings.trainings.filter(training =>
        training.title?.toLowerCase().includes(query)
      ).map(training => ({
        id: training.id,
        title: training.title,
        type: 'training',
        path: `/dashboard/training-posting`
      })));
    }

    if (filterType === 'all' || filterType === 'scholarships') {
      results.push(...allPostings.scholarships.filter(scholarship =>
        scholarship.title?.toLowerCase().includes(query)
      ).map(scholarship => ({
        id: scholarship.id,
        title: scholarship.title,
        type: 'scholarship',
        path: `/dashboard/scholarship-posting`
      })));
    }

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleAnnouncementOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setNotificationsAnchorEl(null);
  };

  const handleAnnouncementClose = () => {
    setSelectedAnnouncement(null);
  };

  const unreadCount = notifications.filter(n => n.isImportant).length;

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: isCollapsed ? '80px' : '250px',
      right: 0,
      zIndex: 1100,
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px'
    }}>
      {/* Search bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '60%', position: 'relative' }}>
        <TextField
          placeholder={`Search ${filterType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            backgroundColor: '#f5f5f7',
            borderRadius: 1,
            width: '100%',
            '& .MuiOutlinedInput-root': { borderRadius: 1, '& fieldset': { border: 'none' } }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => setFilterType('all')}>All</MenuItem>
                  <MenuItem onClick={() => setFilterType('jobs')}>Jobs</MenuItem>
                  <MenuItem onClick={() => setFilterType('trainings')}>Trainings</MenuItem>
                  <MenuItem onClick={() => setFilterType('scholarships')}>Scholarships</MenuItem>
                </Menu>
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1.5, backgroundColor: '#002763' }}>
          Search
        </Button>

        {/* Search result dropdown */}
        {showSearchResults && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: 'calc(100% - 80px)',
            mt: 1,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: 3,
            maxHeight: 300,
            overflowY: 'auto',
            zIndex: 1300
          }}>
            <List dense>
              {searchResults.length > 0 ? searchResults.map(result => (
                <ListItem key={result.id} button onClick={() => navigate(result.path)}>
                  <ListItemText primary={result.title} secondary={result.type} />
                </ListItem>
              )) : (
                <Typography color="text.secondary" sx={{ px: 2, py: 1 }}>No results found</Typography>
              )}
            </List>
          </Box>
        )}
      </Box>

      {/* Notifications */}
      <IconButton onClick={(e) => setNotificationsAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={() => setNotificationsAnchorEl(null)}
        PaperProps={{
          sx: {
            maxHeight: '60vh',
            width: '300px',
            borderRadius: 2,
            boxShadow: 3,
          }
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => handleAnnouncementOpen(notif)}
              sx={{
                px: 2,
                py: 1.5,
                '&:hover': { backgroundColor: '#f5f5f5' },
                backgroundColor: !notif.read ? '#e3f2fd' : 'transparent',
              }}
            >

              <ListItemText
                primary={notif.title}
                secondary={new Date(notif.created_at).toLocaleString()}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: '#757575',
                }}
              />
            </MenuItem>
          ))
        ) : (
          <Typography sx={{ p: 2, textAlign: 'center', color: '#757575' }}>
            No new notifications
          </Typography>
        )}
      </Menu>


      {/* Announcement Dialog */}
      {selectedAnnouncement && (
        <Box
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleAnnouncementClose}
        >
          <Box
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-lg mx-2 ml-20 sm:ml-16"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            {/* Header */}
            <Box className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Typography variant="subtitle1" className="font-semibold">
                {selectedAnnouncement.title}
              </Typography>
              <IconButton onClick={handleAnnouncementClose} size="small">
                <CloseIcon className="text-gray-500" />
              </IconButton>
            </Box>

            {/* Body */}
            <Box className="p-6">
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                {selectedAnnouncement.details}
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-400 mt-4 block"
              >
                {new Date(selectedAnnouncement.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default DashboardHeader;
