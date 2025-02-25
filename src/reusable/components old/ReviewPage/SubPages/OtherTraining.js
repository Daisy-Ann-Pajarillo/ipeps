import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../../axios';
import ModalLoading from '../../../../reusable/components/ModalLoading';
import ModalPageSaved2 from '../../../../reusable/components/ModalPageSaved2';
import { Button, Grid2 as Grid, TextField, Typography } from '@mui/material';
import tesdaCertificatesRecievedTypes from '../../../../reusable/constants/tesdaCertificatesRecievedTypes';
import tesdaSkillsCertsTypes from '../../../../reusable/constants/tesdaSkillsCertsTypes';

const OtherTraining = (props) => {
  const [trainingHistory, setTrainingHistory] = useState([]);

  const [courseNameAddingValue, setCourseNameAddingValue] = useState('');
  const [dateStartAddingValue, setDateStartAddingValue] = useState('');
  const [dateEndAddingValue, setDateEndAddingValue] = useState('');
  const [trainingInstitutionAddingValue, setTrainingInstitutionAddingValue] = useState('');
  const [certificatesReceivedAddingValue, setCertificatesReceivedAddingValue] = useState('');
  const [hoursOfTrainingAddingValue, setHoursOfTrainingAddingValue] = useState('');
  const [skillsAcquiredAddingValue, setSkillsAcquiredAddingValue] = useState('');
  const [credentialID, setCredentialID] = useState('');
  const [credentialURL, setCredentialURL] = useState('');

  // Page Saving States
  const [isPageSaving, setIsPageSaving] = useState(false);
  const [pageFinishedSaving, setPageFinishedSaving] = useState(false);
  const [modalTitleMessage, setModalTitleMessage] = useState('');
  const [modalBodyMessage, setModalBodyMessage] = useState('');

  const [pageMove, setPageMove] = useState('');

  // useEffect(() => {
  //   if (Array.isArray(props.pageData)) {
  //     setTrainingHistory(props.pageData);
  //   }
  // }, [props.pageData]);

  const onAddTrainingHistory = () => {
    if (trainingHistory.length <= 20) {
      const trainingEntryData = {
        id: uuidv4(),
        courseName: courseNameAddingValue,
        dateStart: dateStartAddingValue,
        dateEnd: dateEndAddingValue,
        trainingInstitution: trainingInstitutionAddingValue,
        certificatesReceived: certificatesReceivedAddingValue,
        hoursOfTraining: hoursOfTrainingAddingValue,
        skillsAcquired: skillsAcquiredAddingValue,
        credentialID: credentialID,
        credentialURL: credentialURL,
      };
      setTrainingHistory([...trainingHistory, trainingEntryData]);

      setCourseNameAddingValue('');
      setDateStartAddingValue('');
      setDateEndAddingValue('');
      setTrainingInstitutionAddingValue('');
      setCertificatesReceivedAddingValue('');
      setHoursOfTrainingAddingValue('');
      setSkillsAcquiredAddingValue('');
      setCredentialID('');
      setCredentialURL('');
    }
  };

  const onSave = () => {
    const fieldErrors = [];
    if (courseNameAddingValue !== '') {
      fieldErrors.push('Course');
    }
    if (dateStartAddingValue !== '') {
      fieldErrors.push('Date Start');
    }
    if (dateEndAddingValue !== '') {
      fieldErrors.push('Date End');
    }
    if (trainingInstitutionAddingValue !== '') {
      fieldErrors.push('Training Institution');
    }
    if (certificatesReceivedAddingValue !== '') {
      fieldErrors.push('Certificates Received');
    }
    if (hoursOfTrainingAddingValue !== '') {
      fieldErrors.push('Hours of Training');
    }
    if (skillsAcquiredAddingValue !== '') {
      fieldErrors.push('Skills Acquired');
    }
    if (credentialID !== '') {
      fieldErrors.push('Credential ID');
    }
    if (credentialURL !== '') {
      fieldErrors.push('Credential URL');
    }
    if (fieldErrors.length === 0) {
      let bodyFormData = new FormData();
      bodyFormData.set('other_trainings', JSON.stringify(trainingHistory));
      axios({
        method: 'post',
        url: '/api/user/registration/jobseeker/tech-voc-other-page/update',
        data: bodyFormData,
        auth: { username: props.auth.token },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          setModalTitleMessage('Saved Changes');
          setModalBodyMessage('Successfully saved the changes on this page');
          setIsPageSaving(false);
          setPageFinishedSaving(true);
        })
        .catch(() => {
          setModalTitleMessage('Saving Unsuccessful');
          setModalBodyMessage('An error occurred');
          setIsPageSaving(false);
          setPageFinishedSaving(true);
        });
    } else {
      setModalTitleMessage('Saving Unsuccessful');
      setModalBodyMessage('An error occurred: ' + 'You have unsaved entries in ' + fieldErrors.join(', '));
      setIsPageSaving(false);
      setPageFinishedSaving(true);
      setPageMove('')
    }
  };

  return (
    <div>
      <Typography variant="h6">Technical Vocational</Typography>
      {trainingHistory.length === 0 ? <Typography>No entries</Typography> : null}
      {trainingHistory.map((trainingEntry) => {
        return (
          <div className='mb-5' key={trainingEntry.id}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Course"
                  fullWidth
                  value={trainingEntry.courseName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start"
                  type="date"
                  fullWidth
                  value={trainingEntry.dateStart}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End"
                  type="date"
                  fullWidth
                  value={trainingEntry.dateEnd}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Training Institution"
                  fullWidth
                  value={trainingEntry.trainingInstitution}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Certificates Received"
                  fullWidth
                  value={trainingEntry.certificatesReceived}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hours of Training"
                  type="number"
                  fullWidth
                  value={trainingEntry.hoursOfTraining}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Skills Acquired"
                  fullWidth
                  value={trainingEntry.skillsAcquired}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Credential ID"
                  fullWidth
                  value={trainingEntry.credentialID}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Credential URL"
                  fullWidth
                  value={trainingEntry.credentialURL}
                  disabled
                />
              </Grid>
            </Grid>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(OtherTraining);
