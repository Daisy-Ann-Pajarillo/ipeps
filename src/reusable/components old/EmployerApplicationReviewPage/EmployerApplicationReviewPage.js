import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CTextarea,
} from '@coreui/react';
import axios from '../../../axios';
import PersonalInfo from './SubPages/PersonalInfo';

const EmployerApplicationReviewPage = (props) => {
    const [isApplicationSent, setIsApplicationSent] = useState(false);
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const [adminRemarkValue, setAdminRemarkValue] = useState('');

    const toggle = () => setModal(!modal);

    const sendApplicationConfirmFinished = () => {
        let bodyFormData = new FormData();
        axios({
            method: 'post',
            url: '/api/user/registration/jobseeker/new-application/confirm-finished',
            data: bodyFormData,
            auth: { username: props.auth.token },
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((response) => {
                if (response.data && response.data.confirm_success === true) {
                    setMessage(response.data.message);
                    setErrors([]);
                    setIsApplicationSent(true);
                } else if (response.data.confirm_success === false) {
                    setMessage(response.data.message);
                    setErrors(response.data.page_errors);
                    setIsApplicationSent(false);
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    // console.log('props', props);

    const sendSetStatus = (status) => {
        let bodyFormData = new FormData();
        bodyFormData.set('admin_set_status', status);
        bodyFormData.set('admin_remark', adminRemarkValue);
        bodyFormData.set('jobseeker_app_id', props?.pageData?.id);
        axios({
            method: 'post',
            url: '/api/user/registration/jobseeker/new-application/admin-set-status',
            data: bodyFormData,
            auth: { username: props.auth.token },
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                alert(`User status set to ${status}`);
                props.onCloseWhenApproveRejectClicked();
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    const sendMergeData = (id) => {
        let bodyFormData = new FormData();
        let url = '/api/user/registration/jobseeker/new-application/admin-merge-jobseeker-data-to-db';
        if (props?.userData?.user_type === "EMPLOYER") {
            url = '/api/user/registration/employer/new-application/admin-merge-jobseeker-data-to-db'
        }
        bodyFormData.set('jobseeker_app_id', id);
        axios({
            method: 'post',
            url: url,
            data: bodyFormData,
            auth: { username: props.auth.token },
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => alert(`Successfully merged user data to database`))
            .catch((error) => {
                alert(`Error merging user data to database`);
                console.log('error', error);
            });
    };

    useEffect(() => {
        setAdminRemarkValue(props?.pageData?.admin_remark);
    }, [props?.pageData?.admin_remark]);

    return (
        <>
            <CModal show={modal} onClose={toggle} closeOnBackdrop={false}>
                <CModalHeader>Confirmation</CModalHeader>
                <CModalBody>
                    <p>
                        I attest to the truthfulness, accuracy and genuineness of all the
                        information and documents contained and attached to this
                        application and that I shall be liable for any misrepresentation,
                        fraudulent declaration and all its consequences.
                    </p>
                    {message ? (
                        <>
                            <br />
                            <hr />
                            <p>{message}</p>
                        </>
                    ) : null}
                    <ol>
                        {errors.length > 0
                            ? errors.map((error) => {
                                if (error === 'personal_info_page') {
                                    return <li>Missing Personal Information</li>;
                                }
                            })
                            : null}
                    </ol>
                    {errors.length > 0 ? (
                        <p>Please go back to the pages and enter the required data</p>
                    ) : null}
                </CModalBody>
                <CModalFooter style={{ background: '#fff' }}>
                    {!isApplicationSent ? (
                        <>
                            <CButton
                                color='primary'
                                onClick={sendApplicationConfirmFinished}
                            >
                                Submit
                            </CButton>
                            <CButton color='secondary' onClick={toggle}>
                                Cancel
                            </CButton>
                        </>
                    ) : (
                        <CButton color='primary' href='/logout'>
                            Logout
                        </CButton>
                    )}
                </CModalFooter>
            </CModal>
            <div style={{ padding: '5%' }}>
                <PersonalInfo pageData={props?.pageData?.personal_info_page} />
            </div>
            <hr />
            {props.adminMode ? (
                <>
                    <div className='form-row'>
                        <CTextarea
                            size={10}
                            onChange={(e) => setAdminRemarkValue(e.target.value)}
                            value={adminRemarkValue}
                        />
                    </div>
                    <br />
                    <div className='form-row'>
                        <div className='col-12'>
                            <div className='form-group'>
                                {props?.pageData.application_merged === 'NOT MERGED' ? (
                                    <button
                                        className='btn btn-sm btn-primary float-left ml-2'
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    'Are you sure you want to merge this user data to the Database?'
                                                )
                                            ) {
                                                sendMergeData(props?.pageData?.id);
                                            }
                                        }}
                                    >
                                        Merge Data to DB
                                    </button>
                                ) : (
                                    <button
                                        className='btn btn-sm btn-warning float-left ml-2'
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    'Are you sure you want to merge this user data again to the Database? This may create duplicate entries.'
                                                )
                                            ) {
                                                sendMergeData(props?.pageData?.id);
                                            }
                                        }}
                                    >
                                        Merge Data again to DB
                                    </button>
                                )}

                                <button
                                    className='btn btn-sm btn-primary float-right ml-2'
                                    onClick={() => {
                                        if (window.confirm('Approve this user?')) {
                                            sendSetStatus('APPROVED');
                                        }
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    className='btn btn-sm btn-danger float-right ml-2'
                                    onClick={() => {
                                        if (window.confirm('Reject this user?')) {
                                            sendSetStatus('REJECTED');
                                        }
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <button
                        className='btn btn-sm btn-primary float-right ml-2'
                        onClick={() => {
                            setModal(true);
                        }}
                    >
                        Submit
                    </button>
                    {props.selectedTab !== 1 ? (
                        <button
                            className='btn btn-sm btn-primary float-right ml-2'
                            type={'button'}
                            onClick={() => {
                                props.onClickPrevPage()
                            }}
                        >
                            Back
                        </button>
                    ) : null}
                </>
            )}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};

export default connect(mapStateToProps)(EmployerApplicationReviewPage);
