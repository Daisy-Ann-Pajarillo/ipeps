import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid2 as Grid, TextField, Typography, Divider } from '@mui/material';

const EligibilityProfessionalLicense = (props) => {
  const [civilServiceEligibilities, setCivilServiceEligibilities] = useState([]);
  const [prcProfLicenses, setPrcProfLicenses] = useState([]);

  // useEffect(() => {
  //   if (props.pageData) {
  //     if (
  //       props.pageData.civil_service_eligib &&
  //       props.pageData.prc_prof_licenses
  //     ) {
  //       setCivilServiceEligibilities(
  //         JSON.parse(props.pageData.civil_service_eligib)
  //       );
  //       setPrcProfLicenses(JSON.parse(props.pageData.prc_prof_licenses));
  //     }
  //   }
  // }, [props.pageData]);

  const onRemovePrcProfLicenses = (id) => {
    if (id !== '') {
      const index = prcProfLicenses.findIndex((p) => p.id === id);
      if (index > -1) {
        let newPrcProfLicenses = prcProfLicenses;
        newPrcProfLicenses.splice(index, 1);
        setPrcProfLicenses([...newPrcProfLicenses]);
      }
    }
  };

  return (
    <>
      <div
        className='tab-pane fade active show'
        id='eligibility-form'
        role='tabpanel'
        aria-labelledby='eligiblity-background-tab'
      >
        <Typography variant="h5">Civil Service</Typography>
        {civilServiceEligibilities.length === 0 ?
          <Typography>No entries</Typography> : null}
        {/* Civil Service Elib DATA ENTRIES */}
        {civilServiceEligibilities.map((civilServiceElibEntry, index) => {
          return (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Eligibility Name"
                    variant="outlined"
                    fullWidth
                    value={civilServiceElibEntry.eligibilityName}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Examination"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={civilServiceElibEntry.dateOfExamination}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Rating"
                    variant="outlined"
                    fullWidth
                    value={civilServiceElibEntry.rating}
                    disabled
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </div>
          );
        })}
        <br />
        <Typography variant="h5">Professional License (PRC)</Typography>
        {prcProfLicenses.length === 0 ?
          <Typography>No entries</Typography> : null}
        {/* Prof Licenses ENTRY DATA */}
        {prcProfLicenses.map((prcProfEntry, index) => {
          return (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Professional License"
                    variant="outlined"
                    fullWidth
                    value={prcProfEntry.licenseName}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Valid Until"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={prcProfEntry.validityDate}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </div>
          );
        })}
        <br />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(EligibilityProfessionalLicense);
