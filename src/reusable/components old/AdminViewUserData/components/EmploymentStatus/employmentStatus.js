import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CContainer } from '@coreui/react';
import EmploymentStatusItem from './EmploymentStatusItem';

const EmploymentStatus = (props) => {
    const [employmentStatuses, setEmploymentStatuses] = useState([]);

    useEffect(() => {
        setEmploymentStatuses(
            props?.userData?.employment_status_history
        );
    }, [props.userData.employment_status_history]);

    return (
        <CContainer>
            {employmentStatuses?.length === 0 ? <CContainer><p>No Employment Statuses</p></CContainer> : null}
            {employmentStatuses?.map((item, index) => {
                return (
                    <div key={index}>
                        <EmploymentStatusItem
                            createdDate={item.created_date}
                            employmentStatusItemID={item.id}
                            isSeekingWork={item.is_seeking_work}
                            isWillingToWorkImmediately={item.is_willing_to_work_immediately}
                            seekingWhenWork={item.seeking_when_work}
                            sinceWhenSeekingWork={item.since_when_seeking_work}
                            is4PsBeneficiary={item.is_4Ps_beneficiary}
                            householdIdNo={item.household_id_no}
                            employmentStatusType={item.employment_status_type}
                            isCurrentOfw={item.is_current_ofw}
                            currentOfwCountry={item.current_ofw_country}
                            isFormerOfw={item.is_former_ofw}
                            lastCountryDeployment={item.last_country_deployment}
                            dateReturnToPh={item.date_return_to_ph}
                        />
                        <br />
                        <hr />
                    </div>
                )
            })}
        </CContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        isAuthenticated: state.auth.token !== null ? true : false,
    };
};

export default connect(mapStateToProps)(EmploymentStatus);
