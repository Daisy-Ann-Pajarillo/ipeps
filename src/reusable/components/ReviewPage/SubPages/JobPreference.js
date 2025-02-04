import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid2 as Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import countriesList from '../../../constants/countriesList';
import userIndustryOptionTypes2 from '../../../constants/userIndustryOptionTypes2';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  industry: yup.string().required('Industry is required').default(''),
});

const JobPreference = (props) => {
  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [expectedSalaryRangeFrom, setExpectedSalaryRangeFrom] = useState(0);
  const [expectedSalaryRangeTo, setExpectedSalaryRangeTo] = useState(0);
  const [preferredOccupations, setPreferredOccupations] = useState([]);
  const [preferredWorkLocations, setPreferredWorkLocations] = useState([]);

  // useEffect(() => {
  //   if (props.pageData && Object.keys(props.pageData).length !== 0) {
  //     setPreferredOccupations(JSON.parse(props.pageData.preferred_occupations));
  //     setPreferredWorkLocations(JSON.parse(props.pageData.preferred_work_locations));
  //     control.setValue('industry', props.pageData.industry);
  //     setExpectedSalaryRangeFrom(props.pageData.expected_salary_range_from);
  //     setExpectedSalaryRangeTo(props.pageData.expected_salary_range_to);
  //   }
  // }, [props.pageData]);

  return (
    <div>
      <form>
        <Typography variant="h4">Preferred Occupation</Typography>
        {preferredOccupations.length === 0 ? <Typography>No entries</Typography> : null}
        <Grid container spacing={2}>
          {preferredOccupations.map((occupation, index) => (
            occupation && (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={occupation}
                  disabled
                />
              </Grid>
            )
          ))}
        </Grid>
        <Typography variant="h4" className="mt-4">Preferred Work Location</Typography>
        {preferredWorkLocations.length === 0 ? <Typography>No entries</Typography> : null}
        {preferredWorkLocations.map((location, index1) => (
          <Grid container spacing={2} key={index1}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Country</InputLabel>
                <Select
                  value={location.country}
                  disabled
                  label="Country"
                >
                  {countriesList.map((item, index2) => (
                    <MenuItem value={item.name} key={index2}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Local, specific cities/municipalities"
                value={location.citiesOrMunicipalities}
                disabled
              />
            </Grid>
          </Grid>
        ))}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!errors.industry}>
              <InputLabel>Industry</InputLabel>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={userIndustryOptionTypes2}
                    isClearable
                    placeholder="Select an Industry"
                    isDisabled
                  />
                )}
              />
              <FormHelperText>{errors.industry?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="h4" className="mt-4">Expected Salary in PHP</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="From"
              type="number"
              value={expectedSalaryRangeFrom}
              onChange={(e) => setExpectedSalaryRangeFrom(e.target.value)}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="To"
              type="number"
              value={expectedSalaryRangeTo}
              onChange={(e) => setExpectedSalaryRangeTo(e.target.value)}
              disabled
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(JobPreference);
