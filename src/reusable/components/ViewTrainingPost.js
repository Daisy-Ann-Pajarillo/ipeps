import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';

import * as actions from '../../store/actions/index';
import axios from '../../axios';

const ViewTrainingPost = (props) => {
  const [trainingPostSaved, setTrainingSaved] = useState(false);

  useEffect(() => {
    if (props?.id) {
      checkIfSavedTrainingPost();
    }
  }, [props?.id]);

  const checkIfSavedTrainingPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-trainings-postings/check-if-saved`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setTrainingSaved(response?.data?.saved ? response?.data?.saved : false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const saveTrainingPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-trainings-postings/add`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        checkIfSavedTrainingPost();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const removeSavedTrainingPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-trainings-postings/remove`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        checkIfSavedTrainingPost();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={props.show}
      onClose={props.onClose}
    >
      <DialogTitle>{/* Job Post */}</DialogTitle>
      <DialogContent>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div style={{ maxWidth: 250, padding: 10 }}>
                <img src={props?.logoImg} className='img-fluid' alt="Logo" />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2">{props?.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">{props?.posterName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ paddingRight: '10px' }}>
                {trainingPostSaved ? (
                  <Button variant="contained" color="primary" onClick={removeSavedTrainingPost}>
                    Unsave
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={saveTrainingPost}>
                    Save
                  </Button>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={props?.displayDescription || ''}
                readOnly={true}
                theme="bubble"
              />
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTrainingPost);
