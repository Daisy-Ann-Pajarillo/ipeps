import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid2 as Grid, TextField, Checkbox, FormControlLabel, Typography, Divider } from '@mui/material';

const EducationalBackground = (props) => {
  const [educationHistory, setEducationHistory] = useState([]);

  // For Updating Field When there is saved form data
  // useEffect(() => {
  //   // Do some Updating of page data
  //   if (Array.isArray(props.pageData)) {
  //     setEducationHistory(props.pageData);
  //   }
  // }, [props.pageData]);

  return (
    <div
      className='tab-pane fade active show'
      id='educational-background'
      role='tabpanel'
      aria-labelledby='educational-background-tab'
    >
      {educationHistory.map((educationEntry, index) => {
        return (
          <div key={index}>
            {/* Row 1 */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="School"
                  fullWidth
                  id={'schoolName_' + educationEntry.id}
                  value={educationEntry.schoolName}
                  disabled
                />
              </Grid>
            </Grid>
            {/* Row 2 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Date From"
                  type="date"
                  fullWidth
                  id={'schoolyearfrom_' + educationEntry.id}
                  value={educationEntry.dateFrom}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Date To"
                  type="date"
                  fullWidth
                  id={'schoolyearto_' + educationEntry.id}
                  value={educationEntry.dateTo}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={'currentStatus_' + educationEntry.id}
                      checked={educationEntry.isCurrent}
                      disabled
                    />
                  }
                  label="Currently Attending"
                />
              </Grid>
            </Grid>
            {/* Row 3 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Degree or Qualification"
                  fullWidth
                  id={'degreeQualification' + educationEntry.id}
                  value={educationEntry.degreeQualification}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Educational Level"
                  fullWidth
                  id={'educationalLevel' + educationEntry.id}
                  value={educationEntry.educationalLevel}
                  disabled
                />
              </Grid>
            </Grid>
            {/* Row 4 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Field of Study"
                  fullWidth
                  id={'fieldOfStudy_' + educationEntry.id}
                  value={educationEntry.fieldOfStudy}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Major (optional)"
                  fullWidth
                  id={'major_' + educationEntry.id}
                  value={educationEntry.major}
                  disabled
                />
              </Grid>
            </Grid>
            {/* Row 5 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Program Duration in Years"
                  type="number"
                  fullWidth
                  placeholder='4, 5 years etc...'
                  id={'program_duration_' + educationEntry.id}
                  value={educationEntry.programDuration}
                  disabled
                />
              </Grid>
            </Grid>
            <br />
            <Divider />
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

export default connect(mapStateToProps)(EducationalBackground);
EducationalBackground.defaultProps = {
  pageData: [],
};
