import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

const ScholarshipPostItem2 = (props) => {
  return (
    <Card style={{ width: '18rem', height: '21rem' }} onClick={props.onClick}>
      {props?.logo ? (
        <CardMedia
          component="img"
          height="200"
          image={props?.logo}
          alt="Logo"
        />
      ) : null}
      <CardContent style={{ overflowY: 'auto' }}>
        <CardHeader
          title={props?.title}
          subheader={props?.posterName}
        />
        <Typography variant="body2" color="textSecondary" component="p">
          {/* Add any additional text here */}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ScholarshipPostItem2;
