import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CContainer } from '@coreui/react';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import EducationalBackgroundItem from './EducationalBackgroundItem';

const UpdateEducationalBackground = (props) => {
    useEffect(() => {
        props.onGetAuthStorage();
    }, []);
    return (
        <div>
            {props?.userData?.educational_background?.length === 0 ? <CContainer><p>No Educational Background</p></CContainer> : null}
            {props?.userData?.educational_background?.map((item, index) => {
                return (
                    <div key={index}>
                        <EducationalBackgroundItem
                            ID={item.id}
                            schoolName={item.school_name}
                            educationalLevel={item.educational_level}
                            degreeQualification={item.degree_qualification}
                            fieldOfStudy={item.field_of_study}
                            major={item.major}
                            isCurrent={item.is_current}
                            from={item.date_from}
                            to={item.date_to}
                            programDuration={item.program_duration}
                        />
                        <hr />
                    </div>
                )
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
)(UpdateEducationalBackground);
