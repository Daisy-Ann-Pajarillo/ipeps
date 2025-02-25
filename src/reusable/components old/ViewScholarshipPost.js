import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
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

const ViewScholarshipsPost = (props) => {
  const [postSaved, setPostSaved] = useState(false);

  useEffect(() => {
    if (props?.id) {
      checkIfSavedPost();
    }
  }, [props?.id]);

  const checkIfSavedPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-scholarships-postings/check-if-saved`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setPostSaved(response?.data?.saved ? response?.data?.saved : false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const savePost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-scholarships-postings/add`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        checkIfSavedPost();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const removeSavedTrainingPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-scholarships-postings/remove`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        checkIfSavedPost();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <Dialog
      open={props.show}
      onClose={props.onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>{/* Job Post */}</DialogTitle>
      <DialogContent>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className='container' style={{ maxWidth: 250, padding: 10 }}>
                <img src={props?.logoImg} className='img-fluid' alt="Logo" />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2">{props?.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{props?.posterName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ paddingRight: '10px' }}>
              {postSaved ? (
                <Button variant="contained" color="primary" onClick={removeSavedTrainingPost}>
                  Unsave
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={savePost}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewScholarshipsPost);
