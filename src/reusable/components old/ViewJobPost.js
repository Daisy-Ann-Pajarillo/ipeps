import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  Modal,
  Box,
  Typography,
  Collapse,
  Container,
  Grid2 as Grid,
  IconButton,
} from '@mui/material';

import * as actions from '../../store/actions/index';
import axios from '../../axios';
import ConfirmationDialogUploadCV from './ConfirmationDialogUploadCV';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ViewJobPost = (props) => {
  const [jobPostSaved, setJobPostSaved] = useState(false);
  const [jobPostApplied, setJobPostApplied] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [collapse2, setCollapse2] = useState(false);

  // File Uploading and Handling
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedIDFileURL, setUploadedIDFileURL] = useState('#');
  const [applicantStatus, setApplicantStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  const toggleViewCompanyDetails = (e) => {
    setCollapse(!collapse);
    e.preventDefault();
  }

  const toggleAllQualifications = (e) => {
    setCollapse2(!collapse2);
    e.preventDefault();
  }

  useEffect(() => {
    if (props?.id) {
      checkIfSavedJobPost();
      checkIfAppliedJobPost();
      getJobPostApplicantTransaction();
    }
  }, [props?.id]);

  const getJobPostApplicantTransaction = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/applied-jobs/get-job-app-transaction`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        if (response.data.saved_job_trans.approval_status) {
          setApplicantStatus(response.data.saved_job_trans.approval_status)
        }
        if (response.data.saved_job_trans.resume_cv_file_url) {
          setUploadedIDFileURL(response.data.saved_job_trans.resume_cv_file_url);
        }
        if (response.data.saved_job_trans.remarks) {
          setRemarks(response.data.saved_job_trans.remarks);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  const checkIfSavedJobPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-job-posts/check-if-saved`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setJobPostSaved(response?.data?.saved ? response?.data?.saved : false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const saveJobPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-job-posts/add`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        checkIfSavedJobPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred when saving job post");
      });
  };

  const removeSavedJobPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-job-posts/remove`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        checkIfSavedJobPost();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred when removing job post");
      });
  };

  const checkIfAppliedJobPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/applied-jobs/check-if-applied`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setJobPostApplied(response?.data?.applied ? response?.data?.applied : false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const applyJobPost = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('job_posting_id', props?.id);
    bodyFormData.set('resume_cv_file', selectedFile);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/applied-jobs/add`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log('response', response);
        checkIfAppliedJobPost();
        getJobPostApplicantTransaction();
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred when applying job post");
      });
  };

  const otherQualificationStyles = {
    paddingBottom: 10
  }

  return (
    <Modal
      open={props.show}
      onClose={() => {
        setCollapse(false);
        setSelectedFileName('');
        setSelectedFile();
        setUploadedIDFileURL('#');
        setApplicantStatus('');
        setRemarks('');
        props.onClose();
      }}
    >
      <Box sx={{ width: '80%', margin: 'auto', marginTop: '5%' }}>
        <IconButton
          onClick={() => {
            setCollapse(false);
            setSelectedFileName('');
            setSelectedFile();
            setUploadedIDFileURL('#');
            setApplicantStatus('');
            setRemarks('');
            props.onClose();
          }}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ p: 2 }}>
          {showConfirmDialog ? <ConfirmationDialogUploadCV
            show={showConfirmDialog}
            onClose={() => {
              setShowConfirmDialog(false);
              setSelectedFile('');
              setSelectedFileName();
            }}
            onConfirm={() => {
              applyJobPost();
              setShowConfirmDialog(false);
              toast(`Successfully applied`);
            }}
            message={'Are you sure you want to apply to this job?'}
            title={'Confirmation'}
            setSelectedFile={setSelectedFile}
            setSelectedFileName={setSelectedFileName}
            selectedFileName={selectedFileName}
            selectedFile={selectedFile}
          /> : null}
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <img
                    src={props?.logoImg}
                    alt="Company Logo"
                    style={{ width: '100%', maxWidth: 320 }}
                  />
                </Box>
                <Box sx={{ paddingTop: 3 }}>
                  <Typography variant="h5" gutterBottom>{props?.companyName}</Typography>
                  <Typography variant="h6" gutterBottom>About the company</Typography>
                  <Collapse in={collapse}>
                    {props?.companyWebsite ? (
                      <Typography variant="body1" gutterBottom>
                        <ExpandMoreIcon />
                        <span style={{ paddingLeft: 5 }}>
                          {props?.companyWebsite}
                        </span>
                      </Typography>
                    ) : null}

                    {props?.companyEmail ? (
                      <Typography variant="body1" gutterBottom>
                        <ExpandMoreIcon />
                        <span style={{ paddingLeft: 5 }}>
                          {props?.companyEmail}
                        </span>
                      </Typography>
                    ) : null}
                    {props?.totalWorkforce ? (
                      <Typography variant="body1" gutterBottom>
                        <ExpandMoreIcon />
                        <span style={{ paddingLeft: 5 }}>
                          {props?.totalWorkforce}
                        </span>
                      </Typography>
                    ) : null}
                    <Typography variant="body1">{props.companyDescription}</Typography>
                  </Collapse>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={toggleViewCompanyDetails}
                    sx={{ marginBottom: 5 }}
                  >
                    {collapse ? 'Show less' : 'Show more'}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h2">{props?.jobName}</Typography>
                  <Typography variant="body1">{props?.companyName}</Typography>
                  {props?.preferredCountry || props?.preferredCityMunicipality ?
                    <Typography variant="body1">
                      <ExpandMoreIcon />
                      <span style={{ paddingLeft: 5 }}>
                        {props?.preferredCountry}
                        {props?.preferredCityMunicipality ?
                          <>, {props?.preferredCityMunicipality}</> :
                          null}
                      </span>
                    </Typography> : null
                  }
                  {props?.experienceLevel || props?.jobType ?
                    <Typography variant="body1">
                      <ExpandMoreIcon />
                      <span style={{ paddingLeft: 5 }}>
                        {props?.experienceLevel}
                        {props?.jobType ?
                          <>, {props?.jobType}</> :
                          null}
                      </span>
                    </Typography>
                    : null}
                  {props?.numOfVacancies ? (
                    <Typography variant="body1">
                      <ExpandMoreIcon />
                      <span style={{ paddingLeft: 5 }}>
                        {props?.numOfVacancies} Vacancies
                      </span>
                    </Typography>
                  ) : null}
                  {props?.salaryRangeFrom || props?.salaryRangeTo ? (<>
                    <Typography variant="body1">
                      <ExpandMoreIcon />
                      <span style={{ paddingLeft: 5 }}>
                        PHP{" "}
                        {props?.salaryRangeFrom}
                        {props?.salaryRangeFrom && props?.salaryRangeTo
                          ? <> - {props?.salaryRangeTo}</> : props?.salaryRangeTo}
                      </span>
                    </Typography>
                  </>) : null}
                  <Box sx={{ paddingBottom: 2 }}>
                    <div style={{ paddingRight: '10px' }}>
                      {jobPostSaved ? (
                        <Button variant="contained" color="primary" onClick={removeSavedJobPost}>
                          Unsave
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={saveJobPost}>
                          Save
                        </Button>
                      )}
                    </div>
                    {jobPostApplied ? (
                      <Button variant="contained" color="primary">Already Applied</Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setShowConfirmDialog(true);
                        }}
                      >
                        Apply
                      </Button>
                    )}
                  </Box>
                  {uploadedIDFileURL === '#'
                    || uploadedIDFileURL === null
                    || uploadedIDFileURL === undefined ? null :
                    <Box>
                      <Typography variant="body1">
                        Saved Resume/CV
                        <br />
                        <Button
                          variant="contained"
                          color="primary"
                          href={uploadedIDFileURL}
                          disabled={uploadedIDFileURL === '#'
                            || uploadedIDFileURL === null
                            || uploadedIDFileURL === undefined ? true : false}
                        >
                          Download File
                        </Button>
                      </Typography>
                    </Box>
                  }
                  {applicantStatus ? (
                    <Typography variant="body1">
                      Admin Approval Status:
                      {' '}
                      {applicantStatus === "FINISHED FOR APPROVAL" ? <>Wait for approval</> : <>{applicantStatus}</>}
                    </Typography>
                  ) : null}
                  {remarks ? (
                    <Typography variant="body1">
                      Admin Remarks:
                      {' '}
                      {remarks}
                    </Typography>
                  ) : null}

                  <Box sx={{ paddingTop: 1 }}>
                    <Collapse in={collapse2}>
                      <Box>
                        {props?.preferredSex && props?.preferredSex === "Both Male & Female" ? <Typography variant="h6" sx={otherQualificationStyles}>Either Male or Female</Typography> : <Typography variant="h6" sx={otherQualificationStyles}>{props?.preferredSex}</Typography>}
                        {props?.educationalLevel?.length > 0 ? (
                          <>
                            <Typography variant="h6">Educational Levels</Typography>
                            <Box>
                              <ul style={otherQualificationStyles}>
                                {props?.educationalLevel?.map(item => {
                                  return <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>{item.educational_level_name}</li>
                                })}
                              </ul>
                            </Box>
                          </>
                        ) : null}
                        {props?.qualifications?.length > 0 ? (
                          <Typography variant="h6">Qualifications</Typography>
                        ) : null}
                        <Box>
                          <ul style={otherQualificationStyles}>
                            {props?.qualifications?.map(item => {
                              return <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>{item.degree_qualification_name}</li>
                            })}
                          </ul>
                        </Box>
                        {props?.fieldOfStudy?.length > 0 ? (
                          <Typography variant="h6">Field of Studies</Typography>
                        ) : null}
                        <Box>
                          <ul style={otherQualificationStyles}>
                            {props?.fieldOfStudy?.map(item => {
                              return <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>{item.field_of_study_name}</li>
                            })}
                          </ul>
                        </Box>
                        {props?.majorsNeeded?.length > 0 ? (
                          <Typography variant="h6">Majors</Typography>
                        ) : null}
                        <Box>
                          <ul style={otherQualificationStyles}>
                            {props?.majorsNeeded?.map(item => {
                              return <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>{item.major_name}</li>
                            })}
                          </ul>
                        </Box>
                        {props?.preferredSkills?.length > 0 ? (
                          <Typography variant="h6">Skills</Typography>
                        ) : null}
                        <Box>
                          <ul style={otherQualificationStyles}>
                            {props?.preferredSkills?.map(item => {
                              return <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>{item.skill_name}</li>
                            })}
                          </ul>
                        </Box>
                        {props?.trainingsNeeded?.length > 0 ? (
                          <Typography variant="h6">Trainings</Typography>
                        ) : null}
                        <Box>
                          <ul style={otherQualificationStyles}>
                            {props?.trainingsNeeded?.map(item => {
                              return (
                                <li style={{ listStyleType: 'circle', paddingLeft: 10 }}>
                                  {item?.course_name}
                                  {item?.certificates_received ?
                                    <>,</> : null
                                  }
                                  {item?.certificates_received ? <>({item?.certificates_received})</> : null}
                                  {item?.training_institution ?
                                    <>,</> : null
                                  }
                                  {item?.training_institution}
                                </li>)
                            })}
                          </ul>
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={toggleAllQualifications}
                      sx={{ marginTop: 3, marginBottom: 3 }}
                    >
                      {collapse2 ? 'Hide All Qualifications' : 'Show All Qualifications'}
                    </Button>
                  </Box>
                  <hr />
                  <Box sx={{ whiteSpace: 'break-spaces' }}>
                    <Typography variant="body1">{props?.jobDescription}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewJobPost);
