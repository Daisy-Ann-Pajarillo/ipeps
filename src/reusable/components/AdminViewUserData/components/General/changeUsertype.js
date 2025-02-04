import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';
import {
    CSelect,
    CContainer,
    CForm,
    CLabel,
    CFormGroup,
} from '@coreui/react';
const userTypes = [
    'Select a User',
    'EMPLOYER',
    'JOBSEEKER',
    'ACADEME',
    'STUDENT',
    'ADMIN_LEVEL_1',
    'ADMIN_LEVEL_2',
];

const Settings = (props) => {
    const [selectedUserType, setSelectedUserType] = useState('');

    useEffect(() => {
        if (props.userData.user_type === "ADMIN") {
            if (props.userData.access_level === 1) {
                setSelectedUserType('ADMIN_LEVEL_1')
            } if (props.userData.access_level === 2) {
                setSelectedUserType('ADMIN_LEVEL_2')
            }
        } else {
            setSelectedUserType(props.userData.user_type)
        }
    }, [props.userData.user_type])

    const updateUserType = (usertype) => {
        let bodyFormData = new FormData();
        bodyFormData.set('user_id', props?.userData?.id);
        bodyFormData.set('user_type', usertype);
        axios({
            method: 'post',
            auth: { username: props.auth.token },
            url: `/api/admin/manage-users/users/update-user-type`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                toast(`Successfully updated`);
            })
            .catch((error) => {
                toast(error.response.data.message);
            });
    };

    return (
        <>
            <CContainer>
                <CForm >
                    <CFormGroup>
                        {/* User Type */}
                        <CFormGroup>
                            <CLabel htmlFor='user-type'>User type</CLabel>
                            <CSelect
                                custom
                                name='ccuser-type'
                                id='ccuser-type'
                                onChange={(e) => {
                                    setSelectedUserType(e.target.value);
                                    updateUserType(e.target.value)
                                    console.log('run')
                                }}
                                disabled={props.auth.user.access_level === 2 && props.auth.user.user_type === "ADMIN" ? false : true}
                            >
                                {userTypes.map((item) => {
                                    {
                                        if (item === selectedUserType) {
                                            return (
                                                <option value={item} selected='selected'>
                                                    {item}
                                                </option>
                                            );
                                        } else {
                                            return <option value={item}>{item}</option>;
                                        }
                                    }
                                })}
                            </CSelect>
                        </CFormGroup>

                    </CFormGroup>
                </CForm>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
