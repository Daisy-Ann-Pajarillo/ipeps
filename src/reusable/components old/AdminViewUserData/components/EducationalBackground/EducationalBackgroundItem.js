import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

import {
  CContainer,
  CButton,
  CInput,
  CLabel,
  CFormGroup,
  CSelect,
} from '@coreui/react';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import degreeOrQualificationTypes from '../../../../../reusable/constants/degreeOrQualificationTypes';
import educationalLevelTypes from '../../../../../reusable/constants/educationalLevelTypes';
import schoolOptionTypes from '../../../../../reusable/constants/schoolOptionTypes';
import fieldOfStudyTypes from '../../../../../reusable/constants/fieldOfStudyTypes';

const EducationalBackgroundItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [ID, setID] = useState();
  const [schoolName, setSchoolName] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('');
  const [degreeQualification, setDegreeQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [major, setMajor] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [programDuration, setProgramDuration] = useState('');

  useEffect(() => {
    props.onGetAuthStorage();
    setID(props.ID);
    setSchoolName(props.schoolName);
    setEducationalLevel(props.educationalLevel);
    setDegreeQualification(props.degreeQualification);
    setFieldOfStudy(props.fieldOfStudy);
    setMajor(props.major);
    setIsCurrent(props.isCurrent === 'true' ? true : false);
    setFrom(props.from);
    setTo(props.to);
    setProgramDuration(props.programDuration);
  }, [
    props.ID,
    props.schoolName,
    props.educationalLevel,
    props.degreeQualification,
    props.fieldOfStudy,
    props.major,
    props.isCurrent,
    props.from,
    props.to,
    props.programDuration,
  ]);

  // const updateEducationalHistoryEntry = (token) => {
  //   let bodyFormData = new FormData();
  //   bodyFormData.set('education_history_id', props.id);
  //   bodyFormData.set('school_name', schoolName);
  //   bodyFormData.set('degree_qualification', degreeQualification);
  //   bodyFormData.set('date_from', to);
  //   bodyFormData.set('date_to', from);
  //   bodyFormData.set('is_current', isCurrent);
  //   bodyFormData.set('educational_level', educationalLevel);
  //   bodyFormData.set('field_of_study', fieldOfStudy);
  //   bodyFormData.set('major', major);
  //   bodyFormData.set('program_duration', programDuration);
  //   axios({
  //     method: 'post',
  //     auth: { username: token },
  //     url: `/api/educational-history/update`,
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

  // const deleteEducationalHistoryEntry = (token) => {
  //   let bodyFormData = new FormData();
  //   bodyFormData.set('education_history_id', props.id);
  //   axios({
  //     method: 'post',
  //     auth: { username: token },
  //     url: `/api/educational-history/delete`,
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
      {/* School Name */}
      <CFormGroup>
        <CLabel>School Name</CLabel>
        <CreatableSelect
          isClearable
          options={schoolOptionTypes}
          placeholder={'Select a field of study or type your own'}
          value={{
            label: schoolName,
            value: schoolName,
          }}
          onChange={(e) => {
            if (e) {
              setSchoolName(e.value);
            } else {
              setSchoolName('');
            }
          }}
          isDisabled={!editMode}
        />
      </CFormGroup>
      {/* Educational Level */}
      <CFormGroup>
        <CLabel>Educational Level</CLabel>
        <CSelect
          className='form-control'
          onChange={(e) => setEducationalLevel(e.target.value)}
          value={educationalLevel}
          disabled={!editMode}
        >
          {educationalLevelTypes.map((item, i) => {
            {
              if (item === educationalLevel) {
                return (
                  <option value={item.name} selected='selected' key={i}>
                    {item}
                  </option>
                );
              } else {
                return (
                  <option value={item} key={i}>
                    {item}
                  </option>
                );
              }
            }
          })}
        </CSelect>
      </CFormGroup>
      {/* Degree or Qualification */}
      <CFormGroup>
        <CLabel>Degree or Qualification</CLabel>
        <CSelect
          className='form-control'
          onChange={(e) => setDegreeQualification(e.target.value)}
          value={degreeQualification}
          disabled={!editMode}
        >
          {degreeOrQualificationTypes.map((item, i) => {
            {
              if (item === degreeQualification) {
                return (
                  <option value={item.name} selected='selected' key={i}>
                    {item}
                  </option>
                );
              } else {
                return (
                  <option value={item} key={i}>
                    {item}
                  </option>
                );
              }
            }
          })}
        </CSelect>
      </CFormGroup>
      {/* Field of Study */}
      <CFormGroup>
        <CLabel>Field of Study</CLabel>
        <CreatableSelect
          isClearable
          options={fieldOfStudyTypes}
          placeholder={'Select a field of study or type your own'}
          value={{
            label: fieldOfStudy,
            value: fieldOfStudy,
          }}
          onChange={(e) => {
            if (e) {
              if (e.value) {
                setFieldOfStudy(e.value);
              }
            } else {
              setFieldOfStudy('');
            }
          }}
          isDisabled={!editMode}
        />
      </CFormGroup>
      {/* Major */}
      <CFormGroup>
        <CLabel>Major</CLabel>
        <CInput
          type='text'
          value={major}
          onChange={(e) => {
            setMajor(e.target.value);
          }}
          disabled={!editMode}
        />
      </CFormGroup>
      {/* Currently Attending */}
      <CFormGroup>
        <label></label>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            onClick={() => {
              setIsCurrent(!isCurrent);
            }}
            checked={isCurrent}
            onChange={() => { }}
            disabled={!editMode}
          />
          <CLabel className='form-check-label'>Currently Attending</CLabel>
        </div>
      </CFormGroup>
      {/* From */}
      <CFormGroup>
        <CLabel>From</CLabel>
        <CInput
          type='date'
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
          }}
          disabled={!editMode}
        />
      </CFormGroup>
      {/* To */}
      <CFormGroup>
        <CLabel>To</CLabel>
        <CInput
          type='date'
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
          }}
          disabled={!editMode}
        />
      </CFormGroup>
      {/* Program Duration */}
      <CFormGroup>
        <CLabel>Program Duration</CLabel>
        <CInput
          type='number'
          value={programDuration}
          onChange={(e) => {
            setProgramDuration(e.target.value);
          }}
          disabled={!editMode}
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
                  updateEducationalHistoryEntry(props.auth.token);
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
              deleteEducationalHistoryEntry(props.auth.token);
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
)(EducationalBackgroundItem);
