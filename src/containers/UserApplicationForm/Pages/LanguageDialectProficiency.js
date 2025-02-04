import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Chip,
} from '@mui/material';

const LanguageDialectProficiency = () => {
  // State for English proficiency
  const [isCheckedEnglishRead, setCheckedEnglishRead] = useState(false);
  const [isCheckedEnglishWrite, setCheckedEnglishWrite] = useState(false);
  const [isCheckedEnglishSpeak, setCheckedEnglishSpeak] = useState(false);
  const [isCheckedEnglishUnderstand, setCheckedEnglishUnderstand] = useState(false);

  // State for Filipino proficiency
  const [isCheckedFilipinoRead, setCheckedFilipinoRead] = useState(false);
  const [isCheckedFilipinoWrite, setCheckedFilipinoWrite] = useState(false);
  const [isCheckedFilipinoSpeak, setCheckedFilipinoSpeak] = useState(false);
  const [isCheckedFilipinoUnderstand, setCheckedFilipinoUnderstand] = useState(false);

  // State for additional languages
  const [addedLanguages, setAddedLanguages] = useState([]);
  const [languageNameValue, setLanguageNameValue] = useState('');
  const [isCheckedOthersReadValue, setCheckedOthersReadValue] = useState(false);
  const [isCheckedOthersWriteValue, setCheckedOthersWriteValue] = useState(false);
  const [isCheckedOthersSpeakValue, setCheckedOthersSpeakValue] = useState(false);
  const [isCheckedOthersUnderstandValue, setCheckedOthersUnderstandValue] = useState(false);

  // Check if a language name is already added
  const isLangNameAdded = (langName) => {
    return addedLanguages.some((lang) => lang.languageNameValue === langName);
  };

  // Add a new language proficiency
  const onAddLanguageProficiency = () => {
    if (
      addedLanguages.length <= 10 &&
      languageNameValue !== '' &&
      !isLangNameAdded(languageNameValue)
    ) {
      setAddedLanguages([
        ...addedLanguages,
        {
          languageNameValue,
          isCheckedOthersReadValue,
          isCheckedOthersWriteValue,
          isCheckedOthersSpeakValue,
          isCheckedOthersUnderstandValue,
        },
      ]);
      setLanguageNameValue('');
      setCheckedOthersReadValue(false);
      setCheckedOthersWriteValue(false);
      setCheckedOthersSpeakValue(false);
      setCheckedOthersUnderstandValue(false);
    }
  };

  // Remove a language proficiency
  const onRemoveLanguageProficiency = (languageName) => {
    const updatedLanguages = addedLanguages.filter(
      (lang) => lang.languageNameValue !== languageName
    );
    setAddedLanguages(updatedLanguages);
  };

  // Handle form submission
  const onSubmit = () => {
    const englishProficiency = {
      isCheckedEnglishRead,
      isCheckedEnglishWrite,
      isCheckedEnglishSpeak,
      isCheckedEnglishUnderstand,
    };

    const filipinoProficiency = {
      isCheckedFilipinoRead,
      isCheckedFilipinoWrite,
      isCheckedFilipinoSpeak,
      isCheckedFilipinoUnderstand,
    };

    console.log('English Proficiency:', englishProficiency);
    console.log('Filipino Proficiency:', filipinoProficiency);
    console.log('Added Languages:', addedLanguages);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Language Dialect Proficiency
      </Typography>

      {/* English Proficiency */}
      <Typography variant="h6" gutterBottom>
        English
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedEnglishRead}
                onChange={(e) => setCheckedEnglishRead(e.target.checked)}
              />
            }
            label="Read"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedEnglishWrite}
                onChange={(e) => setCheckedEnglishWrite(e.target.checked)}
              />
            }
            label="Write"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedEnglishSpeak}
                onChange={(e) => setCheckedEnglishSpeak(e.target.checked)}
              />
            }
            label="Speak"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedEnglishUnderstand}
                onChange={(e) => setCheckedEnglishUnderstand(e.target.checked)}
              />
            }
            label="Understand"
          />
        </Grid>
      </Grid>

      {/* Filipino Proficiency */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
        Filipino
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedFilipinoRead}
                onChange={(e) => setCheckedFilipinoRead(e.target.checked)}
              />
            }
            label="Read"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedFilipinoWrite}
                onChange={(e) => setCheckedFilipinoWrite(e.target.checked)}
              />
            }
            label="Write"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedFilipinoSpeak}
                onChange={(e) => setCheckedFilipinoSpeak(e.target.checked)}
              />
            }
            label="Speak"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedFilipinoUnderstand}
                onChange={(e) => setCheckedFilipinoUnderstand(e.target.checked)}
              />
            }
            label="Understand"
          />
        </Grid>
      </Grid>

      {/* Added Languages */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
        Added Languages
      </Typography>
      <Grid container spacing={2}>
        {addedLanguages.map((lang, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {lang.languageNameValue}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={lang.isCheckedOthersReadValue} disabled />}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={lang.isCheckedOthersWriteValue} disabled />}
                label="Write"
              />
              <FormControlLabel
                control={<Checkbox checked={lang.isCheckedOthersSpeakValue} disabled />}
                label="Speak"
              />
              <FormControlLabel
                control={<Checkbox checked={lang.isCheckedOthersUnderstandValue} disabled />}
                label="Understand"
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => onRemoveLanguageProficiency(lang.languageNameValue)}
                sx={{ marginTop: 1 }}
              >
                Remove
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Add New Language */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
        Add Other Languages
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedOthersReadValue}
                onChange={(e) => setCheckedOthersReadValue(e.target.checked)}
              />
            }
            label="Read"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedOthersWriteValue}
                onChange={(e) => setCheckedOthersWriteValue(e.target.checked)}
              />
            }
            label="Write"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedOthersSpeakValue}
                onChange={(e) => setCheckedOthersSpeakValue(e.target.checked)}
              />
            }
            label="Speak"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedOthersUnderstandValue}
                onChange={(e) => setCheckedOthersUnderstandValue(e.target.checked)}
              />
            }
            label="Understand"
          />
          {(isCheckedOthersReadValue ||
            isCheckedOthersWriteValue ||
            isCheckedOthersSpeakValue ||
            isCheckedOthersUnderstandValue) && (
              <Box sx={{ marginTop: 2 }}>
                <TextField
                  fullWidth
                  label="Language Name"
                  value={languageNameValue}
                  onChange={(e) => setLanguageNameValue(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={onAddLanguageProficiency}
                >
                  Add Language
                </Button>
              </Box>
            )}
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default LanguageDialectProficiency;