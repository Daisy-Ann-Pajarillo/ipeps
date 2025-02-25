import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import LanguageDialectProficiencyItem from './LanguageDialectProficencyItem';

const LanguageProficiency = (props) => {
  useEffect(() => {
    props.onGetAuthStorage();
  }, []);

  return (
    <div>
      {props?.userData?.lang_dialiect_prof?.length === 0 ? <p>No Language Proficiencies
      </p> : null}
      {props?.userData?.lang_dialiect_prof?.map((item, index) => {
        return (
          <div key={index}>
            <LanguageDialectProficiencyItem
              id={item.id}
              languageName={item.language_name}
              read={item.read_proficiency}
              write={item.write_proficiency}
              speak={item.speak_proficiency}
              understand={item.understand_proficiency}
            />
            <br />
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

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageProficiency);
