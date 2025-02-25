import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import { CButton, CFormGroup } from '@coreui/react';

import tesdaCertificatesRecievedTypes from '../../../../../reusable/constants/tesdaCertificatesRecievedTypes';
import tesdaSkillsCertsTypes from '../../../../../reusable/constants/tesdaSkillsCertsTypes';

const OtherTrainingItem = (props) => {
    const [editMode, setEditMode] = useState(false);
    const [course, setCourse] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [trainingInstitution, setTrainingInstitution] = useState('');
    const [certificatesReceived, setCertificatesReceived] = useState('');
    const [hoursOfTraining, setHoursOfTraining] = useState('');
    const [skillsAcquired, setSkillsAcquired] = useState('');
    const [credentialID, setCredentialID] = useState('');
    const [credentialURL, setCredentialURL] = useState('');

    useEffect(() => {
        props.onGetAuthStorage();
        setCourse(props.trainingCourseName);
        setStart(props.dateFrom);
        setEnd(props.dateTo);
        setTrainingInstitution(props.trainingInstitution);
        setCertificatesReceived(props.certificatesReceived);
        setHoursOfTraining(props.hoursOfTraining);
        setSkillsAcquired(props.skillsAcquired);
        setCredentialID(props.credentialID);
        setCredentialURL(props.credentialURL);
    }, [
        props.trainingCourseName,
        props.dateFrom,
        props.dateTo,
        props.trainingInstitution,
        props.certificatesReceived,
        props.hoursOfTraining,
        props.skillsAcquired,
        props.credentialID,
        props.credentialURL,
    ]);

    //   const updateOtherTrainingItem = (token) => {
    //     let bodyFormData = new FormData();
    //     bodyFormData.set('training_id', props.id);
    //     bodyFormData.set('training_course_name', course);
    //     bodyFormData.set('date_from', start);
    //     bodyFormData.set('date_to', end);
    //     bodyFormData.set('training_institution', trainingInstitution);
    //     bodyFormData.set('certificates_received', certificatesReceived);
    //     bodyFormData.set('hours_of_training', hoursOfTraining);
    //     bodyFormData.set('skills_acquired', skillsAcquired);
    //     bodyFormData.set('credential_id', credentialID);
    //     bodyFormData.set('credential_url', credentialURL);

    //     axios({
    //       method: 'post',
    //       auth: { username: token },
    //       url: `/api/profile-page/other-training/update`,
    //       data: bodyFormData,
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     })
    //       .then((response) => {
    //         alert('Successfully updated entry');
    //         // console.log('response', response);
    //       })
    //       .catch((error) => {
    //         console.log('error', error);
    //       });
    //   };

    //   const deleteOtherTrainingEntry = () => {
    //     let bodyFormData = new FormData();
    //     bodyFormData.set('training_id', props.id);
    //     axios({
    //       method: 'post',
    //       auth: { username: props.auth.token },
    //       url: `/api/profile-page/other-training/delete`,
    //       data: bodyFormData,
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     })
    //       .then((response) => {
    //         alert('Successfully deleted entry');
    //         // console.log('response', response);
    //       })
    //       .catch((error) => {
    //         console.log('error', error);
    //       });
    //   };


    return (
        <>
            <div className='container mt-3'>
                <div className='form-group'>
                    <div className='mb-5'>
                        <div className='form-row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label>Course</label>
                                    <CreatableSelect
                                        isClearable
                                        onChange={(newValue) => {
                                            if (newValue?.value) {
                                                setCourse(newValue.value);
                                            }
                                        }}
                                        onInputChange={(newValue) => {
                                            if (newValue?.value) {
                                                setCourse(newValue.value);
                                            }
                                        }}
                                        options={tesdaSkillsCertsTypes}
                                        placeholder={'Select a course or type your own'}
                                        isDisabled={!editMode}
                                        value={{
                                            label: course,
                                            value: course,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Start</label>
                                    <input
                                        className='form-control'
                                        type='date'
                                        onChange={(e) => {
                                            setStart(e.target.value);
                                        }}
                                        value={start}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>End</label>
                                    <input
                                        className='form-control'
                                        type='date'
                                        placeholder='mm/dd/yyyy to mm/dd/yyyy'
                                        onChange={(e) => {
                                            setEnd(e.target.value);
                                        }}
                                        value={end}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Training Institution</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder='Training Institution'
                                        onChange={(e) => {
                                            setTrainingInstitution(e.target.value);
                                        }}
                                        value={trainingInstitution}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Certificates Recieved</label>
                                    <CreatableSelect
                                        isClearable
                                        placeholder='NC I, NC II, NC III, NC IV, etc.'
                                        onChange={(newValue, actionMeta) => {
                                            if (newValue?.value) {
                                                setCertificatesReceived(newValue.value);
                                            }
                                        }}
                                        onInputChange={(newValue, actionMeta) => {
                                            if (newValue?.value) {
                                                setCertificatesReceived(newValue.value);
                                            }
                                        }}
                                        options={tesdaCertificatesRecievedTypes}
                                        isDisabled={!editMode}
                                        value={{
                                            label: certificatesReceived,
                                            value: certificatesReceived,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Hours of Training</label>
                                    <input
                                        className='form-control'
                                        type='number'
                                        placeholder='0, 200, 500'
                                        onChange={(e) => {
                                            setHoursOfTraining(e.target.value);
                                        }}
                                        value={hoursOfTraining}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Skills Acquired</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder='Cooking, Networking, Programming'
                                        onChange={(e) => {
                                            setSkillsAcquired(e.target.value);
                                        }}
                                        value={skillsAcquired}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Credential ID</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder=''
                                        onChange={(e) => {
                                            setCredentialID(e.target.value);
                                        }}
                                        value={credentialID}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Credential URL</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder=''
                                        onChange={(e) => {
                                            setCredentialURL(e.target.value);
                                        }}
                                        value={credentialURL}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                {/* <CFormGroup>
          {editMode ? (
            <>
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to save the changes?')
                  ) {
                    setEditMode(!editMode);
                    updateOtherTrainingItem(props.auth.token);
                  }
                }}
              >
                Save Changes
              </CButton>
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='warning'
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to cancel the changes?'
                    )
                  ) {
                    setEditMode(!editMode);
                  }
                }}
              >
                Cancel
              </CButton>
            </>
          ) : (
            <CButton
              className='btn btn-sm btn-primary float-right ml-2'
              color='primary'
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              Edit Entry
            </CButton>
          )}
          <CButton
            className='btn btn-sm btn-primary float-left ml-2'
            color='danger'
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete this entry? This action is irreversible.'
                )
              ) {
                deleteOtherTrainingEntry();
              }
            }}
          >
            Delete Entry
          </CButton>
        </CFormGroup> */}
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherTrainingItem);
