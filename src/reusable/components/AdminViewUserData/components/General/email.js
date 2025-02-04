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
  email: yup.string().email().required('Email is required'),
});

const Settings = (props) => {
  const { control, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (props?.userData) {
      control.setValue('email', props?.userData?.email);
    }
  }, [props.userData.id]);

  const onSubmit = (data) => {
    updateEmail(data.email);
  };

  const updateEmail = (email) => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('email', email);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/email/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setEditMode(!editMode);
        setErrorMsg('');
        toast('Successfully updated email');
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
            <CLabel>Email</CLabel>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              render={({ onChange, value }) => (
                <CInput
                  type='text'
                  placeholder='Email'
                  autoComplete='email'
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
