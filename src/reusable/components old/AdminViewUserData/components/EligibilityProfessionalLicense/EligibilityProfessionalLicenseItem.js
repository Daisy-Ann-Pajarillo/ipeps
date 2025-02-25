import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

import {
  CContainer,
  CButton,
  CInput,
  CLabel,
  CFormGroup,
} from '@coreui/react';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import eligibilityCivilServiceTypes from '../../../../../reusable/constants/eligibilityCivilServiceTypes';
import eligibilityPRCTypes from '../../../../../reusable/constants/eligibilityPRCTypes';

const EligibilityProfessionalLicenseItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [ID, setID] = useState('');
  const [prcName, setPrcName] = useState('');
  const [prcType, setPrcType] = useState('');
  const [dateOfExamination, setDateOfExamination] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    props.onGetAuthStorage();
    setID(props.id);
    setPrcName(props.prcName);
    setPrcType(props.prcType);
    setDateOfExamination(props.dateOfExamination);
    setValidUntil(props.validUntil);
    setRating(props.rating);
  }, [
    props.prcName,
    props.prcType,
    props.dateOfExamination,
    props.validUntil,
    props.rating,
  ]);

  // const updateEligibilityProfessionalLicenseEntry = (token) => {
  //   let bodyFormData = new FormData();
  //   bodyFormData.set('eligib_prof_license_id', props.id);
  //   bodyFormData.set('prc_name', prcName);
  //   bodyFormData.set('prc_type', prcType);
  //   bodyFormData.set('date_of_examination', dateOfExamination);
  //   bodyFormData.set('valid_until', validUntil);
  //   bodyFormData.set('rating', rating);
  //   axios({
  //     method: 'post',
  //     auth: { username: token },
  //     url: `/api/profile-page/eligib-prof-license/update`,
  //     data: bodyFormData,
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   })
  //     .then((response) => {
  //       alert('Successfully updated entry');
  //       // console.log('response', response);
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     });
  // };

  // const deleteEligibilityProfessionalLicenseEntry = (token) => {
  //   let bodyFormData = new FormData();
  //   bodyFormData.set('eligib_prof_license_id', props.id);
  //   axios({
  //     method: 'post',
  //     auth: { username: token },
  //     url: `/api/profile-page/eligib-prof-license/delete`,
  //     data: bodyFormData,
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   })
  //     .then((response) => {
  //       alert('Successfully deleted entry');
  //       // console.log('response', response);
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     });
  // };

  return (
    <CContainer>
      <p>ID: {ID}</p>
      <CFormGroup>
        <CLabel>PRC Type</CLabel>
        <CreatableSelect
          isSearchable={false}
          onChange={(newValue) => {
            if (newValue?.value) {
              setPrcType(newValue.value);
            }
          }}
          onInputChange={(newValue) => {
            if (newValue?.setPrcType) {
              setPrcType(newValue.value);
            }
          }}
          options={[
            {
              value: 'PROFESSIONAL LICENSE (PRC)',
              label: 'PROFESSIONAL LICENSE (PRC)',
            },
            { value: 'CIVIL SERVICE', label: 'CIVIL SERVICE' },
          ]}
          placeholder={'Select a PRC Type'}
          isDisabled={!editMode}
          value={{ label: prcType, value: prcType }}
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel>PRC Name</CLabel>
        <CreatableSelect
          isClearable
          onChange={(newValue) => {
            if (newValue?.value) {
              setPrcName(newValue.value);
            }
          }}
          onInputChange={(newValue) => {
            if (newValue?.setPrcType) {
              setPrcName(newValue.value);
            }
          }}
          options={[...eligibilityCivilServiceTypes, ...eligibilityPRCTypes]}
          placeholder={'Select a PRC Name or type your own'}
          isDisabled={!editMode}
          value={{ label: prcName, value: prcName }}
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel>Valid Until</CLabel>
        <CInput
          type='date'
          value={validUntil}
          disabled={!editMode}
          onChange={(e) => {
            setValidUntil(e.target.value);
          }}
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel>Date of Examination</CLabel>
        <CInput
          type='date'
          value={dateOfExamination}
          disabled={!editMode}
          onChange={(e) => {
            setDateOfExamination(e.target.value);
          }}
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel>Rating</CLabel>
        <CInput
          type='text'
          value={rating}
          disabled={!editMode}
          onChange={(e) => {
            setRating(e.target.value);
          }}
        />
      </CFormGroup>
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
                  updateEligibilityProfessionalLicenseEntry(props.auth.token);
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
                  window.confirm('Are you sure you want to cancel the changes?')
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
              deleteEligibilityProfessionalLicenseEntry(props.auth.token);
            }
          }}
        >
          Delete Entry
        </CButton>
      </CFormGroup> */}
    </CContainer>
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
)(EligibilityProfessionalLicenseItem);
