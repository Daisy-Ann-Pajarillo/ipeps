import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  PersonOutline,
  Brightness4,
  Settings as SettingsIcon,
  Business,
  PowerSettingsNew,
  ExpandMore,
  ChevronRight,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const Settings = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedSetting, setSelectedSetting] = useState('profile');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  const settingsMenu = [
    { id: 'profile', title: 'Profile Information', icon: <PersonOutline />, subitems: [
      { id: 'basic-info', title: 'Name, location, and industry' },
      { id: 'demographic', title: 'Personal demographic information' }
    ]},
    { id: 'display', title: 'Display', icon: <Brightness4 />, subitems: [
      { id: 'dark-mode', title: 'Dark mode' }
    ]},
    { id: 'preferences', title: 'General Preferences', icon: <SettingsIcon />, subitems: [
      { id: 'language', title: 'Language' },
      { id: 'content-language', title: 'Content language' }
    ]},
    { id: 'partners', title: 'Partners & Services', icon: <Business />, subitems: [
      { id: 'xyz-company', title: 'XYZ Company' }
    ]},
    { id: 'account', title: 'Account Management', icon: <PowerSettingsNew />, subitems: [
      { id: 'hibernate', title: 'Hibernate account' },
      { id: 'close', title: 'Close account' }
    ]}
  ];

  const handleItemClick = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSubItemClick = (itemId, subItemId) => {
    if (itemId === 'profile' && subItemId === 'basic-info') {
      setProfileDialogOpen(true);
    }
    setSelectedSetting(`${itemId}-${subItemId}`);
  };

  const ProfileDialog = () => (
    <Dialog open={profileDialogOpen} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Profile Information</Typography>
        <IconButton onClick={() => setProfileDialogOpen(false)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }} />
            <Button variant="contained" component="label">Update Profile Picture<input type="file" hidden /></Button>
          </Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="First Name" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Last Name" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Place of Birth" /></Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 3 }} />
      <Box display="flex" gap={3}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <List>
            {settingsMenu.map((item) => (
              <React.Fragment key={item.id}>
                <ListItemButton onClick={() => handleItemClick(item.id)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                  {expandedItems[item.id] ? <ExpandMore /> : <ChevronRight />}
                </ListItemButton>
                <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subitems.map((subitem) => (
                      <ListItemButton key={subitem.id} sx={{ pl: 4 }} selected={selectedSetting === `${item.id}-${subitem.id}`}
                        onClick={() => handleSubItemClick(item.id, subitem.id)}>
                        <ListItemText primary={subitem.title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
      <ProfileDialog />
    </Box>
  );
};

export default Settings;
