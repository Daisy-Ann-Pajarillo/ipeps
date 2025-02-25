import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CForm, CButton, CInput, CLabel, CRow, CCol, CFormGroup } from '@coreui/react';

const PersonalInfo = (props) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [landlineNo, setLandlineNo] = useState('');
  const [cellphoneNo, setCellphone] = useState('');
  const [uploadedIDFileURL, setUploadedIDFileURL] = useState('#');

  useEffect(() => {
    if (props.pageData && Object.keys(props.pageData).length !== 0) {
      setFirstName(props.pageData.first_name || '');
      setMiddleName(props.pageData.middle_name || '');
      setLastName(props.pageData.last_name || '');
      setDesignation(props.pageData.designation || '');
      setLandlineNo(props.pageData.landline_no || '');
      setCellphone(props.pageData.cellphone_no || '');
    }
  }, [props.pageData]);

  return (
    <div
      className='tab-pane fade active show'
      id='personal-info'
      role='tabpanel'
      aria-labelledby='personal-info-tab'
    >
      <CForm>
        <CRow>
          {/* First Name */}
          <CCol>
            <CFormGroup>
              <CLabel htmlFor='firstname'>First Name</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='Enter your first name'
                autoComplete='firstname'
                size='8'
                value={firstName}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          {/* Middle Name */}
          <CCol>
            <CFormGroup>
              <CLabel htmlFor='middlename'>Middle Name</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='Enter your middle name'
                autoComplete='middlename'
                size='8'
                value={middleName}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          {/* Last Name */}
          <CCol>
            <CFormGroup>
              <CLabel htmlFor='lastname'>Last Name</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='Enter your last name'
                autoComplete='lastname'
                size='8'
                value={lastName}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          {/* Designation */}
          <CCol>
            <CFormGroup>
              <CLabel htmlFor='designation'>Designation</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='Enter your Designation'
                autoComplete='designation'
                size='8'
                value={designation}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          {/* Landline */}
          <CCol sm={12} md={6}>
            <CFormGroup>
              <CLabel htmlFor='landline-no'>Landline Number</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='(999) 999-9999'
                autoComplete='landline-no'
                size='8'
                value={landlineNo}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
          {/* Cellphone */}
          <CCol sm={12} md={6}>
            <CFormGroup>
              <CLabel htmlFor='cellphone-no'>Cellphone Number</CLabel>
              <CInput
                className='form-control'
                type='text'
                placeholder='Cellphone Number'
                autoComplete='cellphone-no'
                size='8'
                value={cellphoneNo}
                disabled={true}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CLabel>Saved Uploaded File</CLabel>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CButton
              color='primary'
              href={uploadedIDFileURL}
              disabled={uploadedIDFileURL === '#'
                || uploadedIDFileURL === null
                || uploadedIDFileURL === undefined ? true : false}
            >
              Download File
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(PersonalInfo);
