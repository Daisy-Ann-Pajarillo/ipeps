import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const OtherTraining = () => {
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [newEntry, setNewEntry] = useState({
    courseName: '',
    dateStart: '',
    dateEnd: '',
    trainingInstitution: '',
    certificatesReceived: '',
    hoursOfTraining: '',
    skillsAcquired: '',
    credentialID: '',
    credentialURL: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addTrainingHistory = () => {
    if (newEntry.courseName && newEntry.dateStart) {
      setTrainingHistory([...trainingHistory, { id: uuidv4(), ...newEntry }]);
      setNewEntry({
        courseName: '', dateStart: '', dateEnd: '', trainingInstitution: '',
        certificatesReceived: '', hoursOfTraining: '', skillsAcquired: '', credentialID: '', credentialURL: ''
      });
    }
  };

  const removeTrainingHistory = (id) => {
    setTrainingHistory(trainingHistory.filter((entry) => entry.id !== id));
  };

  return (
    <div>
      <Typography variant='h5' gutterBottom>
        Technical/Vocational Course & Other Training
      </Typography>

      {trainingHistory.map((entry) => (
        <Card key={entry.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography><strong>Course:</strong> {entry.courseName}</Typography>
            <Typography><strong>Start:</strong> {entry.dateStart}</Typography>
            <Typography><strong>End:</strong> {entry.dateEnd}</Typography>
            <Typography><strong>Institution:</strong> {entry.trainingInstitution}</Typography>
            <Typography><strong>Certificate:</strong> {entry.certificatesReceived}</Typography>
            <Typography><strong>Hours:</strong> {entry.hoursOfTraining}</Typography>
            <Typography><strong>Skills:</strong> {entry.skillsAcquired}</Typography>
            <Typography><strong>Credential ID:</strong> {entry.credentialID}</Typography>
            <Typography><strong>Credential URL:</strong> {entry.credentialURL}</Typography>
            <IconButton color='error' onClick={() => removeTrainingHistory(entry.id)}>
              <Delete />
            </IconButton>
          </CardContent>
        </Card>
      ))}

      <Typography variant='h6'>Add Entry</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label='Course Name' name='courseName' fullWidth value={newEntry.courseName} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField type='date' label='Start Date' name='dateStart' fullWidth InputLabelProps={{ shrink: true }} value={newEntry.dateStart} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField type='date' label='End Date' name='dateEnd' fullWidth InputLabelProps={{ shrink: true }} value={newEntry.dateEnd} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label='Training Institution' name='trainingInstitution' fullWidth value={newEntry.trainingInstitution} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField label='Certificates Received' name='certificatesReceived' fullWidth value={newEntry.certificatesReceived} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField type='number' label='Hours of Training' name='hoursOfTraining' fullWidth value={newEntry.hoursOfTraining} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label='Skills Acquired' name='skillsAcquired' fullWidth value={newEntry.skillsAcquired} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField label='Credential ID' name='credentialID' fullWidth value={newEntry.credentialID} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField label='Credential URL' name='credentialURL' fullWidth value={newEntry.credentialURL} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' startIcon={<Add />} onClick={addTrainingHistory}>
            Add Entry
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherTraining;
