import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import { toast } from 'react-toastify';
import { Button, TextField, Typography, Box, ListItem } from '@mui/material';
import * as actions from '../../store/actions/index';
import axios from '../../axios';

const ScholarshipPostItem = (props) => {
  const [adminRemarkValue, setAdminRemarkValue] = useState('');
  const [scholarshipSaved, setScholarshipSaved] = useState(false);

  useEffect(() => {
    if (props?.id && props?.checkSaved) {
      checkIfSavedScholarshipPost();
    }
  }, [props?.id, props?.checkSaved]);

  useEffect(() => {
    if (props?.adminRemark) {
      setAdminRemarkValue(props.adminRemark);
    }
  }, [props?.adminRemark]);

  const checkIfSavedScholarshipPost = () => {
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
        setScholarshipSaved(
          response?.data?.saved ? response?.data?.saved : false
        );
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const saveScholarshipPost = () => {
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
        checkIfSavedScholarshipPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const removeSavedScholarshipPost = () => {
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
        checkIfSavedScholarshipPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickApprove = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    bodyFormData.set('status', 'APPROVED');
    bodyFormData.set('admin_remark', adminRemarkValue);

    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/scholarships-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set scholarship post status to APPROVED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickReject = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    bodyFormData.set('status', 'REJECTED');
    bodyFormData.set('admin_remark', adminRemarkValue);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/scholarships-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set scholarship post status to REJECTED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickSetFinished = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('scholarship_posting_id', props?.id);
    bodyFormData.set('status', 'FINISHED SCHOLARSHIP POST');
    bodyFormData.set('admin_remark', adminRemarkValue);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/scholarships-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set scholarship post status to FINISHED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  return (
    <ListItem
      onClick={props?.onClick}
      sx={{ backgroundColor: "#fff", padding: 2 }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h3">
          {props?.scholarshipName}
        </Typography>
        <Typography variant="h5">
          {props?.scholarshipProvider}
        </Typography>

        {props?.adminSetStatus && (
          <Typography variant="h6">
            Status: {props?.adminSetStatus}
          </Typography>
        )}
        <Box sx={{ paddingBottom: 2, whiteSpace: 'break-spaces' }}>
          <Editor
            editorState={EditorState.createWithContent(
              stateFromHTML(props?.description)
            )}
            wrapperClassName='demo-wrapper'
            editorClassName='demo-editor'
            readOnly={true}
            toolbarHidden={true}
          />
        </Box>
        {props?.checkSaved && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: 2 }}>
            {scholarshipSaved ? (
              <Button variant="contained" color="primary" onClick={removeSavedScholarshipPost}>
                Unsave
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={saveScholarshipPost}>
                Save
              </Button>
            )}
          </Box>
        )}

        {props?.adminMode && (
          <>
            <Box sx={{ width: '100%', paddingBottom: 2 }}>
              <TextField
                label="Admin Remark"
                multiline
                rows={4}
                fullWidth
                onChange={(e) => setAdminRemarkValue(e.target.value)}
                value={adminRemarkValue}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to approve this scholarship post?')) {
                    onClickApprove();
                  }
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to reject this scholarship post?')) {
                    onClickReject();
                  }
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to hide this scholarship post?')) {
                    onClickSetFinished();
                  }
                }}
              >
                Hide Scholarship Post
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ListItem>
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
)(ScholarshipPostItem);
