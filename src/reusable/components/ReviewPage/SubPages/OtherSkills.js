import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Grid, FormControlLabel, Checkbox, Box, Typography, Button, CircularProgress, Modal } from '@mui/material';
import axios from '../../../../axios';

const OtherSkills = (props) => {
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
  const [stenographyChecked, setStenographyChecked] = useState(false);
  const [tailoringChecked, setTailoringChecked] = useState(false);

  // Adding Fields
  const [otherFieldsValue, setOtherFieldsValue] = useState('');

  // Page Saving States
  const [isPageSaving, setIsPageSaving] = useState(false);
  const [pageFinishedSaving, setPageFinishedSaving] = useState(false);
  const [modalTitleMessage, setModalTitleMessage] = useState('');
  const [modalBodyMessage, setModalBodyMessage] = useState('');

  const [pageMove, setPageMove] = useState('')

  // useEffect(() => {
  //   if (props.pageData && Object.keys(props.pageData).length !== 0) {
  //     setOtherAddedSkills(props.pageData.otherAddedSkills);
  //     // First Column
  //     setAutoMechanicChecked(props.pageData.autoMechanicChecked);
  //     setBeuticianChecked(props.pageData.beuticianChecked);
  //     setCarpentryChecked(props.pageData.carpentryChecked);
  //     setComputerLiterateChecked(props.pageData.computerLiterateChecked);
  //     setDomesticChoresChecked(props.pageData.domesticChoresChecked);
  //     setDriverChecked(props.pageData.driverChecked);
  //     // Second Column
  //     setElectricianChecked(props.pageData.electricianChecked);
  //     setEmbroideryChecked(props.pageData.embroideryChecked);
  //     setGardeningChecked(props.pageData.gardeningChecked);
  //     setMasonryChecked(props.pageData.masonryChecked);
  //     setPainterOrArtistChecked(props.pageData.painterOrArtistChecked);
  //     setPaintingJobsChecked(props.pageData.paintingJobsChecked);
  //     // Third Column
  //     setPhotographyChecked(props.pageData.photographyChecked);
  //     setPlumbingChecked(props.pageData.plumbingChecked);
  //     setSewingDressesChecked(props.pageData.sewingDressesChecked);
  //     setStenographyChecked(props.pageData.stenographyChecked);
  //     setTailoringChecked(props.pageData.tailoringChecked);
  //   }
  // }, [props.pageData]);

  const onAddOtherFieldValue = () => {
    if (otherAddedSkills.length <= 50) {
      const otherAddedSkilldata = {
        id: uuidv4(),
        skillName: otherFieldsValue,
      };
      setOtherAddedSkills([...otherAddedSkills, otherAddedSkilldata]);
      setOtherFieldsValue('');
    }
  };

  const onRemoveOtherFieldValue = (id) => {
    if (id !== '') {
      const index = otherAddedSkills.findIndex((p) => p.id === id);
      if (index > -1) {
        let newOtherAddedSkills = otherAddedSkills;
        newOtherAddedSkills.splice(index, 1);
        setOtherAddedSkills([...newOtherAddedSkills]);
      }
    }
  };

  const onSave = () => {
    const fieldErrors = []
    if (otherFieldsValue !== '') {
      fieldErrors.push('Other skills field');
    }
    if (fieldErrors.length === 0) {
      const data = {
        otherAddedSkills: otherAddedSkills,
        // First Column
        autoMechanicChecked: autoMechanicChecked,
        beuticianChecked: beuticianChecked,
        carpentryChecked: carpentryChecked,
        computerLiterateChecked: computerLiterateChecked,
        domesticChoresChecked: domesticChoresChecked,
        driverChecked: driverChecked,
        // Second Column
        electricianChecked: electricianChecked,
        embroideryChecked: embroideryChecked,
        gardeningChecked: gardeningChecked,
        masonryChecked: masonryChecked,
        painterOrArtistChecked: painterOrArtistChecked,
        paintingJobsChecked: paintingJobsChecked,
        // Third Column
        photographyChecked: photographyChecked,
        plumbingChecked: plumbingChecked,
        sewingDressesChecked: sewingDressesChecked,
        stenographyChecked: stenographyChecked,
        tailoringChecked: tailoringChecked,
      };
      let bodyFormData = new FormData();
      bodyFormData.set('other_skills', JSON.stringify(data));
      axios({
        method: 'post',
        url: '/api/user/registration/jobseeker/other-skills-page/update',
        data: bodyFormData,
        auth: { username: props.auth.token },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          setModalTitleMessage('Saved Changes');
          setModalBodyMessage('Successfully saved the changes on this page');
          setIsPageSaving(false);
          setPageFinishedSaving(true);
        })
        .catch(() => {
          setModalTitleMessage('Saving Unsuccessful');
          setModalBodyMessage('An error occurred');
          setIsPageSaving(false);
          setPageFinishedSaving(true);
          setPageMove('')
        });
    } else {
      setModalTitleMessage('Saving Unsuccessful');
      setModalBodyMessage('An error occurred: ' + 'You have unsaved entries, you filled in the following fields: ' + fieldErrors.join(', '));
      setIsPageSaving(false);
      setPageFinishedSaving(true);
      setPageMove('')
    }
  };

  return (
    <>
      {isPageSaving ? (
        <Modal open={isPageSaving}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        </Modal>
      ) : null}
      {pageFinishedSaving && !isPageSaving ? (
        <Modal open={pageFinishedSaving}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Box bgcolor="background.paper" p={4} borderRadius={2}>
              <Typography variant="h6">{modalTitleMessage}</Typography>
              <Typography variant="body1">{modalBodyMessage}</Typography>
              <Button
                onClick={() => {
                  setIsPageSaving(false);
                  setPageFinishedSaving(false);
                  if (props.selectedTab < 9 && pageMove === "Next") {
                    props.onClickNextPage()
                  }
                  if (props.selectedTab !== 1 && pageMove === "Back") {
                    props.onClickPrevPage()
                  }
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      ) : null}
      <Box className='tab-pane fade active show' id='other-skills-form' role='tabpanel' aria-labelledby='other-skills-background-tab'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Checkbox checked={autoMechanicChecked} onChange={() => setAutoMechanicChecked(!autoMechanicChecked)} disabled />}
              label="Auto Mechanic"
            />
            <FormControlLabel
              control={<Checkbox checked={beuticianChecked} onChange={() => setBeuticianChecked(!beuticianChecked)} disabled />}
              label="Beautician"
            />
            <FormControlLabel
              control={<Checkbox checked={carpentryChecked} onChange={() => setCarpentryChecked(!carpentryChecked)} disabled />}
              label="Carpentry Work"
            />
            <FormControlLabel
              control={<Checkbox checked={computerLiterateChecked} onChange={() => setComputerLiterateChecked(!computerLiterateChecked)} disabled />}
              label="Computer Literate"
            />
            <FormControlLabel
              control={<Checkbox checked={domesticChoresChecked} onChange={() => setDomesticChoresChecked(!domesticChoresChecked)} disabled />}
              label="Domestic Chores"
            />
            <FormControlLabel
              control={<Checkbox checked={driverChecked} onChange={() => setDriverChecked(!driverChecked)} disabled />}
              label="Driver"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Checkbox checked={electricianChecked} onChange={() => setElectricianChecked(!electricianChecked)} disabled />}
              label="Electrician"
            />
            <FormControlLabel
              control={<Checkbox checked={embroideryChecked} onChange={() => setEmbroideryChecked(!embroideryChecked)} disabled />}
              label="Embroidery"
            />
            <FormControlLabel
              control={<Checkbox checked={gardeningChecked} onChange={() => setGardeningChecked(!gardeningChecked)} disabled />}
              label="Gardening"
            />
            <FormControlLabel
              control={<Checkbox checked={masonryChecked} onChange={() => setMasonryChecked(!masonryChecked)} disabled />}
              label="Masonry"
            />
            <FormControlLabel
              control={<Checkbox checked={painterOrArtistChecked} onChange={() => setPainterOrArtistChecked(!painterOrArtistChecked)} disabled />}
              label="Painter/Artist"
            />
            <FormControlLabel
              control={<Checkbox checked={paintingJobsChecked} onChange={() => setPaintingJobsChecked(!paintingJobsChecked)} disabled />}
              label="Painting Jobs"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Checkbox checked={photographyChecked} onChange={() => setPhotographyChecked(!photographyChecked)} disabled />}
              label="Photography"
            />
            <FormControlLabel
              control={<Checkbox checked={plumbingChecked} onChange={() => setPlumbingChecked(!plumbingChecked)} disabled />}
              label="Plumbing"
            />
            <FormControlLabel
              control={<Checkbox checked={sewingDressesChecked} onChange={() => setSewingDressesChecked(!sewingDressesChecked)} disabled />}
              label="Sewing Dresses"
            />
            <FormControlLabel
              control={<Checkbox checked={stenographyChecked} onChange={() => setStenographyChecked(!stenographyChecked)} disabled />}
              label="Stenography"
            />
            <FormControlLabel
              control={<Checkbox checked={tailoringChecked} onChange={() => setTailoringChecked(!tailoringChecked)} disabled />}
              label="Tailoring"
            />
            <Box mt={2}>
              {otherAddedSkills.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={<Checkbox checked onChange={() => onRemoveOtherFieldValue(item.id)} disabled />}
                  label={item.skillName}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(OtherSkills);
