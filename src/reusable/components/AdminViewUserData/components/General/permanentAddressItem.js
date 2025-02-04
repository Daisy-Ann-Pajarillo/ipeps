import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import { CButton, CContainer, CFormGroup } from '@coreui/react';

import CompleteAddressInputs from '../../../../../reusable/components/CompleteAddressInputs';

const PermanentAddressItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [id, setID] = useState();
  const [permanentCountry, setPermanentCountry] = useState('Philippines');
  const [permanentRegion, setPermanentRegion] = useState('');
  const [permanentCityProvince, setPermanentCityProvince] = useState('');
  const [permanentMunicipality, setPermanentMunicipality] = useState('');
  const [permanentBarangay, setPermanentBarangay] = useState('');
  const [permanentZipCode, setPermanentZipCode] = useState('');
  const [permanentHouseStreet, setPermanentHouseStreet] = useState('');

  useEffect(() => {
    if (props.address) {
      setID(props.address.id);
      setPermanentCountry(props.address.country);
      setPermanentRegion(props.address.region);
      setPermanentCityProvince(props.address.city_province);
      setPermanentMunicipality(props.address.municipality);
      setPermanentBarangay(props.address.barangay);
      setPermanentZipCode(props.address.zipcode);
      setPermanentHouseStreet(props.address.street);
    }
  }, [props.address]);

  const onSubmit = () => {
    updatePermanentAddress();
  };

  const updatePermanentAddress = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('permanent_address_id', id);
    bodyFormData.set('country', permanentCountry);
    bodyFormData.set('region', permanentRegion);
    bodyFormData.set('city_province', permanentCityProvince);
    bodyFormData.set('municipality', permanentMunicipality);
    bodyFormData.set('barangay', permanentBarangay);
    bodyFormData.set('zipcode', permanentZipCode);
    bodyFormData.set('street', permanentHouseStreet);
    bodyFormData.set('address_type', 'PERMANENT');
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/permanent-address/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setEditMode(!editMode);
        toast('Successfully updated permanent address');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePermanentAddress = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('permanent_address_id', id);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/personal-info/permanent-address/delete`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        toast('Successfully deleted permanent address');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <CContainer>
        <h6>Permanent Address</h6>
        <p>ID: {id}</p>
        <p>
          Created:{' '}
          {props?.address?.created_date
            ? Date.parse(props?.address?.created_date).toLocaleString()
            : null}
        </p>
        <CompleteAddressInputs
          setCountry={setPermanentCountry}
          setRegion={setPermanentRegion}
          setCityProvince={setPermanentCityProvince}
          setMunicipality={setPermanentMunicipality}
          setBarangay={setPermanentBarangay}
          setZipCode={setPermanentZipCode}
          setHouseStreet={setPermanentHouseStreet}
          country={permanentCountry}
          region={permanentRegion}
          cityProvince={permanentCityProvince}
          municipality={permanentMunicipality}
          barangay={permanentBarangay}
          zipCode={permanentZipCode}
          houseStreet={permanentHouseStreet}
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
                onClick={deletePermanentAddress}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermanentAddressItem);
