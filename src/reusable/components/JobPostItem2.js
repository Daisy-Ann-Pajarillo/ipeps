import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid2 as Grid,
} from '@mui/material';

const JobPostItem2 = (props) => {
  return (
    <Card className='mb-3' style={{ width: 'relative' }} onClick={props.onClick}>
      {props?.companyLogo ? (
        <Grid item md={4}>
          <CardMedia
            component="img"
            image={props?.companyLogo}
            alt="Company Logo"
          />
        </Grid>
      ) : null}
      <Grid item md={8}>
        <CardContent>
          <Typography variant="h5">{props.jobName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {props.companyName}
            <br />
            {!props?.cityMunicipality && props?.country ?
              <>{props?.country}</> :
              null}
            {props?.cityMunicipality && !props?.country ?
              <>{props?.cityMunicipality}</> :
              null}
            {props?.cityMunicipality && props?.country ?
              <>{props?.cityMunicipality}, {props?.country}</> :
              null}
            {props.jobType
              ?
              <> · {props.jobType} · </>
              : null}
            {props.experienceLevel
              ?
              <> · {props.experienceLevel} · </>
              : null}
            {
              props.salaryRangeFrom && props.salaryRangeTo ? <>
                {props.salaryRangeFrom}-{props.salaryRangeTo}
              </> : null
            }
            <br />
            {props?.showStatus ? <>APPROVAL STATUS: {props.status}</> : null}
          </Typography>
        </CardContent>
      </Grid>
    </Card>
  );
};

export default JobPostItem2;
