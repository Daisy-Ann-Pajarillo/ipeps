import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';

import { CButton, CContainer, CForm, CLabel, CFormGroup } from '@coreui/react';

const ID = (props) => {
  const [editMode, setEditMode] = useState(false);

  // File Uploading and Handling
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedIDFileName, setUploadedIDFileName] = useState('No ID Saved');
  const [uploadedIDFileURL, setUploadedIDFileURL] = useState('#');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    console.log(
      'test',
      props?.userData
    );

    if (
      props?.userData?.id_verification_img_file_name &&
      props?.userData?.id_verification_img_file_url
    ) {

      setUploadedIDFileName(props?.userData?.id_verification_img_file_name);
      setUploadedIDFileURL(props?.userData?.id_verification_img_file_url);
    }
  }, [props.userData.id]);

  const updateID = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('user_id', props?.userData?.id);
    bodyFormData.set('valid_id_file', selectedFile);
    axios({
      method: 'post',
      auth: { username: props.auth.token },
      url: `/api/admin/manage-users/verification-id/update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        // console.log(response)
        setEditMode(!editMode);
        setErrorMsg('');
        toast('Successfully updated id');
      })
      .catch((error) => {
        setErrorMsg(error.response?.data?.message);
      });
  };

  return (
    <>
      <CContainer>
        <CForm>
          <CFormGroup>
            <div className='col-6'>
              <CLabel>Update valid ID</CLabel>
              <div className='form-group'>
                <div className='row form-group'>
                  <label className='col-form-label col-md-3'>Choose file</label>
                  <div className='col-12 col-md-9'>
                    <input
                      className='custom-file-input'
                      id='custom-file-input'
                      type='file'
                      // value={selectedFile}
                      onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                        setSelectedFileName(e.target.files[0].name);
                      }}
                      disabled={!editMode}
                    />
                    <label
                      className='custom-file-label'
                      for='custom-file-input'
                    >
                      Choose file...
                    </label>
                    {selectedFileName}
                  </div>
                </div>
              </div>
              <p>
                Saved Uploaded File
                <br />
                <CButton
                  color='primary'
                  href={uploadedIDFileURL}
                  disabled={uploadedIDFileURL === '#'
                    || uploadedIDFileURL === null
                    || uploadedIDFileURL === undefined ? true : false}
                >
                  Download File
                </CButton>
              </p>
            </div>
          </CFormGroup>
          <CFormGroup>
            {editMode ? (
              <>
                <CButton
                  className='btn btn-sm btn-primary float-right ml-2'
                  color='primary'
                  type='button'
                  onClick={updateID}
                >
                  Save
                </CButton>
                <CButton
                  className='btn btn-sm btn-primary float-right ml-2'
                  color='primary'
                  type='button'
                  onClick={() => {
                    setEditMode(false);
                    setErrorMsg('');
                  }}
                >
                  Cancel
                </CButton>
              </>
            ) : (
              <CButton
                className='btn btn-sm btn-primary float-right ml-2'
                color='primary'
                type='button'
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </CButton>
            )}
          </CFormGroup>
        </CForm>
      </CContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(ID);
