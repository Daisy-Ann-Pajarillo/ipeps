import React from 'react';
import { connect } from 'react-redux';
import JobPreferenceWorkLocItem from './JobPreferenceWorkLocItem';
import JobPreferenceOccupationItem from './JobPreferenceOccupationItem';

const JobPreference = (props) => {
  return (
    <div>
      <h5>Preferred Occupation</h5>
      {props?.userData?.pref_occupation?.length === 0 ? <p>No Preferred Occupation</p> : null}
      {props?.userData?.pref_occupation?.map((item, index) => {
        return (
          <div key={index}>
            <JobPreferenceOccupationItem
              id={item.id}
              occupation={item.occupation}
            />
            <br />
            <hr />
          </div>
        );
      })}
      <h5>Preferred Work Location</h5>
      {props?.userData?.pref_work_location?.length === 0 ? <p>No Preferred Work Location</p> : null}
      {props?.userData?.pref_work_location?.map((item, index) => {
        return (
          <div key={index}>
            <JobPreferenceWorkLocItem
              id={item.id}
              country={item.country}
              cityMunicipalities={item.cities_municipalities}
            />
            <br />
            <hr />
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null ? true : false,
  };
};

export default connect(mapStateToProps)(JobPreference);
