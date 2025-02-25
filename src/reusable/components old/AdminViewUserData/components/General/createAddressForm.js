import React, { useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import {
  CModal,
  CModalHeader,
  CModalBody,
  CContainer,
  CRow,
  CCol,
  CFormGroup,
  CButton,
} from '@coreui/react';

import CompleteAddressInputs from '../../../../../reusable/components/CompleteAddressInputs';
import addressTypes from '../../../../../reusable/constants/addressTypes';

const CreateAddressForm = (props) => {
  const [country, setCountry] = useState('Philippines');
  const [region, setRegion] = useState('');
  const [cityProvince, setCityProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [barangay, setBarangay] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [houseStreet, setHouseStreet] = useState('');

  const [addressType, setAddressType] = useState({
    label: 'PERMANENT',
    value: 'PERMANENT',
  });

  const createAddress = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('owner_type', props?.userData?.user_type);
    bodyFormData.set('country', country);
    bodyFormData.set('region', region);
    bodyFormData.set('city_province', cityProvince);
    bodyFormData.set('municipality', municipality);
    bodyFormData.set('barangay', barangay);
    bodyFormData.set('zipcode', zipCode);
    bodyFormData.set('street', houseStreet);
    bodyFormData.set('address_type', addressType.value);

    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/address/add`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        toast('Successfully created address');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CModal
      size={'xl'}
      show={props.show}
      onClose={props.onClose}
      closeOnBackdrop={false}
    >
      <CModalHeader closeButton>Create Address</CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow>
            <CCol lg='12'>
              <CreatableSelect
                isClearable
                options={addressTypes}
                placeholder={'Address Type'}
                value={addressType}
                onChange={(value, actionMeta) => {
                  setAddressType(value);
                }}
                isMulti={false}
              />
              <br />
              <CompleteAddressInputs
                setCountry={setCountry}
                setRegion={setRegion}
                setCityProvince={setCityProvince}
                setMunicipality={setMunicipality}
                setBarangay={setBarangay}
                setZipCode={setZipCode}
                setHouseStreet={setHouseStreet}
                country={country}
                region={region}
                cityProvince={cityProvince}
                municipality={municipality}
                barangay={barangay}
                zipCode={zipCode}
                houseStreet={houseStreet}
                inputsDisabled={false}
              />
            </CCol>
          </CRow>
          <CRow>
            <CFormGroup>
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                type='button'
                onClick={createAddress}
              >
                Create
              </CButton>
            </CFormGroup>
          </CRow>
        </CContainer>
      </CModalBody>
    </CModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateAddressForm);
