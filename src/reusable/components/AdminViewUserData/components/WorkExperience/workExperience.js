import React from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { CContainer } from '@coreui/react';
import workExperienceStatusTypes from '../../../../../reusable/constants/workExperienceStatusTypes';

const WorkExperience = (props) => {
  return (
    <div>
      {props?.userData?.work_history?.length === 0 ? <CContainer><p>No Work Experience</p></CContainer> : null}
      {props?.userData?.work_history?.map((workExpEntry, index) => {
        return (
          <div key={index}>
            <p>ID: {workExpEntry.id}</p>
            <div className='form-row'>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Company Name</label>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Company Name'
                    value={workExpEntry.company_name}
                    disabled={true}
                  />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Company Address</label>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Company Address'
                    value={workExpEntry.address}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            {/* 2nd Row */}
            <div className='form-row'>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Position</label>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Position'
                    value={workExpEntry.position}
                    disabled={true}
                  />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Employment Status</label>
                  <CreatableSelect
                    isClearable
                    options={workExperienceStatusTypes}
                    placeholder={
                      'Select a employment status or type your own'
                    }
                    value={{
                      label: workExpEntry.status,
                      value: workExpEntry.status,
                    }}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>
            {/* 3rd Row */}
            <div className='form-row'>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Inclusive Date Start</label>
                  <input
                    className='form-control'
                    type='date'
                    value={workExpEntry.date_from}
                    disabled={true}
                  />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group'>
                  <label>Inclusive Date End</label>
                  <input
                    className='form-control'
                    type='date'
                    value={workExpEntry.date_to}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            {/* 4th Row */}
            <div className='form-row'>
              <div className='col-12'>
                <div className='form-group'>
                  <label>Number of Months</label>
                  <input
                    className='form-control'
                    type='number'
                    placeholder='1, 6, 12, 18'
                    value={workExpEntry.no_of_months}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps)(WorkExperience);
