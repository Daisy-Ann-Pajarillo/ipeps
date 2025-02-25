import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CContainer,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
} from '@coreui/react';
import ChangeUsertype from './components/General/changeUsertype';
import Name from './components/General/name';
import Email from './components/General/email';
import Username from './components/General/username';
import Password from './components/General/password';
import ID from './components/General/id';
import PermanentAddresses from './components/General/permanentAddresses';
import PresentAddresses from './components/General/presentAddresses';
import CreateAddressForm from './components/General/createAddressForm';
import EmploymentStatus from './components/EmploymentStatus/employmentStatus';
import EducationalBackground from './components/EducationalBackground/educationalBackground';
import WorkExperience from './components/WorkExperience/workExperience';
import EligibProfLicense from './components/EligibilityProfessionalLicense/EligibProfLicense';
import LanguageProficiency from './components/LanguageProficiency/languageProficiency';
import Skills from './components/Skills/skills';
import OtherTraining from './components/OtherTraining/otherTraining'
import JobPreference from './components/JobPreference/jobPreference';

const AdminViewUserData = (props) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);

  const content = {
    1: 'General',
    2: 'Employment Status',
    3: 'Educational Background',
    4: 'Work Experience',
    5: 'Eligibility / Professional License',
    6: 'Language / Dialect Proficency',
    7: 'Skills',
    8: 'Technical/Vocational Course & Other Training',
    9: 'Job Preference',
  };

  let selectedTabContent = null;

  // console.log('props?.userData', props?.userData)
  if (selectedTab === 1) {
    selectedTabContent = (
      <div>
        UserID: {props?.userData?.id}
        <br />
        <ChangeUsertype userData={props?.userData} />
        <br />
        <hr />
        <Name userData={props?.userData} />
        <br />
        <hr />
        <Email userData={props?.userData} />
        <br />
        <hr />
        <Username userData={props?.userData} />
        <br />
        <hr />
        <Password userData={props?.userData} />
        <br />
        <hr />
        <ID userData={props?.userData} />
        <br />
        <hr />
        <CreateAddressForm
          show={showCreateAddressModal}
          setShowAppModal={setShowCreateAddressModal}
          userData={props?.userData}
        />
        <br />
        <div style={{ paddingTop: 10 }}>
          <h4>Addresses</h4>
          <br />
          <CButton
            color='primary'
            onClick={() => {
              setShowCreateAddressModal(true);
            }}
          >
            Create Address
          </CButton>
        </div>
        <PermanentAddresses userData={props?.userData} />
        <hr />
        <PresentAddresses userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 2) {
    selectedTabContent = (
      <div>
        <EmploymentStatus userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 3) {
    selectedTabContent = (
      <div>
        <EducationalBackground userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 4) {
    selectedTabContent = (
      <div>
        <WorkExperience userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 5) {
    selectedTabContent = (
      <div>
        <EligibProfLicense userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 6) {
    selectedTabContent = (
      <div>
        <LanguageProficiency userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 7) {
    selectedTabContent = (
      <div>
        <Skills userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 8) {
    selectedTabContent = (
      <div>
        <OtherTraining userData={props?.userData} />
      </div>
    );
  }
  else if (selectedTab === 9) {
    selectedTabContent = (
      <div>
        <JobPreference userData={props?.userData} />
      </div>
    );
  }

  const contentToRender = [];
  for (var key in content) {
    if (content.hasOwnProperty(key)) {
      if (selectedTab === parseInt(key)) {
        contentToRender.push(
          <CNavItem
            key={key}
            onClick={(e) => {
              setSelectedTab(parseInt(e.target.id));
            }}
          >
            <CNavLink active id={key}>
              {content[key]}
            </CNavLink>
          </CNavItem>
        );
      } else {
        contentToRender.push(
          <CNavItem
            key={key}
            onClick={(e) => {
              setSelectedTab(parseInt(e.target.id));
            }}
          >
            <CNavLink id={key}>{content[key]}</CNavLink>
          </CNavItem>
        );
      }
    }
  }

  return (
    <CModal
      size={'xl'}
      show={props.show}
      onClose={props.onClose}
      closeOnBackdrop={false}
    >
      <CModalHeader closeButton></CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow>
            <CCol lg='12'>
              <CNav variant='pills' className='mt-2'>
                {contentToRender}
              </CNav>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol lg='12'>{selectedTabContent}</CCol>
          </CRow>
        </CContainer>
      </CModalBody>
    </CModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminViewUserData);
