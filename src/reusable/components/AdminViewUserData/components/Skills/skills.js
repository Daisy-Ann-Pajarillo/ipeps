import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as actions from '../../../../../store/actions/index';

const OtherSkills = (props) => {
  const [profileData, setProfileData] = useState({});
  const editMode = false;
  const [otherAddedSkills, setOtherAddedSkills] = useState([]);

  // First Column
  const [autoMechanicChecked, setAutoMechanicChecked] = useState(false);
  const [beuticianChecked, setBeuticianChecked] = useState(false);
  const [carpentryChecked, setCarpentryChecked] = useState(false);
  const [computerLiterateChecked, setComputerLiterateChecked] = useState(false);
  const [domesticChoresChecked, setDomesticChoresChecked] = useState(false);
  const [driverChecked, setDriverChecked] = useState(false);

  // Second Column
  const [electricianChecked, setElectricianChecked] = useState(false);
  const [embroideryChecked, setEmbroideryChecked] = useState(false);
  const [gardeningChecked, setGardeningChecked] = useState(false);
  const [masonryChecked, setMasonryChecked] = useState(false);
  const [painterOrArtistChecked, setPainterOrArtistChecked] = useState(false);
  const [paintingJobsChecked, setPaintingJobsChecked] = useState(false);

  // Third Column
  const [photographyChecked, setPhotographyChecked] = useState(false);
  const [plumbingChecked, setPlumbingChecked] = useState(false);
  const [sewingDressesChecked, setSewingDressesChecked] = useState(false);
  const [steganographyChecked, setSteganographyChecked] = useState(false);
  const [tailoringChecked, setTailoringChecked] = useState(false);

  useEffect(() => {
    setProfileData(props?.userData)
  }, [props.userData]);

  useEffect(() => {
    for (let i = 0; i < profileData?.skills?.length; i++) {
      // First Column
      if (profileData.skills[i].name === 'auto mechanic') {
        setAutoMechanicChecked(true);
      } else if (profileData.skills[i].name === 'beautician') {
        setBeuticianChecked(true);
      } else if (profileData.skills[i].name === 'carpentry') {
        setCarpentryChecked(true);
      } else if (profileData.skills[i].name === 'computer literate') {
        setComputerLiterateChecked(true);
      } else if (profileData.skills[i].name === 'domestic chores') {
        setDomesticChoresChecked(true);
      } else if (profileData.skills[i].name === 'driver') {
        setDriverChecked(true);
      }
      // Second Column
      else if (profileData.skills[i].name === 'electrician') {
        setElectricianChecked(true);
      } else if (profileData.skills[i].name === 'embroidery') {
        setEmbroideryChecked(true);
      } else if (profileData.skills[i].name === 'gardening') {
        setGardeningChecked(true);
      } else if (profileData.skills[i].name === 'masonry') {
        setMasonryChecked(true);
      } else if (profileData.skills[i].name === 'painter or artist') {
        setPainterOrArtistChecked(true);
      } else if (profileData.skills[i].name === 'painting jobs') {
        setPaintingJobsChecked(true);
      }
      // Third Column
      else if (profileData.skills[i].name === 'photography') {
        setPhotographyChecked(true);
      } else if (profileData.skills[i].name === 'plumbing') {
        setPlumbingChecked(true);
      } else if (profileData.skills[i].name === 'sewing dresses') {
        setSewingDressesChecked(true);
      } else if (profileData.skills[i].name === 'steganography') {
        setSteganographyChecked(true);
      } else if (profileData.skills[i].name === 'tailoring') {
        setTailoringChecked(true);
      } else {
        const otherAddedSkilldata = {
          id: uuidv4(),
          skillName: profileData.skills[i].name,
        };
        setOtherAddedSkills([...otherAddedSkills, otherAddedSkilldata]);
      }
    }
  }, [profileData]);



  return (
    <div className='form-row'>
      <div className='col-4'>
        <div className='form-group'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={autoMechanicChecked}
              onClick={() => {
                setAutoMechanicChecked(!autoMechanicChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Auto Mechanic</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={beuticianChecked}
              onClick={() => {
                setBeuticianChecked(!beuticianChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Beautician</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={carpentryChecked}
              onClick={() => {
                setCarpentryChecked(!carpentryChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Carpentry Work</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={computerLiterateChecked}
              onClick={() => {
                setComputerLiterateChecked(!computerLiterateChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Computer Literate</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={domesticChoresChecked}
              onClick={() => {
                setDomesticChoresChecked(!domesticChoresChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Domestic Chores</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={driverChecked}
              onClick={() => {
                setDriverChecked(!driverChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Driver</label>
          </div>
        </div>
      </div>
      <div className='col-4'>
        <div className='form-group'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={electricianChecked}
              onClick={() => {
                setElectricianChecked(!electricianChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Electrician</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={embroideryChecked}
              onClick={() => {
                setEmbroideryChecked(!embroideryChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Embroidery</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={gardeningChecked}
              onClick={() => {
                setGardeningChecked(!gardeningChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Gardening</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={masonryChecked}
              onClick={() => {
                setMasonryChecked(!masonryChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Masonry</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={painterOrArtistChecked}
              onClick={() => {
                setPainterOrArtistChecked(!painterOrArtistChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Painter/Artist</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={paintingJobsChecked}
              onClick={() => {
                setPaintingJobsChecked(!paintingJobsChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Painting Jobs</label>
          </div>
        </div>
      </div>
      <div className='col-4'>
        <div className='form-group'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={photographyChecked}
              onClick={() => {
                setPhotographyChecked(!photographyChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Photography</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={plumbingChecked}
              onClick={() => {
                setPlumbingChecked(!plumbingChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Plumbing</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={sewingDressesChecked}
              onClick={() => {
                setSewingDressesChecked(!sewingDressesChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Sewing Dresses</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={steganographyChecked}
              onClick={() => {
                setSteganographyChecked(!steganographyChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Steganography</label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={tailoringChecked}
              onClick={() => {
                setTailoringChecked(!tailoringChecked);
              }}
              disabled={!editMode}
            />
            <label className='form-check-label'>Tailoring</label>
          </div>
          <br />
          <br />
          {otherAddedSkills.map((item) => {
            return (
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={true}
                  disabled={!editMode}
                />
                <label className='form-check-label'>
                  {item.skillName}
                </label>
              </div>
            );
          })}
          <br />
          <br />
        </div>
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherSkills);
