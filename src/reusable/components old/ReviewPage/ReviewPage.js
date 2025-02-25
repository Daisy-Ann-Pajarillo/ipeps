import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize,
} from '@mui/material';

import axios from '../../../axios';

import PersonalInfo from './SubPages/PersonalInfo';
import JobPreference from './SubPages/JobPreference';
import LanguageDialectProficiency from './SubPages/LanguageDialectProficiency';
import EducationalBackground from './SubPages/EducationalBackground';
import OtherTraining from './SubPages/OtherTraining';
import EligibilityProfessionalLicense from './SubPages/EligibilityProfessionalLicense';
import WorkExperience from './SubPages/WorkExperience';
import OtherSkills from './SubPages/OtherSkills';

const ReviewPage = (props) => {
  const [isApplicationSent, setIsApplicationSent] = useState(false);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [adminRemarkValue, setAdminRemarkValue] = useState('');

  const toggle = () => { setModal(!modal) };

  const sendApplicationConfirmFinished = () => {
    let bodyFormData = new FormData();

    axios({
      method: 'post',
      url: '/api/user/registration/jobseeker/new-application/confirm-finished',
      data: bodyFormData,
      auth: { username: props.auth.token },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        if (response.data && response.data.confirm_success === true) {
          setMessage(response.data.message);
          setErrors([]);
          setIsApplicationSent(true);
        } else if (response.data.confirm_success === false) {
          setMessage(response.data.message);
          setErrors(response.data.page_errors);
          setIsApplicationSent(false);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const sendSetStatus = (status) => {
    let bodyFormData = new FormData();
    bodyFormData.set('admin_set_status', status);
    bodyFormData.set('admin_remark', adminRemarkValue);
    bodyFormData.set('jobseeker_app_id', props?.pageData?.id);
    axios({
      method: 'post',
      url: '/api/user/registration/jobseeker/new-application/admin-set-status',
      data: bodyFormData,
      auth: { username: props.auth.token },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        alert(`User status set to ${status}`);
        props.onCloseWhenApproveRejectClicked();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const sendMergeData = (id) => {
    let bodyFormData = new FormData();
    let url = '/api/user/registration/jobseeker/new-application/admin-merge-jobseeker-data-to-db';
    if (props?.userData?.user_type === "EMPLOYER") {
      url = '/api/user/registration/employer/new-application/admin-merge-jobseeker-data-to-db'
    }
    bodyFormData.set('jobseeker_app_id', id);
    axios({
      method: 'post',
      url: url,
      data: bodyFormData,
      auth: { username: props.auth.token },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        alert(`Successfully merged user data to database`);
      })
      .catch((error) => {
        alert(`Error merging user data to database`);
        console.log('error', error);
      });

  };

  useEffect(() => {
    setAdminRemarkValue(
      props?.pageData?.admin_remark === null
        || props?.pageData?.admin_remark === 'null' ? '' :
        props?.pageData?.admin_remark);
  }, [props.pageData.admin_remark]);

  return (
    <>
      <Dialog open={modal} onClose={toggle}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>
            I attest to the truthfulness, accuracy and genuineness of all the
            information and documents contained and attached to this
            application and that I shall be liable for any misrepresentation,
            fraudulent declaration and all its consequences.
          </p>

          {message ? (
            <>
              <br />
              <hr />
              <p>{message}</p>
            </>
          ) : null}
          <ol>
            {errors.length > 0
              ? errors.map((error) => {
                if (error === 'personal_info_page') {
                  return <li>Missing Personal Information</li>;
                } else if (error === 'job_preference_page') {
                  return <li>Missing Job Preference</li>;
                } else if (error === 'dialect_lang_prof_page') {
                  return <li>Missing Language/Dialect Proficiency</li>;
                } else if (error === 'edu_background_page') {
                  return <li>Missing Educational Background</li>;
                } else if (error === 'tech_voc_other_page') {
                  return <li>Missing Technical/Vocational & Other Training</li>;
                } else if (error === 'eligib_prof_page') {
                  return <li>Missing Eligibility/Professional License</li>;
                } else if (error === 'work_exp_page') {
                  return <li>Missing Work Experience</li>;
                } else if (error === 'other_skills_page') {
                  return <li>Missing Other Skills</li>;
                } else { return; }
              })
              : null}
          </ol>
          {errors.length > 0 ? (
            <p>Please go back to the pages and enter the required data</p>
          ) : null}
        </DialogContent>
        <DialogActions>
          {!isApplicationSent ? (
            <>
              <Button
                color='primary'
                onClick={sendApplicationConfirmFinished}
              >
                Submit
              </Button>
              <Button color='secondary' onClick={toggle}>
                Cancel
              </Button>
            </>
          ) : (
            <Button color='primary' href='/logout'>
              Logout
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <div style={{ padding: '5%' }}>
        <h2 style={{ textAlign: 'center' }}>Personal Information</h2>
        <br />
        <br />
        <PersonalInfo pageData={props?.pageData?.personal_info_page} />
        <hr />
        {/*  */}
        <h2 style={{ textAlign: 'center' }}>Job Preference</h2>
        <br />
        <br />
        <JobPreference pageData={props?.pageData?.job_preference_page} />
        <hr />
        {/*  */}
        <h2 style={{ textAlign: 'center' }}>Language Dialect Proficiency</h2>
        <br />
        <br />
        <LanguageDialectProficiency pageData={props?.pageData?.dialect_lang_prof_page} />
        <hr />
        {/*  */}
        <h2 style={{ textAlign: 'center' }}>Educational Background</h2>
        <br />
        <br />
        <EducationalBackground pageData={props?.pageData?.edu_background_page} />
        <hr />
        {/*  */}
        <h2 style={{ textAlign: 'center' }}>
          Technical/Vocational & Other Training
        </h2>
        <br />
        <br />
        <OtherTraining pageData={props?.pageData?.tech_voc_other_page} />
        <hr />
        {/*  */}
        <h2 style={{ textAlign: 'center' }}>Eligibility/Professional License</h2>
        <br />
        <br />
        <EligibilityProfessionalLicense pageData={props?.pageData?.eligib_prof_page} />
        <hr />
        <h2 style={{ textAlign: 'center' }}>Work Experience</h2>
        <WorkExperience pageData={props?.pageData?.work_exp_page} />
        <hr />
        <h2 style={{ textAlign: 'center' }}>Other Skills</h2>
        <br />
        <br />
        <OtherSkills pageData={props?.pageData?.other_skills_page} />
        <br />
        <br />
      </div>
      {props.adminMode ? (
        <>
          <div className='form-row'>
            <TextareaAutosize
              minRows={10}
              onChange={(e) => setAdminRemarkValue(e.target.value)}
              value={adminRemarkValue}
            />
          </div>
          <br />
          <div className='form-row'>
            <div className='col-12'>
              <div className='form-group'>
                {props?.pageData.application_merged === 'NOT MERGED' ? (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to merge this user data to the Database?'
                        )
                      ) {
                        sendMergeData(props?.pageData?.id);
                      }
                    }}
                  >
                    Merge Data to DB
                  </Button>
                ) : (
                  <Button
                    variant='contained'
                    color='warning'
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to merge this user data again to the Database? This may create duplicate entries.'
                        )
                      ) {
                        sendMergeData(props?.pageData?.id);
                      }
                    }}
                  >
                    Merge Data again to DB
                  </Button>
                )}

                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    if (window.confirm('Approve this user?')) {
                      sendSetStatus('APPROVED');
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Reject this user?')) {
                      sendSetStatus('REJECTED');
                    }
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setModal(true);
            }}
          >
            Submit
          </Button>
          {props.selectedTab !== 1 ? (
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                props.onClickPrevPage()
              }}
            >
              Back
            </Button>
          ) : null}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReviewPage);
