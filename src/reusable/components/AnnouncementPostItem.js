import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid2 as Grid,
} from '@mui/material';

import * as actions from '../../store/actions/index';
import axios from '../../axios';

const AnnouncementPostItem = (props) => {
  const [editorContent, setEditorContent] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');

  useEffect(() => {
    props.onGetAuthStorage();
  }, []);

  useEffect(() => {
    setEditorContent(props?.display_desc || '');
    setAnnouncementTitle(props?.title);
  }, [props.title, props.display_desc]);

  const onEditAnnouncementPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('announcement_id', props?.id);
    bodyFormData.set('title', announcementTitle);
    bodyFormData.set('display_desc', editorContent);
    axios({
      method: 'post',
      url: '/api/admin/announcements/update',
      data: bodyFormData,
      auth: {
        username: props.auth.token,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast('Successfully updated');
        props.onLoadAnnouncements();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onDeleteAnnouncementPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('announcement_id', props?.id);
    axios({
      method: 'post',
      url: '/api/admin/announcements/delete',
      data: bodyFormData,
      auth: {
        username: props.auth.token,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast('Successfully deleted');
        props.onLoadAnnouncements();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {props.auth.user.user_type === 'ADMIN' ? (
              <TextField
                label="Announcement Title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                fullWidth
                disabled={props.auth.user.user_type !== 'ADMIN'}
              />
            ) : (
              <Typography variant="h5">{announcementTitle}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <div style={{ paddingBottom: 15, height: 300, overflowY: 'scroll' }}>
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent}
                readOnly={props.auth.user.user_type !== 'ADMIN'}
                theme={props.auth.user.user_type === 'ADMIN' ? 'snow' : 'bubble'}
              />
            </div>
            {props.auth.user.user_type === 'ADMIN' && (
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this announcement post?')) {
                      onDeleteAnnouncementPost();
                    }
                  }}
                >
                  Delete announcement
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to update this announcement post?')) {
                      onEditAnnouncementPost();
                    }
                  }}
                >
                  Update announcement
                </Button>
              </CardActions>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null,
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
)(AnnouncementPostItem);
