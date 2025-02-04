import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import {
  CRow,
  CSelect,
  CButton,
  CLabel,
  CFormGroup,
  CInput,
  CTextarea,
  CModal,
  CModalHeader,
  CModalBody,
} from '@coreui/react';
import sourceSelectionTypes from '../../reusable/constants/sourceSelectionTypes';
import countriesList from '../../reusable/constants/countriesList';
import * as actions from '../../store/actions/index';
import axios from '../../axios';

const ViewPlacementReport = (props) => {
  const [placementReportID, setPlacementReportID] = useState();
  const [selectedEmployerID, setSelectedEmployerID] = useState();
  const [selectedUserID, setSelectedUserID] = useState();
  const [position, setPosition] = useState('');
  const [dateHired, setDateHired] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [contractPeriod, setContractPeriod] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('Philippines');
  const [cityOrMunicipality, setCityOrMunicipality] = useState('');
  const [remarks, setRemarks] = useState('');

  const [selectedEmployer, setSelectedEmployer] = useState();
  const [selectedUser, setSelectedUser] = useState();

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (props.selectedPlacementReport) {
      setPlacementReportID(props.selectedPlacementReport.placementReportID);
      setSelectedEmployerID(props.selectedPlacementReport.CompanyID);
      setSelectedUserID(props.selectedPlacementReport.userID);
      setPosition(props.selectedPlacementReport.position);
      setDateHired(props.selectedPlacementReport.dateHired);
      setSelectedSource({
        value: props.selectedPlacementReport.source,
        label: props.selectedPlacementReport.source,
      });
      setSourceDate(props.selectedPlacementReport.sourceDate);
      setBasicSalary(props.selectedPlacementReport.basicSalary);
      setContractPeriod(props.selectedPlacementReport.contractPeriod);
      setSelectedCountry(props.selectedPlacementReport.areaOfDeploymentCountry);
      setCityOrMunicipality(
        props.selectedPlacementReport.areaOfDeploymentMunicipality
      );
      setRemarks(props.selectedPlacementReport.remarks);

      setSelectedEmployer({
        value: props.selectedPlacementReport.CompanyID,
        label: props.selectedPlacementReport.CompanyName,
      });

      setSelectedUser({
        value: props.selectedPlacementReport.userID,
        label:
          '[' +
          props.selectedPlacementReport.userID +
          ']' +
          ' ' +
          props.selectedPlacementReport.lastName +
          ', ' +
          props.selectedPlacementReport.firstName +
          ' ' +
          props.selectedPlacementReport.middleName +
          ' [' +
          props.selectedPlacementReport.userGenID +
          ']',
      });
    }
  }, [props.selectedPlacementReport]);

  const onSearchEmployers = (searchQuery, callback) => {
    setTimeout(() => {
      let bodyFormData = new FormData();
      bodyFormData.set('search_query', searchQuery);

      let url = '';
      if (props.auth.user.user_type === 'ADMIN') {
        url = `/api/admin/search-employer-list`;
      }

      axios({
        method: 'post',
        auth: { username: props.auth.token },
        url: url,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          const em = response.data.companies.map((company) => {
            return {
              value: company.id,
              label: '[' + company.id + ']' + ' ' + company.name,
            };
          });
          callback(em);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }, 1000);
  };

  const onSearchUsers = (searchQuery, callback) => {
    setTimeout(() => {
      let bodyFormData = new FormData();
      bodyFormData.set('search_query', searchQuery);

      let url = '';
      if (props.auth.user.user_type === 'ADMIN') {
        url = `/api/admin/search-jobseeker-student-list`;
      } else if (props.auth.user.user_type === 'EMPLOYER') {
        url = '/api/company/search-jobseeker-student-list';
      }

      axios({
        method: 'post',
        auth: { username: props.auth.token },
        url: url,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          const em = response.data.users.map((user) => {
            return {
              value: user.id,
              label:
                '[' +
                user.id +
                ']' +
                ' ' +
                user.last_name +
                ', ' +
                user.first_name +
                ' ' +
                user.middle_name +
                ' [' +
                user.user_gen_id +
                ']',
            };
          });
          callback(em);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }, 1000);
  };

  const updatePlacementReport = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('placement_report_id', placementReportID);
    bodyFormData.set('employer_id', selectedEmployerID);
    bodyFormData.set('user_id', selectedUserID);
    bodyFormData.set('position', position);
    bodyFormData.set('date_hired', dateHired);
    bodyFormData.set('source', selectedSource.value);
    bodyFormData.set('source_date', sourceDate);
    bodyFormData.set('basic_salary', basicSalary);
    bodyFormData.set('contract_period', contractPeriod);
    bodyFormData.set('area_of_deployment_country', selectedCountry);
    bodyFormData.set('area_of_deployment_city_municipality', cityOrMunicipality);
    bodyFormData.set('remarks', remarks);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/update-placement-report`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log('response', response);
        toast("Successfully updated placement report")
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  const deletePlacementReport = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('placement_report_id', placementReportID);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/delete-placement-report`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log('response', response);
        toast("Successfully deleted placement report")
      })
      .catch((error) => {
        console.log('error', error);
        alert("An error occurred");
      });
  };

  return (
    <>
      <CModal
        show={props.show}
        onClose={() => {
          props.setShowAppModal(false);
        }}
        size='xl'
        closeOnBackdrop={false}
      >
        <CModalHeader closeButton>Placement Report</CModalHeader>
        <CModalBody>
          <div style={{ padding: 25 }}>
            <form>
              <div className=''>
                <div className=' m-md-3 mt-xs-3 mt-3 mt-sm-3'>
                  <div className=''>
                    <div className='tab-content' id='pills-tabContent'>
                      <div
                        className='tab-pane fade active show'
                        id='personal-info'
                        role='tabpanel'
                        aria-labelledby='personal-info-tab'
                      >
                        {props.auth.user.user_type === 'ADMIN' ? (
                          <CRow className='form-row'>
                            <div className='col-12'>
                              <div className='form-group'>
                                <CLabel>Employer</CLabel>
                                <AsyncSelect
                                  cacheOptions
                                  loadOptions={onSearchEmployers}
                                  value={selectedEmployer}
                                  onChange={(e) => {
                                    if (e) {
                                      setSelectedEmployer(e);
                                      setSelectedEmployerID(e.value);
                                    }
                                  }}
                                  isDisabled={!editMode}
                                />
                              </div>
                            </div>
                          </CRow>
                        ) : null}
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>User (Jobseeker / Student) </CLabel>
                              <AsyncSelect
                                cacheOptions
                                loadOptions={onSearchUsers}
                                value={selectedUser}
                                onChange={(e) => {
                                  if (e) {
                                    setSelectedUser(e);
                                    setSelectedUserID(e.value);
                                  }
                                }}
                                isDisabled={!editMode}
                                isClearable={true}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>Position Hired</CLabel>
                              <CInput
                                className='form-control'
                                type='text'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setPosition(e.target.value);
                                }}
                                value={position}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>Date Hired</CLabel>
                              <CInput
                                className='form-control'
                                type='date'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setDateHired(e.target.value);
                                }}
                                value={dateHired}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-6'>
                            <div className='form-group'>
                              <CLabel>Source</CLabel>
                              <CreatableSelect
                                isClearable
                                options={sourceSelectionTypes}
                                placeholder={'Select Source'}
                                value={selectedSource}
                                onChange={(item, actionMeta) => {
                                  setSelectedSource(item);
                                }}
                                isDisabled={!editMode}
                              />
                            </div>
                          </div>
                          <div className='col-6'>
                            <div className='form-group'>
                              <CLabel>Source Date</CLabel>
                              <CInput
                                className='form-control'
                                type='date'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setSourceDate(e.target.value);
                                }}
                                value={sourceDate}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>Basic Salary</CLabel>
                              <CInput
                                className='form-control'
                                type='number'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setBasicSalary(e.target.value);
                                }}
                                value={basicSalary}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>Contract Period (In years)</CLabel>
                              <CInput
                                className='form-control'
                                type='number'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setContractPeriod(e.target.value);
                                }}
                                value={contractPeriod}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        Area of deployment
                        <CRow className='form-row'>
                          <div className='col-6'>
                            <div className='form-group'>
                              <CLabel>Country</CLabel>
                              <CSelect
                                className='form-control'
                                onChange={(e) =>
                                  setSelectedCountry(e.target.value)
                                }
                                value={selectedCountry}
                                disabled={!editMode}
                              >
                                {countriesList.map((item, index) => {
                                  {
                                    if (item.name === selectedCountry) {
                                      return (
                                        <option
                                          value={item.name}
                                          selected='selected'
                                          key={index}
                                        >
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
                                  }
                                })}
                              </CSelect>
                            </div>
                          </div>
                          <div className='col-6'>
                            <div className='form-group'>
                              <CLabel>City/Municipality</CLabel>
                              <CInput
                                className='form-control'
                                type='text'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setCityOrMunicipality(e.target.value);
                                }}
                                value={cityOrMunicipality}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                        <CRow className='form-row'>
                          <div className='col-12'>
                            <div className='form-group'>
                              <CLabel>Remarks</CLabel>
                              <CTextarea
                                className='form-control'
                                type='text'
                                placeholder=''
                                size='8'
                                onChange={(e) => {
                                  setRemarks(e.target.value);
                                }}
                                value={remarks}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CRow>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/*  */}

          {
            ('props.auth.user',
              props.auth.user.user_type === 'ADMIN' ? (
                <CRow className='form-row'>
                  <div className='col-12'>
                    <CFormGroup>
                      {editMode ? (
                        <>
                          <CButton
                            className='btn btn-sm btn-primary float-right ml-2'
                            color='primary'
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to save the changes?'
                                )
                              ) {
                                setEditMode(!editMode);
                                updatePlacementReport();
                              }
                            }}
                          >
                            Save
                          </CButton>
                          <CButton
                            className='btn btn-sm btn-primary float-right ml-2'
                            color='warning'
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to cancel the changes?'
                                )
                              ) {
                                setEditMode(!editMode);
                              }
                            }}
                          >
                            Cancel
                          </CButton>
                        </>
                      ) : (
                        <>
                          <CButton
                            className='btn btn-sm btn-primary float-right ml-2'
                            color='primary'
                            onClick={() => {
                              setEditMode(!editMode);
                            }}
                          >
                            Edit
                          </CButton>
                          <CButton
                            className='btn btn-sm btn-danger float-right ml-2'
                            style={{ paddingRight: 15 }}
                            color='primary'
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to permanently delete this placement report? This action is irreversible.'
                                )
                              ) {
                                setEditMode(!editMode);
                                deletePlacementReport();
                                props.setShowAppModal(false);
                              }
                            }}
                          >
                            Delete
                          </CButton>
                        </>
                      )}
                    </CFormGroup>
                  </div>
                </CRow>
              ) : null)
          }
        </CModalBody>
      </CModal>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPlacementReport);
