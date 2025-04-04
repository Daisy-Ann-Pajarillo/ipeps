import React, { useState } from 'react';
import {
  Dialog,
  TextField,
  Button,
  IconButton,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  AccountCircle,
  Security,
  PrivacyTip,
  Notifications,
  ExpandMore,
  ChevronRight,
  Brightness4,
  Language,
  Business,
  PersonOutline,
  Settings as SettingsIcon,
  PowerSettingsNew,
  Close,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// Reusable Settings Menu Component
const SettingsMenu = ({ settingsMenu, expandedItems, handleItemClick, handleSubItemClick, selectedSetting }) => (
  <ul className="space-y-2">
    {settingsMenu.map((item) => (
      <React.Fragment key={item.id}>
        {/* Parent Item */}
        <li
          onClick={() => handleItemClick(item.id)}
          className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <div className="flex items-center space-x-2">
            <span>{item.icon}</span>
            <Typography variant="body1" className="text-gray-800 dark:text-white">
              {item.title}
            </Typography>
          </div>
          {expandedItems[item.id] ? <ExpandMore /> : <ChevronRight />}
        </li>

        {/* Sub Items */}
        {expandedItems[item.id] && (
          <ul className="pl-6 space-y-1">
            {item.subitems.map((subitem) => (
              <li
                key={subitem.id}
                onClick={() => handleSubItemClick(item.id, subitem.id)}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedSetting === `${item.id}-${subitem.id}`
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  {subitem.title}
                </Typography>
                {subitem.icon}
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    ))}
  </ul>
);

// Profile Dialog Component
const ProfileDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Profile Information</DialogTitle>
    <DialogContent>
      <Typography variant="body1">This is where profile information will be displayed.</Typography>
    </DialogContent>
  </Dialog>
);

const Settings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState('profile');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const settingsMenu = [
    {
      id: 'account',
      title: 'Account Management',
      icon: <PowerSettingsNew />,
      subitems: [
        { id: 'hibernate', title: 'Hibernate account', icon: <ChevronRight /> },
        { id: 'delete', title: 'Delete account', icon: <ChevronRight /> },
      ],
    },
  ];

  const handleItemClick = (itemId) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSubItemClick = (itemId, subItemId) => {
    if (itemId === 'profile' && subItemId === 'basic-info') {
      setProfileDialogOpen(true);
    }
    setSelectedSetting(`${itemId}-${subItemId}`);
  };

  return (
    <div className="w-full p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </Typography>
      <hr className="border-gray-300 dark:border-gray-700 mb-6" />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Settings Menu */}
        <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <SettingsMenu
            settingsMenu={settingsMenu}
            expandedItems={expandedItems}
            handleItemClick={handleItemClick}
            handleSubItemClick={handleSubItemClick}
            selectedSetting={selectedSetting}
          />
          {/* Link to Profile Information */}
          <a href="/user-application-form?click_from=profile" className="block mt-4 text-blue-500 hover:underline">
            Profile Information
          </a>
        </div>

        {/* Profile Dialog */}
        <ProfileDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} />
      </div>
    </div>
  );
};

export default Settings;