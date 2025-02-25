import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import workExperienceStatusTypes from '../../../../reusable/constants/workExperienceStatusTypes';
import { Autocomplete, Grid2 as Grid, TextField, Typography, Divider } from '@mui/material';

const WorkExperience = (props) => {
  const [workExperienceEntries, setWorkExperienceEntries] = useState([]);

  // useEffect(() => {
  //   if (Array.isArray(props.pageData)) {
  //     setWorkExperienceEntries(props.pageData);
  //   }
  // }, [props.pageData]);

  return (
    <div
      className='tab-pane fade active show'
      id='work-experience-form'
      role='tabpanel'
      aria-labelledby='work-experience-background-tab'
    >
      {workExperienceEntries.length === 0 ? <Typography>No work entries</Typography> : null}
      {workExperienceEntries.map((workExpEntry, index) => {
        return (
          <div key={index}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  value={workExpEntry.companyName}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Address"
                  value={workExpEntry.companyAddress}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
            {/* 2nd Row */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Position"
                  value={workExpEntry.position}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={workExperienceStatusTypes}
                  value={{
                    label: workExpEntry.workExpStatus,
                    value: workExpEntry.workExpStatus,
                  }}
                  onChange={(event, newValue) => {
                    // Handle the change if needed
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Work Experience Status"
                      variant="outlined"
                      disabled={props.isDisabled}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* 3rd Row */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Inclusive Date Start"
                  type="date"
                  value={workExpEntry.dateStart}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Inclusive Date End"
                  type="date"
                  value={workExpEntry.dateEnd}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Grid>
            </Grid>
            {/* 4th Row */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Number of Months"
                  type="number"
                  value={workExpEntry.numberOfMonths}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </div>
        );
      })}
      <br />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(WorkExperience);
