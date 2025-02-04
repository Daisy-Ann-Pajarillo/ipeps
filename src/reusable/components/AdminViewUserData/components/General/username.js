import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import {
  CButton,
  CContainer,
  CForm,
  CInput,
  CLabel,
  CFormGroup,
} from '@coreui/react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(4, 'Username must be at least 4 characters')
    .required('Username is required'),
});

const Settings = (props) => {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(schema) });
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (props?.userData) {
      control.setValue('username', props?.userData?.username);
    }
  }, [props.userData.id]);

  const onSubmit = (data) => {
    updateUsername(data.username);
  };

  const updateUsername = (username) => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('username', username);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/username/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setEditMode(!editMode);
        setErrorMsg('');
        toast('Successfully updated username');
      })
      .catch((error) => {
        setErrorMsg(error.response?.data?.message);
      });
  };

  return (
    <>
      <CContainer>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CFormGroup>
            <CLabel>Username</CLabel>
            <Controller
              name='username'
              control={control}
              defaultValue=''
              render={({ onChange, value }) => (
                <CInput
                  type='text'
                  placeholder='Username'
                  autoComplete='username'
                  onChange={onChange}
                  value={value}
                  disabled={!editMode}
                />
              )}
            />
            {errorMsg !== '' ? (
              <p className='help-block' style={{ color: 'red' }}>
                {errorMsg}
              </p>
            ) : null}
          </CFormGroup>
          <CFormGroup>
            {editMode ? (
              <>
                <CButton
                  className='btn btn-sm btn-primary float-right ml-2'
                  color='primary'
                  type='submit'
                >
                  Save
                </CButton>
                <CButton
                  className='btn btn-sm btn-primary float-right ml-2'
                  color='primary'
                  type='button'
                  onClick={() => {
                    setEditMode(false);
                    setErrorMsg('');
                  }}
                >
                  Cancel
                </CButton>
              </>
            ) : (
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                type='button'
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </CButton>
            )}
          </CFormGroup>
        </CForm>
      </CContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
