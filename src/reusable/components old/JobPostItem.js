import React from 'react';
import { Card, CardContent, Typography, Icon } from '@mui/material';

const JobPostItem = (props) => {
  return (
    <Card style={{ width: '18rem', height: '15rem' }} onClick={props.onClick}>
      <CardContent style={{ overflowY: 'auto' }}>
        <Typography variant="h5">{props.jobName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {props.companyName}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
            {props?.country || props?.cityMunicipality ? <Icon>location_on</Icon> : null}
            <span style={{ paddingLeft: 5 }}>
              {!props?.cityMunicipality && props?.country ?
                <>{props?.country}</> :
                null}
              {props?.cityMunicipality && !props?.country ?
                <>{props?.cityMunicipality}</> :
                null}
              {props?.cityMunicipality && props?.country ?
                <>{props?.cityMunicipality}, {props?.country}</> :
                null}
            </span>
          </div>
          {props?.experienceLevel || props?.jobType ?
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
              <Icon>work</Icon>
              <span style={{ paddingLeft: 5 }}>
                {props?.experienceLevel}
                {props?.jobType ?
                  <>, {props?.jobType}</> :
                  null}
              </span>
            </div>
            : null}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
            <Icon>attach_money</Icon>
            <span style={{ paddingLeft: 5 }}>
              PHP{" "}
              {props?.salaryRangeFrom}
              {props?.salaryRangeFrom && props?.salaryRangeTo
                ? <> - {props?.salaryRangeTo}</> : props?.salaryRangeTo}
            </span>
          </div>
          {props?.showStatus ? <>APPROVAL STATUS: {props.status}</> : null}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobPostItem;
