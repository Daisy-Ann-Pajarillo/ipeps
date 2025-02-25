import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import religionOptionTypes from '../../../../../reusable/constants/religionOptionTypes';
import civilStatusTypes2 from '../../../../../reusable/constants/civilStatusTypes2';
import suffixTypes from '../../../../../reusable/constants/suffixTypes';
import nationalityOptionTypes from '../../../../../reusable/constants/nationalityOptionTypes';
import sexTypes2 from '../../../../../reusable/constants/sexTypes2';
import userIndustryOptionTypes from '../../../../../reusable/constants/userIndustryOptionTypes2';

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
  firstname: yup.string().default(''),
  middlename: yup.string().default(''),
  lastname: yup.string().default(''),
  sex: yup.string().default(''),
  dateofbirth: yup.string().default(''),
  placeofbirth: yup.string().default(''),
  suffix: yup.string().default(''),
  nationality: yup.string().default(''),
  religion: yup.string().default(''),
  contactnumber: yup.string().default(''),
  landlinenumber: yup.string().default(''),
  civilstatus: yup.string().default(''),
  industry: yup.string().default(''),
  designation: yup.string().default(''),
});

const Settings = (props) => {
  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (props?.userData) {
      control.setValue('firstname', props?.userData?.first_name);
      control.setValue('middlename', props?.userData?.middle_name);
      control.setValue('lastname', props?.userData?.last_name);
      control.setValue('sex', props?.userData?.sex);
      control.setValue('dateofbirth', props?.userData?.date_of_birth);
      control.setValue('placeofbirth', props?.userData?.place_of_birth);
      control.setValue('suffix', props?.userData?.suffix);
      control.setValue('nationality', props?.userData?.nationality);
      control.setValue('religion', props?.userData?.religion);
      control.setValue('contactnumber', props?.userData?.contact_number);
      control.setValue('landlinenumber', props?.userData?.landline_number);
      control.setValue('civilstatus', props?.userData?.civil_status);
      control.setValue('industry', props?.userData?.industry);
      control.setValue('designation', props?.userData?.designation);
    }
  }, [props.userData.id]);

  const onSubmit = (data) => {
    updateNames(
      data.firstname,
      data.middlename,
      data.lastname,
      data.sex,
      data.dateofbirth,
      data.placeofbirth,
      data.suffix,
      data.nationality,
      data.religion,
      data.contactnumber,
      data.landlinenumber,
      data.civilstatus,
      data.industry,
      data.designation
    );
  };

  const updateNames = (
    firstname,
    middlename,
    lastname,
    sex,
    dateofbirth,
    placeofbirth,
    suffix,
    nationality,
    religion,
    contact_number,
    landline_number,
    civil_status,
    industry,
    designation
  ) => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('first_name', firstname);
    bodyFormData.set('middle_name', middlename);
    bodyFormData.set('last_name', lastname);
    bodyFormData.set('sex', sex);
    bodyFormData.set('date_of_birth', dateofbirth);
    bodyFormData.set('place_of_birth', placeofbirth);
    bodyFormData.set('suffix', suffix);
    bodyFormData.set('nationality', nationality);
    bodyFormData.set('religion', religion);
    bodyFormData.set('contact_number', contact_number);
    bodyFormData.set('landline_number', landline_number);
    bodyFormData.set('civil_status', civil_status);
    bodyFormData.set('industry', industry);
    bodyFormData.set('designation', designation);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast(`Successfully updated`);
        setEditMode(!editMode);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <>
      <CContainer>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CFormGroup>
            <CLabel>First Name</CLabel>
            <Controller
              name='firstname'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Last Name'
                    autoComplete='lastname'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.firstname?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Middle Name</CLabel>
            <Controller
              name='middlename'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Middle Name'
                    autoComplete='middlename'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.middlename?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Last Name</CLabel>
            <Controller
              name='lastname'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Last Name'
                    autoComplete='lastname'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.lastname?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Date of Birth</CLabel>
            <Controller
              name='dateofbirth'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='date'
                    placeholder='Date of Birth'
                    autoComplete='dateofbirth'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.dateofbirth?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Place of Birth</CLabel>
            <Controller
              name='placeofbirth'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Place of Birth'
                    autoComplete='placeofbirth'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.placeofbirth?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Sex</CLabel>
            <Controller
              name='sex'
              control={control}
              render={({ onChange, value }) => {
                // console.log('value', value);
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={sexTypes2}
                      value={{ label: value, value: value }}
                      placeholder={'Select a suffix or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={sexTypes2}
                      value={value}
                      placeholder={'Select a suffix or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.sex?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Suffix</CLabel>
            <Controller
              name='suffix'
              control={control}
              render={({ onChange, value }) => {
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={suffixTypes}
                      value={{ label: value, value: value }}
                      placeholder={'Select a suffix or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={suffixTypes}
                      value={value}
                      placeholder={'Select a suffix or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.suffix?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Nationality</CLabel>
            <Controller
              name='nationality'
              control={control}
              render={({ onChange, value }) => {
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={nationalityOptionTypes}
                      value={{ label: value, value: value }}
                      placeholder={'Select a nationality or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={nationalityOptionTypes}
                      value={value}
                      placeholder={'Select a nationality or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.nationality?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Religion</CLabel>
            <Controller
              name='religion'
              control={control}
              render={({ onChange, value }) => {
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={religionOptionTypes}
                      value={{ label: value, value: value }}
                      placeholder={'Select a religion or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={religionOptionTypes}
                      value={value}
                      placeholder={'Select a religion or type your own'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.religion?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Contact Number</CLabel>
            <Controller
              name='contactnumber'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Contact Number'
                    autoComplete='contactnumber'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.contactnumber?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Landline Number</CLabel>
            <Controller
              name='landlinenumber'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Landline Number'
                    autoComplete='landlinenumber'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.landlinenumber?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Civil Status</CLabel>
            <Controller
              name='civilstatus'
              control={control}
              render={({ onChange, value }) => {
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={civilStatusTypes2}
                      value={{ label: value, value: value }}
                      placeholder={'Select a Civil Status'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={civilStatusTypes2}
                      value={value}
                      placeholder={'Select a Civil Status'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.civilstatus?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Industry</CLabel>
            <Controller
              name='industry'
              control={control}
              render={({ onChange, value }) => {
                if (typeof value === typeof '') {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={userIndustryOptionTypes}
                      value={{ label: value, value: value }}
                      placeholder={'Select an Industry'}
                      isDisabled={!editMode}
                    />
                  );
                } else {
                  return (
                    <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if(e) {
                          onChange(e.value);
                        } else {
                          onChange('');
                        }
                      }}
                      options={userIndustryOptionTypes}
                      value={value}
                      placeholder={'Select an Industry'}
                      isDisabled={!editMode}
                    />
                  );
                }
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.industry?.message}
            </p>
          </CFormGroup>
          <CFormGroup>
            <CLabel>Designation</CLabel>
            <Controller
              name='designation'
              control={control}
              render={({ onChange, value }) => {
                return (
                  <CInput
                    type='text'
                    placeholder='Designation'
                    autoComplete='designation'
                    onChange={onChange}
                    value={value}
                    disabled={!editMode}
                  />
                );
              }}
            />
            <p className='help-block' style={{ color: 'red' }}>
              {errors.designation?.message}
            </p>
          </CFormGroup>
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
