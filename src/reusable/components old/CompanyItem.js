import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CompanyItem = (props) => {
  return (
    <Card style={{ width: '18rem', height: '20rem', alignItems: 'center' }} onClick={props.onClick}>
      {props?.logoImgURL ? (
        <CardMedia
          component="img"
          image={props?.logoImgURL}
          style={{ width: 150 }}
        />
      ) : null}
      <CardContent>
        <Typography variant="h5" component="div">
          {props.companyName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CompanyItem;
