import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import {
    CContainer,
    CFormGroup,
    CLabel,
    CInput,
    CSelect,
} from '@coreui/react';
import * as actions from '../../../../../store/actions/index';
import countriesList from '../../../../../reusable/constants/countriesList';
import employmentStatusTypes from '../../../../../reusable/constants/employmentStatusTypes';
import yesAndNoOptionTypes from '../../../../../reusable/constants/yesAndNoOptionTypes';

const EmploymentStatusItem = (props) => {
    const editMode = false;
    const [createdDate, setCreatedDate] = useState('');
    const [employmentStatusItemID, setEmploymentStatusItemID] = useState();
    const [selectedSeekingWorkType, setSelectedSeekingWorkType] = useState('Yes');
    const [selectedWillingToWorkImm, setSelectedWillingToWorkImm] =
        useState('Yes');
    const [seekingWhenWork, setSeekingWhenWork] = useState('');
    const [sinceWhenSeekingWork, setSinceWhenSeekingWork] = useState('');
    const [selectedFourPsBeneficiaryTypes, setSelectedFourPsBeneficiaryTypes] =
        useState('No');
    const [householdIDNo, setHouseholdIDNo] = useState('');
    const [selectedEmploymentStatusTypes, setSelectedEmploymentStatusTypes] =
        useState('');
    const [isCurrentOFW, setIsCurrentOFW] = useState('No');
    const [currentOFWCountry, setCurrentOFWCountry] = useState('');
    const [isFormerOFW, setIsFormerOFW] = useState('No');
    const [lastCountryDeployment, setLastCountryDeployment] = useState('');
    const [dateReturnToPH, setDateReturnToPH] = useState('');

    useEffect(() => {
        setCreatedDate(props.createdDate);
        setEmploymentStatusItemID(props.employmentStatusItemID);
        setSelectedSeekingWorkType(props.isSeekingWork);
        setSelectedWillingToWorkImm(props.isWillingToWorkImmediately);
        setSeekingWhenWork(props.seekingWhenWork);
        setSinceWhenSeekingWork(props.sinceWhenSeekingWork);
        setSelectedFourPsBeneficiaryTypes(props.is4PsBeneficiary);
        setHouseholdIDNo(props.householdIdNo);
        setSelectedEmploymentStatusTypes(props.employmentStatusType);
        setIsCurrentOFW(props.isCurrentOfw);
        setCurrentOFWCountry(props.currentOfwCountry);
        setIsFormerOFW(props.isFormerOfw);
        setLastCountryDeployment(props.lastCountryDeployment);
        setDateReturnToPH();

    }, [
        props.createdDate,
        props.employmentStatusItemID,
        props.isSeekingWork,
        props.isWillingToWorkImmediately,
        props.seekingWhenWork,
        props.sinceWhenSeekingWork,
        props.is4PsBeneficiary,
        props.householdIdNo,
        props.employmentStatusType,
        props.isCurrentOfw,
        props.currentOfwCountry,
        props.isFormerOfw,
        props.lastCountryDeployment,
        props.dateReturnToPh,
    ])


    return (
        <CContainer>
            <p>ID: {employmentStatusItemID}</p>
            <p>Created Date: {(new Date(createdDate).toString())}</p>
            <CFormGroup>
                <CLabel htmlFor='employment-status'>Employment Status</CLabel>
                <CreatableSelect
                    isClearable
                    onChange={(newValue) => {
                        if (newValue?.value) {
                            setSelectedEmploymentStatusTypes(newValue.value);
                        }
                    }}
                    onInputChange={(newValue) => {
                        if (newValue?.value) {
                            setSelectedEmploymentStatusTypes(newValue.value);
                        }
                    }}
                    options={employmentStatusTypes}
                    placeholder={'Select a employment status or type your own'}
                    isDisabled={!editMode}
                    value={{
                        label: selectedEmploymentStatusTypes,
                        value: selectedEmploymentStatusTypes,
                    }}
                />
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor='seeking-work'>
                    Are you actively looking for work?
                </CLabel>
                <CSelect
                    className='form-control'
                    id='seeking-work'
                    name='seeking-work'
                    onChange={(e) => setSelectedSeekingWorkType(e.target.value)}
                    value={selectedSeekingWorkType}
                    disabled={!editMode}
                >
                    {yesAndNoOptionTypes.map((item, index) => {
                        if (item === selectedSeekingWorkType) {
                            return (
                                <option value={item} selected='selected' key={index}>
                                    {item}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor='seeking-work'>If no When?</CLabel>
                <CInput
                    className='form-control '
                    type='date'
                    size='8'
                    onChange={(e) => setSeekingWhenWork(e.target.value)}
                    value={seekingWhenWork}
                    disabled={!editMode}
                />
            </CFormGroup>
            <CFormGroup>
                <CLabel>Since when have you started looking for work?</CLabel>
                <CInput
                    className='form-control'
                    type='date'
                    placeholder=''
                    autoComplete='sinceWhenSeekingWork'
                    size='8'
                    onChange={(e) => setSinceWhenSeekingWork(e.target.value)}
                    value={sinceWhenSeekingWork}
                    disabled={!editMode}
                />
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor='willing-to-work'>
                    Willing to work immediately?
                </CLabel>
                <CSelect
                    className='form-control'
                    id='willing-to-work'
                    name='willing-to-work'
                    onChange={(e) => setSelectedWillingToWorkImm(e.target.value)}
                    value={selectedWillingToWorkImm}
                    disabled={!editMode}
                >
                    {yesAndNoOptionTypes.map((item, index) => {
                        if (item === selectedWillingToWorkImm) {
                            return (
                                <option value={item} selected='selected' key={index}>
                                    {item}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Are you an OFW?</CLabel>
                <CSelect
                    className='form-control'
                    onChange={(e) => setIsCurrentOFW(e.target.value)}
                    value={isCurrentOFW}
                    disabled={!editMode}
                >
                    {yesAndNoOptionTypes.map((item, index) => {
                        if (item === isCurrentOFW) {
                            return (
                                <option value={item} selected='selected' key={index}>
                                    {item}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Specify Country</CLabel>
                <CSelect
                    className='form-control'
                    onChange={(e) => setCurrentOFWCountry(e.target.value)}
                    value={currentOFWCountry}
                    disabled={!editMode}
                >
                    {countriesList.map((item, index) => {
                        if (item.name === currentOFWCountry) {
                            return (
                                <option value={item.name} selected='selected' key={index}>
                                    {item.name}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Are you a former OFW?</CLabel>
                <CSelect
                    className='form-control'
                    onChange={(e) => setIsFormerOFW(e.target.value)}
                    value={isFormerOFW}
                    disabled={!editMode}
                >
                    {yesAndNoOptionTypes.map((item, index) => {
                        if (item === isFormerOFW) {
                            return (
                                <option value={item} selected='selected' key={index}>
                                    {item}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Latest country of deployment</CLabel>
                <CSelect
                    className='form-control'
                    onChange={(e) => setLastCountryDeployment(e.target.value)}
                    value={lastCountryDeployment}
                    disabled={!editMode}
                >
                    {countriesList.map((item, index) => {
                        if (item.name === lastCountryDeployment) {
                            return (
                                <option value={item.name} selected='selected' key={index}>
                                    {item.name}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Date of return to Philippines</CLabel>
                <CInput
                    className='form-control'
                    type='date'
                    onChange={(e) => {
                        setDateReturnToPH(e.target.value);
                    }}
                    value={dateReturnToPH}
                    disabled={!editMode}
                />
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor='four-ps-beneficiary'>
                    Are you a 4Ps beneficiary?
                </CLabel>
                <CSelect
                    className='form-control'
                    id='four-ps-beneficiary'
                    name='four-ps-beneficiary'
                    onChange={(e) =>
                        setSelectedFourPsBeneficiaryTypes(e.target.value)
                    }
                    value={selectedFourPsBeneficiaryTypes}
                    disabled={!editMode}
                >
                    {yesAndNoOptionTypes.map((item, index) => {
                        if (item === selectedFourPsBeneficiaryTypes) {
                            return (
                                <option value={item} selected='selected' key={index}>
                                    {item}
                                </option>
                            );
                        } else {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            );
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor='household-id-no'>If yes, Household ID no.</CLabel>
                <CInput
                    className='form-control'
                    type='text'
                    placeholder='Household ID no.'
                    autoComplete='householdIDNo'
                    size='8'
                    onChange={(e) => setHouseholdIDNo(e.target.value)}
                    value={householdIDNo}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentStatusItem);
