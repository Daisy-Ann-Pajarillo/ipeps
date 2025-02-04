import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Typography,
  Divider,
  Paper,
  Autocomplete
} from '@mui/material';

const schoolOptionTypes = [
  { value: 'School A', label: 'School A' },
  { value: 'School B', label: 'School B' },
  { value: 'School C', label: 'School C' },
  // Add more schools as needed
];

const degreeOrQualificationTypes2 = [
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'PhD', label: 'PhD' },
  // Add more degrees or qualifications as needed
];

const educationalLevelTypes2 = [
  { value: 'Undergraduate', label: 'Undergraduate' },
  { value: 'Graduate', label: 'Graduate' },
  { value: 'Postgraduate', label: 'Postgraduate' },
  // Add more educational levels as needed
];

const fieldOfStudyTypes = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  // Add more fields of study as needed
];

const EducationalBackground = (props) => {
  const [educationHistory, setEducationHistory] = useState([]);

  // Educational History Adding Fields
  const [schoolNameAddingValue, setSchoolNameAddingValue] = useState('');
  const [degreeQualificationSelectedValue, setDegreeQualificationSelectedValue] = useState('');
  const [dateFromAddingValue, setDateFromAddingValue] = useState('');
  const [dateToAddingValue, setDateToAddingValue] = useState('');
  const [isCurrentAddingValue, setIsCurrentAddingValue] = useState(false);
  const [educationalLevelSelectedValue, setEducationalLevelSelectedValue] = useState('');
  const [fieldOfStudyAddingValue, setFieldOfStudyAddingValue] = useState('');
  const [majorAddingValue, setMajorAddingValue] = useState('');
  const [programDurationAddingValue, setProgramDurationAddingValue] = useState('');

  const onAddEducationHistory = () => {
    if (educationHistory.length <= 20) {
      const educationData = {
        id: uuidv4(),
        schoolName: schoolNameAddingValue,
        degreeQualification: degreeQualificationSelectedValue,
        dateFrom: dateFromAddingValue,
        dateTo: dateToAddingValue,
        isCurrent: isCurrentAddingValue,
        educationalLevel: educationalLevelSelectedValue,
        fieldOfStudy: fieldOfStudyAddingValue,
        major: majorAddingValue,
        programDuration: programDurationAddingValue,
      };
      setEducationHistory([...educationHistory, educationData]);

      // Reset fields
      setSchoolNameAddingValue('');
      setDegreeQualificationSelectedValue('');
      setDateFromAddingValue('');
      setDateToAddingValue('');
      setIsCurrentAddingValue(false);
      setEducationalLevelSelectedValue('');
      setFieldOfStudyAddingValue('');
      setMajorAddingValue('');
      setProgramDurationAddingValue('');
    }
  };

  const onRemoveEducationHistory = (id) => {
    if (id !== '') {
      const index = educationHistory.findIndex((p) => p.id === id);
      if (index > -1) {
        let newEducationHistory = educationHistory;
        newEducationHistory.splice(index, 1);
        setEducationHistory([...newEducationHistory]);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Educational Background
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      {/* Display existing education history */}
      {educationHistory.map((educationEntry, index) => (
        <div key={index}>
          {/* Row 1 */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School"
                value={educationEntry.schoolName}
                disabled
              />
            </Grid>
          </Grid>
          {/* Row 2 */}
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Date From"
                type="date"
                value={educationEntry.dateFrom}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Date To"
                type="date"
                value={educationEntry.dateTo}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={educationEntry.isCurrent}
                    disabled
                  />
                }
                label="Currently Attending"
              />
            </Grid>
          </Grid>
          {/* Row 3 */}
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Degree or Qualification"
                value={educationEntry.degreeQualification}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Educational Level"
                value={educationEntry.educationalLevel}
                disabled
              />
            </Grid>
          </Grid>
          {/* Row 4 */}
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Field of Study"
                value={educationEntry.fieldOfStudy}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Major (optional)"
                value={educationEntry.major}
                disabled
              />
            </Grid>
          </Grid>
          {/* Row 5 */}
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Program Duration in Years"
                type="number"
                value={educationEntry.programDuration}
                disabled
              />
            </Grid>
          </Grid>
          {/* Remove */}
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="error"
                onClick={() => onRemoveEducationHistory(educationEntry.id)}
                sx={{ float: 'right' }}
              >
                Remove Entry
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
        </div>
      ))}

      {/* Adding Educational Entry */}
      <Typography variant="h5" gutterBottom>
        Add Entry
      </Typography>
      {/* Row 1 */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={schoolOptionTypes.map(option => option.label)}
            value={schoolNameAddingValue}
            onChange={(event, newValue) => {
              setSchoolNameAddingValue(newValue || '');
            }}
            onInputChange={(event, newInputValue) => {
              setSchoolNameAddingValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a school or type your own"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            clearOnEscape
          />
        </Grid>
      </Grid>
      {/* Row 2 */}
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Date From"
            type="date"
            value={dateFromAddingValue}
            onChange={(e) => setDateFromAddingValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Date To"
            type="date"
            value={dateToAddingValue}
            onChange={(e) => setDateToAddingValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCurrentAddingValue}
                onChange={(e) => setIsCurrentAddingValue(e.target.checked)}
              />
            }
            label="Currently Attending"
          />
        </Grid>
      </Grid>
      {/* Row 3 */}
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={degreeOrQualificationTypes2}
            getOptionLabel={(option) => option.label}
            value={degreeOrQualificationTypes2.find(option => option.value === degreeQualificationSelectedValue) || null}
            onChange={(event, newValue) => {
              setDegreeQualificationSelectedValue(newValue ? newValue.value : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select degree or qualification"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={educationalLevelTypes2}
            getOptionLabel={(option) => option.label}
            value={educationalLevelTypes2.find(option => option.value === educationalLevelSelectedValue) || null}
            onChange={(event, newValue) => {
              setEducationalLevelSelectedValue(newValue ? newValue.value : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select educational level"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value}
            clearOnEscape
          />
        </Grid>
      </Grid>
      {/* Row 4 */}
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            freeSolo
            options={fieldOfStudyTypes.map(option => option.label)}
            value={fieldOfStudyAddingValue}
            onChange={(event, newValue) => {
              setFieldOfStudyAddingValue(newValue || '');
            }}
            onInputChange={(event, newInputValue) => {
              setFieldOfStudyAddingValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a field of study or type your own"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            clearOnEscape
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Major (optional)"
            placeholder="Software Development, Project Management"
            value={majorAddingValue}
            onChange={(e) => setMajorAddingValue(e.target.value)}
          />
        </Grid>
      </Grid>
      {/* Row 5 */}
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Program Duration in Years"
            type="number"
            placeholder="4, 5 years etc..."
            value={programDurationAddingValue}
            onChange={(e) => setProgramDurationAddingValue(e.target.value)}
          />
        </Grid>
      </Grid>
      {/* Add Educational Entry Button */}
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={onAddEducationHistory}
            sx={{ float: 'right' }}
          >
            Add Entry
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EducationalBackground;