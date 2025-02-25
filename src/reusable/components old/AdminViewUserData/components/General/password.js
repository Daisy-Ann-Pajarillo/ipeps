import React, { useState } from 'react';
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
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .min(8, 'Password must be at least 8 characters')
    .required('Password confirmation is required'),
});

const Settings = (props) => {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(schema) });
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = (data) => {
    updatePassword(data.password, data.passwordConfirmation);
  };

  const updatePassword = (password, confirmPassword) => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('password', password);
    bodyFormData.set('confirm_password', confirmPassword);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/password/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setEditMode(!editMode);
        setErrorMsg('');
        control.setValue('password', '');
        control.setValue('passwordConfirmation', '');
        toast('Successfully updated password');
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
            <CLabel>New Password</CLabel>
            <Controller
              name='password'
              control={control}
              render={({ onChange, value }) => (
                <CInput
                  type='password'
                  placeholder='Password'
                  autoComplete='password'
                  onChange={onChange}
                  value={value}
                  disabled={!editMode}
                />
              )}
            />{' '}
            <p className='help-block' style={{ color: 'red' }}>
              {errors.password?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Confirm New Password</CLabel>
            <Controller
              name='passwordConfirmation'
              control={control}
              render={({ onChange, value }) => (
                <CInput
                  type='password'
                  placeholder='Confirm Password'
                  autoComplete='confirmPassword'
                  onChange={onChange}
                  value={value}
                  disabled={!editMode}
                />
              )}
            />{' '}
            <p className='help-block' style={{ color: 'red' }}>
              {errors.passwordConfirmation?.message}
            </p>
          </CFormGroup>

          {errorMsg !== '' ? (
            <p className='help-block' style={{ color: 'red' }}>
              {errorMsg}
            </p>
          ) : null}
          {/*  */}
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
                    control.setValue('password', '');
                    control.setValue('passwordConfirmation', '');
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
