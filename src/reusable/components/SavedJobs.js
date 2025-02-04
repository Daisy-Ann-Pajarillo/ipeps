import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import axios from '../../axios';

import JobPostItem2 from '../../reusable/components/JobPostItem2';
import ViewJobPost from '../../reusable/components/ViewJobPost';

const SavedJobs = (props) => {
  const [selectedJobPost, setSelectedJobPost] = useState();

  const [paginationData, setPaginationData] = useState({});
  const numOfItems = 10;
  const pageNum = 1;

  const [showModal, setShowModal] = useState(false);

  /*
  useEffect(() => {
    loadAllSavedJobs();
  }, []);

  const loadAllSavedJobs = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('num_of_items', numOfItems);
    bodyFormData.set('page_num', pageNum);

    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/saved-job-posts/get-all`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        // console.log('response', response);
        setPaginationData(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
*/
  return (
    <>
      <ViewJobPost
        show={showModal}
        onClose={() => setShowModal(!showModal)}
        id={selectedJobPost?.job_posting?.id}
        logoImg={selectedJobPost?.company?.logo_img_file_url}
        companyName={selectedJobPost?.company?.name}
        companyDescription={selectedJobPost?.company?.company_description}
        companyEmail={selectedJobPost?.company?.email}
        companyWebsite={selectedJobPost?.company?.company_website}
        totalWorkforce={selectedJobPost?.company?.total_workforce}
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
      <div style={{ overflowY: 'auto', paddingLeft: 10 }}>
        <div style={{ paddingBottom: 10 }}>
          {paginationData.total !== 0 ? (
            <>Total: {paginationData.total} (showing latest 10)</>
          ) : (
            <>No Saved Jobs</>
          )}{' '}
          <Link to='/dashboard/saved-jobs'>View all</Link>
        </div>
        {paginationData?.results?.map((item) => {
          {
            return (
              <JobPostItem2
                // companyLogo={item.data.company.logo_img_file_url}
                jobName={item.job_posting.job_name}
                description={item.job_posting.job_description}
                salaryRangeFrom={item.job_posting.salary_range_from}
                salaryRangeTo={item.job_posting.salary_range_to}
                companyName={item.company.name}
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
            );
          }
        })}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedJobs);
