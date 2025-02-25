import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import { toast } from 'react-toastify';
import { CButton, CLabel, CRow, CCol, CTextarea, CListGroupItem, CFormGroup } from '@coreui/react';
import * as actions from '../../store/actions/index';
import axios from '../../axios';

const TrainingPostItem = (props) => {
  const [adminRemarkValue, setAdminRemarkValue] = useState('');
  const [trainingSaved, setTrainingSaved] = useState(false);

  useEffect(() => {
    if (props?.id && props?.checkSaved) {
      checkIfSavedTrainingPost();
    }
  }, [props?.id, props?.checkSaved]);

  useEffect(() => {
    if (props.adminRemark) {
      setAdminRemarkValue(props.adminRemark);
    }
  }, [props.adminRemark]);

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
        alert("An error occurred");
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
      .then(() => {
        checkIfSavedTrainingPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
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
      .then(() => {
        checkIfSavedTrainingPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickApprove = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    bodyFormData.set('status', 'APPROVED');
    bodyFormData.set('admin_remark', adminRemarkValue);

    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/trainings-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set training post status to APPROVED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickReject = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    bodyFormData.set('status', 'REJECTED');
    bodyFormData.set('admin_remark', adminRemarkValue);

    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/trainings-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set training post status to REJECTED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const onClickSetFinished = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('training_posting_id', props?.id);
    bodyFormData.set('status', 'FINISHED TRAINING POST');
    bodyFormData.set('admin_remark', adminRemarkValue);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/trainings-posts-set-status`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully set training post status to FINISHED`);
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };


  return (
    <>
      <CListGroupItem
        className='list-group-item'
        onClick={props?.onClick}
        style={{ backgroundColor: "#fff" }}
      >
        <CRow className='row' style={{ padding: 20 }}>
          <CCol sm={12} md={12}>
            <CFormGroup>
              <h3 className='d-flex w-100 justify-content-between'>
                {props?.trainingName}
              </h3>
            </CFormGroup>
          </CCol>
          <CCol sm={12} md={12}>
            <CFormGroup>
              <h5 className='d-flex w-100 justify-content-between'>
                {props?.trainingProvider}
              </h5>
            </CFormGroup>
          </CCol>
          {props?.adminSetStatus ? (
            <CCol sm={12} md={12}>
              <CFormGroup>
                <h6 className='d-flex w-100 justify-content-between'>
                  Status: {props?.adminSetStatus}
                </h6>
              </CFormGroup>
            </CCol>
          ) : null}
          <CCol sm={12} md={12}>
            <CFormGroup>
              <div
                className='mb-1'
                style={{ paddingBottom: 15, height: 300, overflowY: 'scroll' }}
              >
                <Editor
                  editorState={EditorState.createWithContent(
                    stateFromHTML(props?.description)
                  )}
                  wrapperClassName='demo-wrapper'
                  editorClassName='demo-editor'
                  style={{ height: '100%' }}
                  disabled={true}
                  // toolbarHidden={
                  //   props.auth.user.user_type === 'JOBSEEKER' ||
                  //   props.auth.user.user_type === 'STUDENT'
                  //     ? true
                  //     : false
                  // }
                  toolbarHidden={true}
                />
              </div>
              <br />
            </CFormGroup>
          </CCol>
          {props.checkSaved ? (
            <CCol sm={12} md={12}>
              <CFormGroup>
                <div style={{ paddingRight: '10px' }}>
                  {trainingSaved ? (
                    <CButton
                      className='btn-primary'
                      onClick={removeSavedTrainingPost}
                    >
                      Unsave
                    </CButton>
                  ) : (
                    <CButton className='btn-primary' onClick={saveTrainingPost}>
                      Save
                    </CButton>
                  )}
                </div>
              </CFormGroup>
            </CCol>
          ) : null}

          {props.adminMode ? (
            <>
              <CCol sm={12} md={12}>
                <CRow>
                  <CLabel>Admin Remark</CLabel>
                  <CTextarea
                    size={10}
                    onChange={(e) => setAdminRemarkValue(e.target.value)}
                    value={adminRemarkValue}
                  />
                </CRow>
                <CRow style={{ paddingTop: 15 }}>
                  <CButton
                    className='btn-primary'
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to approve this training post?'
                        )
                      ) {
                        onClickApprove();
                      }
                    }}
                  >
                    Approve
                  </CButton>
                  <CButton
                    className='btn-danger'
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to reject this training post?'
                        )
                      ) {
                        onClickReject();
                      }
                    }}
                  >
                    Reject
                  </CButton>
                  <CButton
                    className='btn-danger'
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to hide this training post?'
                        )
                      ) {
                        onClickSetFinished()
                      }
                    }}
                  >
                    Hide Training Post
                  </CButton>
                </CRow>
              </CCol>
            </>
          ) : null}
        </CRow>
      </CListGroupItem>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TrainingPostItem);
