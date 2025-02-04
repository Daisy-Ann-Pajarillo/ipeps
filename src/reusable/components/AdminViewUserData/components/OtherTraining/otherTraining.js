import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import OtherTrainingItem from './OtherTrainingItem';

const OtherTraining = (props) => {
  useEffect(() => {
    props.onGetAuthStorage();
  }, []);
  return (
    <div>
      {props?.userData?.trainings?.length === 0 ? <p>No Trainings</p> : null}
      {props?.userData?.trainings?.map((item, index) => {
        return (
          <div key={index}>
            <OtherTrainingItem
              id={item.id}
              trainingCourseName={item.training_course_name}
              dateFrom={item.date_from}
              dateTo={item.date_to}
              trainingInstitution={item.training_institution}
              certificatesReceived={item.certificates_received}
              hoursOfTraining={item.hours_of_training}
              skillsAcquired={item.skills_acquired}
              credentialID={item.credential_id}
              credentialURL={item.credential_url}
            />
            <br />
            <br />
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

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OtherTraining);
