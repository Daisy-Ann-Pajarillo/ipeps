import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

import {
  CContainer,
  CButton,
  CInput,
  CLabel,
  CFormGroup,
  CRow,
  CCol,
} from '@coreui/react';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

const LanguageDialectProficiencyItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [langName, setLangName] = useState('');
  const [read, setRead] = useState(false);
  const [write, setWrite] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [understand, setUnderstand] = useState(false);

  useEffect(() => {
    props.onGetAuthStorage();
    setLangName(props.languageName);
    if (props.read === 1) {
      setRead(true);
    }
    if (props.write === 1) {
      setWrite(true);
    }
    if (props.speak === 1) {
      setSpeak(true);
    }

    if (props.understand === 1) {
      setUnderstand(true);
    }
  }, [
    props.languageName,
    props.read,
    props.write,
    props.speak,
    props.understand,
  ]);

  const updateProficiencyEntry = (token) => {
    let bodyFormData = new FormData();
    bodyFormData.set('lang_dialect_id', props.id);
    bodyFormData.set('read_proficiency', read);
    bodyFormData.set('write_proficiency', write);
    bodyFormData.set('speak_proficiency', speak);
    bodyFormData.set('understand_proficiency', understand);
    axios({
      method: 'post',
      auth: { username: token },
      url: `/api/profile-page/lang-dialect-proficiency/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        // console.log('response', response);
        alert('Updated Language Dialect Proficiency Entry');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const deleteProficiencyEntry = (token) => {
    let bodyFormData = new FormData();
    bodyFormData.set('lang_dialect_id', props.id);
    axios({
      method: 'post',
      auth: { username: token },
      url: `/api/profile-page/lang-dialect-proficiency/delete`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        alert('Successfully deleted entry');
        // console.log('response', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <div className='container mt-3'>
      <div className='form-group'>
        <CFormGroup>
          <CLabel>Language Name</CLabel>
          <CInput
            type='text'
            value={langName}
            onChange={(e) => {
              setLangName(e.target.value);
            }}
            disabled={!editMode}
          />
        </CFormGroup>
        {/* Read */}
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={read}
            onClick={() => setRead(!read)}
            disabled={!editMode}
          />
          <label className='form-check-label'>Read</label>
        </div>
        {/* Write */}
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={write}
            onClick={() => setWrite(!write)}
            disabled={!editMode}
          />
          <label className='form-check-label'>Write</label>
        </div>
        {/*  Speak */}
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={speak}
            onClick={() => setSpeak(!speak)}
            disabled={!editMode}
          />
          <label className='form-check-label'>Speak</label>
        </div>
        {/* Understand */}
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={understand}
            onClick={() => setUnderstand(!understand)}
            disabled={!editMode}
          />
          <label className='form-check-label'>Understand</label>
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
                  updateProficiencyEntry(props.auth.token);
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
              deleteProficiencyEntry(props.auth.token);
            }
          }}
        >
          Delete Entry
        </CButton>
      </CFormGroup> */}
    </div>
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
)(LanguageDialectProficiencyItem);
