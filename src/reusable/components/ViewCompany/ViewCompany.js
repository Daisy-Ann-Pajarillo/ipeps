import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Container,
  Grid2 as Grid,
  Avatar,
} from '@mui/material';
import Details from './Details';
import Jobs from './Jobs';
import Trainings from './Trainings';

const ViewCompany = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const content = {
    0: 'Details',
    1: 'Jobs',
    2: 'Trainings',
  };

  let selectedTabContent = null;

  if (selectedTab === 0) {
    selectedTabContent = (
      <Details
        website={props?.website}
        industryClassification={props?.industryClassification}
        companyType={props?.companyType}
        totalWorkforce={props?.totalWorkforce}
        companyDescription={props?.companyDescription}
      />
    );
  }
  if (selectedTab === 1) {
    selectedTabContent = <Jobs companyProfileID={props?.companyProfileID} />;
  }
  if (selectedTab === 2) {
    selectedTabContent = (
      <Trainings companyProfileID={props?.companyProfileID} />
    );
  }

  return (
    <Modal
      open={props?.show}
      onClose={props?.onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ width: '80%', margin: 'auto', mt: 5, bgcolor: 'background.paper', p: 4 }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Avatar
                alt={props?.companyName}
                src={props?.logoImg}
                sx={{ width: 100, height: 100, margin: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h2">
                {props?.companyName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                {Object.keys(content).map((key) => (
                  <Tab key={key} label={content[key]} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 20 }}>
              {selectedTabContent}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Modal>
  );
};

export default ViewCompany;
