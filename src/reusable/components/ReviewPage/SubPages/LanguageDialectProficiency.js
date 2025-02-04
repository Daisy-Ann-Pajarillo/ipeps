import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid2 as Grid, FormControlLabel, Checkbox, FormGroup, Typography } from '@mui/material';

const LanguageDialectProficiency = (props) => {
  const [isCheckedEnglishRead, setCheckedEnglishRead] = useState(false);
  const [isCheckedEnglishWrite, setCheckedEnglishWrite] = useState(false);
  const [isCheckedEnglishSpeak, setCheckedEnglishSpeak] = useState(false);
  const [isCheckedEnglishUnderstand, setCheckedEnglishUnderstand] = useState(false);
  const [isCheckedFilipinoRead, setCheckedFilipinoRead] = useState(false);
  const [isCheckedFilipinoWrite, setCheckedFilipinoWrite] = useState(false);
  const [isCheckedFilipinoSpeak, setCheckedFilipinoSpeak] = useState(false);
  const [isCheckedFilipinoUnderstand, setCheckedFilipinoUnderstand] = useState(false);
  const [addedLanguages, setAddedLanguages] = useState([]);

  // useEffect(() => {
  //   if (props.pageData && Object.keys(props.pageData).length !== 0) {
  //     const englishProf = JSON.parse(props.pageData.english_proficiency);
  //     const filipinoProf = JSON.parse(props.pageData.filipino_proficiency);
  //     const otherLangProf = JSON.parse(props.pageData.other_lang_proficiency);

  //     // English Language Check Boxes
  //     setCheckedEnglishRead(englishProf.isCheckedEnglishRead);
  //     setCheckedEnglishWrite(englishProf.isCheckedEnglishSpeak);
  //     setCheckedEnglishSpeak(englishProf.isCheckedEnglishUnderstand);
  //     setCheckedEnglishUnderstand(englishProf.isCheckedEnglishWrite);

  //     // Filipino Language Check Boxes
  //     setCheckedFilipinoRead(filipinoProf.isCheckedFilipinoRead);
  //     setCheckedFilipinoWrite(filipinoProf.isCheckedFilipinoWrite);
  //     setCheckedFilipinoSpeak(filipinoProf.isCheckedFilipinoSpeak);
  //     setCheckedFilipinoUnderstand(filipinoProf.isCheckedFilipinoUnderstand);

  //     setAddedLanguages(otherLangProf);
  //   }
  // }, [props.pageData]);

  return (
    <>
      <div
        className='tab-pane fade active show'
        id='lang-prof'
        role='tabpanel'
        aria-labelledby='lang-prof-tab'
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <Typography variant="h6">English</Typography>
              <FormControlLabel
                control={<Checkbox checked={isCheckedEnglishRead} readOnly disabled />}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedEnglishWrite} readOnly disabled />}
                label="Write"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedEnglishSpeak} readOnly disabled />}
                label="Speak"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedEnglishUnderstand} readOnly disabled />}
                label="Understand"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <Typography variant="h6">Filipino</Typography>
              <FormControlLabel
                control={<Checkbox checked={isCheckedFilipinoRead} readOnly disabled />}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedFilipinoWrite} readOnly disabled />}
                label="Write"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedFilipinoSpeak} readOnly disabled />}
                label="Speak"
              />
              <FormControlLabel
                control={<Checkbox checked={isCheckedFilipinoUnderstand} readOnly disabled />}
                label="Understand"
              />
            </FormGroup>
          </Grid>
        </Grid>
        {/* Added Languages */}
        <Grid container spacing={2}>
          {addedLanguages.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FormGroup>
                <Typography variant="h6">{item.languageNameValue}</Typography>
                <FormControlLabel
                  control={<Checkbox checked={item.isCheckedOthersReadValue} readOnly disabled />}
                  label="Read"
                />
                <FormControlLabel
                  control={<Checkbox checked={item.isCheckedOthersWriteValue} readOnly disabled />}
                  label="Write"
                />
                <FormControlLabel
                  control={<Checkbox checked={item.isCheckedOthersSpeakValue} readOnly disabled />}
                  label="Speak"
                />
                <FormControlLabel
                  control={<Checkbox checked={item.isCheckedOthersUnderstandValue} readOnly disabled />}
                  label="Understand"
                />
              </FormGroup>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(LanguageDialectProficiency);
