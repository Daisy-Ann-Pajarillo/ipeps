import React from 'react';
import { Grid2 as Grid, Typography } from '@mui/material';

const Details = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>{props?.website}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            {props?.industryClassification} | {props?.companyType}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>{props?.totalWorkforce} Employees</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ whiteSpace: 'break-spaces' }}>
            {props?.companyDescription}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Details;
