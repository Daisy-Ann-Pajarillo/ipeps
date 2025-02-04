import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { CButton, CLabel, CFormGroup, CRow } from '@coreui/react';

const TrainingItem = (props) => {
  return (
    <>
      <CRow className='form-row'>
        <div className='col-md-4 col-sm-12'>
          <div className='form-group'>
            <CLabel>Course name</CLabel>
            <CreatableSelect
              isClearable
              value={{
                label: props.courseName,
                value: props.courseName,
              }}
              isDisabled
            />
          </div>
        </div>
        <div className='col-md-4 col-sm-12'>
          <div className='form-group'>
            <CLabel>Training Institution</CLabel>
            <CreatableSelect
              isClearable
              value={{
                label: props.trainingInstitution,
                value: props.trainingInstitution,
              }}
              isDisabled
            />
          </div>
        </div>
        <div className='col-md-4 col-sm-12'>
          <div className='form-group'>
            <CLabel>Certificates Received</CLabel>
            <CreatableSelect
              isClearable
              value={{
                label: props.certificatesReceived,
                value: props.certificatesReceived,
              }}
              isDisabled
            />
          </div>
        </div>
      </CRow>
      <CRow>
        {props.isRemovable ? (
          <CFormGroup>
            <CButton
              className='btn btn-sm btn-primary float-right ml-2'
              color='danger'
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to remove this training requirement?'
                  )
                ) {
                  props.removeOtherTrainingInList(props.id);
                }
              }}
            >
              Remove
            </CButton>
          </CFormGroup>
        ) : null}
      </CRow>
    </>
  );
};

export default TrainingItem;
