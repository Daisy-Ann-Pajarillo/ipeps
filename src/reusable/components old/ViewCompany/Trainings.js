import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@mui/material/Grid2';
import * as actions from '../../../store/actions/index';
import axios from '../../../axios';
import TrainingPostItem2 from '../../../reusable/components/TrainingPostItem2';
import ViewTrainingPost from '../../../reusable/components/ViewTrainingPost';

const Trainings = (props) => {
  const [trainings, setTrainings] = useState([]);
  const [companyData, setCompanyData] = useState();

  const [selectedTrainingPost, setSelectedTrainingPost] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.companyProfileID) {
      loadTrainings(props.companyProfileID);
    }
  }, [props.companyProfileID]);

  const loadTrainings = (companyProfileID) => {
    let bodyFormData = new FormData();
    bodyFormData.set('company_profile_id', companyProfileID);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/user/get-company-profile-trainings`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setTrainings(response.data.trainings);
        setCompanyData(response.data.company);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <>
      <ViewTrainingPost
        show={showModal}
        onClose={() => setShowModal(!showModal)}
        id={selectedTrainingPost?.id}
        logoImg={companyData?.logo_img_file_url}
        title={selectedTrainingPost?.title}
        displayDescription={selectedTrainingPost?.display_desc}
        posterName={companyData?.name}
      />
      <Grid container spacing={2}>
        {trainings.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TrainingPostItem2
              title={item?.title}
              posterName={companyData?.name}
              onClick={() => {
                setSelectedTrainingPost(item);
                setShowModal(true);
              }}
            />
          </Grid>
        ))}
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Trainings);
