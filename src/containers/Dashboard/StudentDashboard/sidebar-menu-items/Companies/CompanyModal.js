import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Avatar, Tabs, Tab, Chip, IconButton
} from '@mui/material';
import { LocationOn, Language, People, Bookmark, BookmarkBorder, Close as CloseIcon } from '@mui/icons-material';
import Rating from '@mui/material/Rating';

const CompanyModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedCompany,
  activeTab,
  handleTabChange,
  followedCompanies,
  handleFollowCompany
}) => {
  if (!selectedCompany) return null;

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
      {/* Modal Header */}
      <DialogTitle>
        <Box className="flex justify-between items-center">
          <Box className="flex items-center gap-3">
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
              {selectedCompany.logo}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedCompany.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCompany.industry}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        {/* Company Details */}
        <Box className="flex flex-wrap gap-3 mb-4">
          <Chip icon={<LocationOn />} label={selectedCompany.location} size="small" variant="outlined" />
          <Chip icon={<Language />} label={selectedCompany.website} size="small" variant="outlined" />
          <Chip icon={<People />} label={selectedCompany.employeeCount} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {selectedCompany.description}
        </Typography>
        <Box className="flex items-center gap-2 mt-2">
          <Rating value={selectedCompany.rating} readOnly size="small" />
          <Typography variant="body2">({selectedCompany.reviews} reviews)</Typography>
        </Box>

        {/* Tabs for Jobs and Trainings */}
        <Tabs value={activeTab} onChange={handleTabChange} className="mt-4">
          <Tab label="Job Openings" />
          <Tab label="Trainings" />
        </Tabs>

        {/* Tab Content */}
        <Box className="mt-4">
          {activeTab === 0 ? (
            <Box>
              {selectedCompany.jobs.map((job) => (
                <Box key={job.id} className="p-3 border border-gray-300 rounded-lg mb-2">
                  <Typography variant="subtitle1">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.location} - {job.type}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>
              {selectedCompany.trainings.map((training) => (
                <Box key={training.id} className="p-3 border border-gray-300 rounded-lg mb-2">
                  <Typography variant="subtitle1">{training.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{training.duration} - {training.level}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)} color="secondary">Close</Button>
        <IconButton onClick={(e) => handleFollowCompany(e, selectedCompany.id)}>
          {followedCompanies[selectedCompany.id] ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyModal;