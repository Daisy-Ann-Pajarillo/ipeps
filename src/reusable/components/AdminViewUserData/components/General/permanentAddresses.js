import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../../../../axios';
import PermanentAddressItem from './permanentAddressItem';

const PermanentAddresses = (props) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const getAllPermanentAddress = () => {
      let bodyFormData = new FormData();
      bodyFormData.set('user_id', props?.userData?.id);
      axios({
        method: 'post',
        auth: { username: props.auth.token },
        url: `/api/admin/manage-users/personal-info/permanent-address/get-all`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          setAddresses(response.data.address);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getAllPermanentAddress();
  }, [props.userData.id]);


  return (
    <>
      {addresses?.map((address, key) => {
        return <div key={key}><br /><hr /><PermanentAddressItem address={address} /></div>;
      })}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null ? true : false,
  };
};

export default connect(mapStateToProps)(PermanentAddresses);
