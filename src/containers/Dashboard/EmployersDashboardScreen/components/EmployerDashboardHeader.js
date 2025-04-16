import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Divider,
  Button,
  Modal,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  NotificationsOutlined, 
  Close as CloseIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';
import axios from '../../../../axios';
import { useSelector } from 'react-redux';

const EmployerDashboardHeader = ({ isCollapsed, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    jobPosting: true,
    trainingPosting: true,
    scholarshipPosting: true
  });
  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);

  const auth = useSelector(state => state.auth);

  // Fetch announcements
  useEffect(() => {
    // Demo announcements - in production, fetch from API
    const demoAnnouncements = [
      {
        id: 1,
        title: "New Feature: Enhanced Applicant Tracking",
        message: "We've launched a new feature to help you track applicants more efficiently. Now you can see detailed analytics on each application and set up automated responses.",
        date: "2023-12-10T09:00:00",
        read: false,
        severity: "info",
        from: "System Admin"
      },
      {
        id: 2,
        title: "System Maintenance Notice",
        message: "IPEPS will undergo scheduled maintenance on December 15th from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience this may cause.",
        date: "2023-12-08T14:30:00",
        read: false,
        severity: "warning",
        from: "Technical Support"
      },
      {
        id: 3,
        title: "New Talent Pool Available",
        message: "We've partnered with top universities to bring you access to a new pool of graduating students with technology backgrounds. These candidates are available for immediate hiring and internship opportunities.",
        date: "2023-12-05T11:15:00",
        read: true,
        severity: "info",
        from: "Partnership Team"
      },
    ];

    setAnnouncements(demoAnnouncements);
    setUnreadAnnouncements(demoAnnouncements.filter(a => !a.read).length);

    // In production, use API call:
    /*
    if (auth.token) {
      axios.get('/api/employer/announcements', {
        auth: { username: auth.token }
      })
      .then(response => {
        setAnnouncements(response.data.announcements);
        setUnreadAnnouncements(response.data.announcements.filter(a => !a.read).length);
      })
      .catch(error => console.error('Error fetching announcements:', error));
    }
    */
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, searchFilters);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    setSearchFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all announcements as read when opening notifications
    if (unreadAnnouncements > 0) {
      setAnnouncements(prev => prev.map(a => ({ ...a, read: true })));
      setUnreadAnnouncements(0);
    }
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setOpenAnnouncementModal(true);
    handleNotificationsClose();
  };

  const handleModalClose = () => {
    setOpenAnnouncementModal(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: isCollapsed ? '80px' : '250px',
        right: 0,
        backgroundColor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.75rem 1.5rem',
        zIndex: 1100,
        transition: 'left 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        borderRadius: '0 0 16px 16px',
      }}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ flexGrow: 1, maxWidth: '600px' }}>
        <TextField
          placeholder="Search jobs, trainings, scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Search Filters">
                  <IconButton 
                    size="small" 
                    onClick={handleFilterClick}
                    sx={{ 
                      color: Object.values(searchFilters).some(v => !v) 
                        ? 'primary.main' 
                        : 'action' 
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '8px',
              backgroundColor: '#f5f5f7',
              '&:hover': {
                backgroundColor: '#eeeef0'
              },
              '& fieldset': {
                border: 'none'
              }
            }
          }}
        />
      </form>

      {/* Filters Popover */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          elevation: 2,
          sx: { 
            borderRadius: '8px',
            minWidth: '200px',
            mt: 1,
            p: 0.5
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '100%' }}>
            Search Filters
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleFilterChange('jobPosting')}>
          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
            <Typography>Job Postings</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: '2px solid',
                borderColor: searchFilters.jobPosting ? 'primary.main' : 'grey.400',
                backgroundColor: searchFilters.jobPosting ? 'primary.main' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {searchFilters.jobPosting && 
                <CloseIcon sx={{ color: 'white', fontSize: 14 }} />
              }
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange('trainingPosting')}>
          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
            <Typography>Training Postings</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: '2px solid',
                borderColor: searchFilters.trainingPosting ? 'primary.main' : 'grey.400',
                backgroundColor: searchFilters.trainingPosting ? 'primary.main' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {searchFilters.trainingPosting && 
                <CloseIcon sx={{ color: 'white', fontSize: 14 }} />
              }
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange('scholarshipPosting')}>
          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
            <Typography>Scholarship Postings</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: '2px solid',
                borderColor: searchFilters.scholarshipPosting ? 'primary.main' : 'grey.400',
                backgroundColor: searchFilters.scholarshipPosting ? 'primary.main' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {searchFilters.scholarshipPosting && 
                <CloseIcon sx={{ color: 'white', fontSize: 14 }} />
              }
            </Box>
          </Box>
        </MenuItem>
      </Menu>

      {/* Notifications */}
      <Box>
        <Tooltip title="Announcements">
          <IconButton onClick={handleNotificationsClick} size="large">
            <Badge badgeContent={unreadAnnouncements} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Notifications Popover */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 2,
          sx: { 
            borderRadius: '8px',
            width: '360px',
            maxWidth: '90vw',
            maxHeight: '70vh'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={2} bgcolor="background.paper">
          <Typography variant="subtitle1" fontWeight="bold">
            Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            System announcements and important updates
          </Typography>
          <Divider />
        </Box>

        <List sx={{ p: 0 }}>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <ListItem
                key={announcement.id}
                button
                onClick={() => handleAnnouncementClick(announcement)}
                sx={{
                  borderLeft: '4px solid',
                  borderLeftColor: announcement.severity === 'warning' 
                    ? 'warning.main' 
                    : announcement.severity === 'error'
                      ? 'error.main'
                      : 'info.main',
                  bgcolor: !announcement.read ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {announcement.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(announcement.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {announcement.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    From: {announcement.from}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                primary="No announcements"
                secondary="You don't have any announcements at the moment"
              />
            </ListItem>
          )}
        </List>
      </Menu>

      {/* Announcement Detail Modal */}
      <Modal
        open={openAnnouncementModal}
        onClose={handleModalClose}
        aria-labelledby="announcement-modal-title"
        aria-describedby="announcement-modal-description"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxWidth: '90vw',
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none',
            overflow: 'auto'
          }}
        >
          {selectedAnnouncement && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography id="announcement-modal-title" variant="h6" component="h2" fontWeight="bold">
                  {selectedAnnouncement.title}
                </Typography>
                <IconButton size="small" onClick={handleModalClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      bgcolor: selectedAnnouncement.severity === 'warning' 
                        ? 'warning.main' 
                        : selectedAnnouncement.severity === 'error'
                          ? 'error.main'
                          : 'primary.main',
                    }}
                  >
                    <NotificationsOutlined sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAnnouncement.from}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedAnnouncement.date).toLocaleString()}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography id="announcement-modal-description" variant="body1" mb={3} sx={{ whiteSpace: 'pre-line' }}>
                {selectedAnnouncement.message}
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleModalClose}
                sx={{ borderRadius: '8px' }}
              >
                Close
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default EmployerDashboardHeader;