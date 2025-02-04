import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { CContainer } from '@coreui/react';
import * as actions from '../../../../../store/actions/index';

import EligibilityProfessionalLicenseItem from './EligibilityProfessionalLicenseItem';

const EligibilityProfessionalLicense = (props) => {
  return (
    <CContainer>
      {props?.userData?.prc_elgibility?.length === 0 ? <p>No License</p> : null}
      {props?.userData?.prc_elgibility?.map((item, index) => {
        return (
          <div key={index}>
            <EligibilityProfessionalLicenseItem
              id={item.id}
              prcName={item.prc_name}
              prcType={item.prc_type}
              dateOfExamination={item.date_of_examination}
              validUntil={item.valid_until}
              rating={item.rating}
            />
            <br />
            <hr />
          </div>
        );
      })}
    </CContainer>
  )
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
)(EligibilityProfessionalLicense);
