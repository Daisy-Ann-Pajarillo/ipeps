import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    CContainer,
    CInput,
    CLabel,
    CFormGroup,
    CSelect,
} from '@coreui/react';
import countriesList from '../../../../../reusable/constants/countriesList';

const JobPreferenceWorkLocItem = (props) => {
    const editMode = false;
    const [country, setCountry] = useState('');
    const [cityMunicipalities, setCityMunicipalities] = useState('');

    useEffect(() => {
        setCountry(props.country);
        setCityMunicipalities(props.cityMunicipalities);
    }, [props.occupation, props.cityMunicipalities]);

    return (
        <CContainer>
            <CFormGroup>
                <CLabel>Country</CLabel>
                <CSelect
                    className='form-control'
                    value={country}
                    disabled={!editMode}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    {countriesList.map((item, i) => {
                        {
                            if (item.name === country) {
                                return (
                                    <option value={item.name} selected='selected' key={i}>
                                        {item.name}
                                    </option>
                                );
                            } else {
                                return (
                                    <option key={i} value={item.name}>
                                        {item.name}
                                    </option>
                                );
                            }
                        }
                    })}
                </CSelect>
            </CFormGroup>
            <CFormGroup>
                <CLabel>City/Municipalities</CLabel>
                <CInput
                    type='text'
                    value={cityMunicipalities}
                    onChange={(e) => setCityMunicipalities(e.target.value)}
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

export default connect(mapStateToProps)(JobPreferenceWorkLocItem);
