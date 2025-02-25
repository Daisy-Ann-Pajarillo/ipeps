import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import * as actions from '../../../store/actions/index';
import axios from '../../../axios';

import JobPostItem from '../../../reusable/components/JobPostItem';
import ViewJobPost from '../../../reusable/components/ViewJobPost';

const Jobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [companyData, setCompanyData] = useState();
  const [selectedJobPost, setSelectedJobPost] = useState();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.companyProfileID) {
      loadJobs(props.companyProfileID);
    }
  }, [props.companyProfileID]);

  const loadJobs = (companyProfileID) => {
    let bodyFormData = new FormData();
    bodyFormData.set('company_profile_id', companyProfileID);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/get-company-profile-jobs`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log('response', response)
        setJobs(response.data.results);
        setCompanyData(response.data.company);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <>
      <ViewJobPost
        show={showModal}
        onClose={() => setShowModal(!showModal)}
        id={selectedJobPost?.job_posting?.id}
        logoImg={companyData?.logo_img_file_url}
        companyName={companyData?.name}
        companyDescription={companyData?.company_description}
        companyEmail={companyData?.email}
        companyWebsite={companyData?.company_website}
        totalWorkforce={companyData?.total_workforce}
        jobName={selectedJobPost?.job_posting?.job_name}
        jobType={selectedJobPost?.job_posting?.job_type}
        experienceLevel={selectedJobPost?.job_posting?.experience_level}
        numOfVacancies={selectedJobPost?.job_posting?.number_of_vacancies}
        jobDescription={selectedJobPost?.job_posting?.job_description}
        salaryRangeFrom={selectedJobPost?.job_posting?.salary_range_from}
        salaryRangeTo={selectedJobPost?.job_posting?.salary_range_to}
        preferredCountry={selectedJobPost?.job_posting?.preferred_country}
        preferredCityMunicipality={selectedJobPost?.job_posting?.preferred_city_municipality}
        educationalLevel={selectedJobPost?.job_posting?.educational_levels}
        fieldOfStudy={selectedJobPost?.job_posting?.field_of_studies}
        majorsNeeded={selectedJobPost?.job_posting?.majors}
        preferredSkills={selectedJobPost?.job_posting?.skills}
        qualifications={selectedJobPost?.job_posting?.degree_qualifications}
        trainingsNeeded={selectedJobPost?.job_posting?.trainings_needed}
        preferredSex={selectedJobPost?.job_posting?.preferred_sex}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {jobs.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <JobPostItem
                jobName={item.job_posting.job_name}
                description={item.job_posting.job_description}
                salaryRangeFrom={item.job_posting.salary_range_from}
                salaryRangeTo={item.job_posting.salary_range_to}
                companyName={companyData?.name}
                country={item.job_posting.preferred_country}
                cityMunicipality={item.job_posting.preferred_city_municipality}
                experienceLevel={item.job_posting.experience_level}
                jobType={item.job_posting.job_type}
                onClick={() => {
                  setSelectedJobPost(item);
                  setShowModal(true);
                }}
                status={item.job_posting.status}
                showStatus={false}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
