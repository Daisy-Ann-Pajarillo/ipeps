import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import { CButton, CContainer, CFormGroup } from '@coreui/react';

import CompleteAddressInputs from '../../../../../reusable/components/CompleteAddressInputs';

const PresentAddressItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [id, setID] = useState();
  const [country, setCountry] = useState('Philippines');
  const [region, setRegion] = useState('');
  const [cityProvince, setCityProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [barangay, setBarangay] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [houseStreet, setHouseStreet] = useState('');

  useEffect(() => {
    if (props.address) {
      setID(props.address.id);
      setCountry(props.address.country);
      setRegion(props.address.region);
      setCityProvince(props.address.city_province);
      setMunicipality(props.address.municipality);
      setBarangay(props.address.barangay);
      setZipCode(props.address.zipcode);
      setHouseStreet(props.address.street);
    }
  }, [props.address]);

  const onSubmit = () => {
    updatePresentAddress();
  };

  const updatePresentAddress = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('present_address_id', id);
    bodyFormData.set('country', country);
    bodyFormData.set('region', region);
    bodyFormData.set('city_province', cityProvince);
    bodyFormData.set('municipality', municipality);
    bodyFormData.set('barangay', barangay);
    bodyFormData.set('zipcode', zipCode);
    bodyFormData.set('street', houseStreet);
    bodyFormData.set('address_type', 'PRESENT');
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/present-address/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setEditMode(!editMode);
        toast('Successfully updated present address');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePresentAddress = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('present_address_id', id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/present-address/delete`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        toast('Successfully deleted present address');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <CContainer>
        <h6>Present Address</h6>
        <p>ID: {id}</p>
        <p>
          Created:{' '}
          {props?.address?.created_date
            ? Date.parse(props?.address?.created_date).toLocaleString()
            : null}
        </p>
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
          inputsDisabled={!editMode}
        />
        <CFormGroup>
          {editMode ? (
            <>
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                type='button'
                onClick={onSubmit}
              >
                Save
              </CButton>
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                type='button'
                onClick={() => {
                  setEditMode(false);
                  // setErrorMsg('');
                }}
              >
                Cancel
              </CButton>
            </>
          ) : (
            <>
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
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='danger'
                type='button'
                onClick={deletePresentAddress}
              >
                Delete
              </CButton>
            </>
          )}
        </CFormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(PresentAddressItem);
