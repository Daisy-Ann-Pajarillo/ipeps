import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  CContainer,
  CInput,
  CLabel,
  CFormGroup,
} from '@coreui/react';
import * as actions from '../../../../../store/actions/index';

const JobPreferenceOccupationItem = (props) => {
  const editMode = false;
  const [occupation, setOccupation] = useState('');

  useEffect(() => {
    props.onGetAuthStorage();
    setOccupation(props.occupation);
  }, [props.occupation]);

  return (
    <CContainer>
      <CFormGroup>
        <CLabel>Occupation</CLabel>
        <CInput
          type='text'
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          disabled={!editMode}
        />
      </CFormGroup>
    </CContainer>
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
)(JobPreferenceOccupationItem);
