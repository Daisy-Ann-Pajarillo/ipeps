import React, { useState, useEffect } from 'react';

import { Autocomplete, TextField, MenuItem, Grid2 as Grid, InputLabel, Select } from '@mui/material';

import countriesList from '../constants/countriesList';
import completePHAddressOptionTypes from '../constants/completePHAddressOptionTypes';

const CompleteAddressInputs = (props) => {
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [muncipalityList, setMunicipalityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  useEffect(() => {
    loadPHRegions();
  }, []);

  useEffect(() => {
    for (const regionkey in completePHAddressOptionTypes) {
      if (
        completePHAddressOptionTypes[regionkey].region_name === props.region
      ) {
        loadCityProvince(regionkey);
      }
    }
  }, [props.region, props.cityProvince, props.municipality]);

  const loadPHRegions = () => {
    let regions = [];
    for (const key in completePHAddressOptionTypes) {
      regions.push({
        label: completePHAddressOptionTypes[key].region_name,
        value: completePHAddressOptionTypes[key].region_name,
      });
    }
    setRegionList(regions);
  };

  const loadCityProvince = (regionKey) => {
    let provinces = [];
    for (const provinceKey in completePHAddressOptionTypes[regionKey]
      .province_list) {
      provinces.push({ label: provinceKey, value: provinceKey });

      if (provinceKey === props.cityProvince) {
        loadMunicipality(regionKey, provinceKey);
      }
    }
    setProvinceList(provinces);
  };

  const loadMunicipality = (regionKey, provinceKey) => {
    const municipality =
      completePHAddressOptionTypes[regionKey].province_list[provinceKey][
      'municipality_list'
      ];
    let muncipalityArr = [];
    for (const key in municipality) {
      for (const i in municipality[key]) {
        muncipalityArr.push({
          label: i,
          value: i,
        });

        if (i === props.municipality) {
          // Loading Barangays
          let barangayArr = [];
          for (const barr in municipality[key][i].barangay_list) {
            barangayArr.push({
              label: municipality[key][i].barangay_list[barr],
              value: municipality[key][i].barangay_list[barr],
            });
          }
          setBarangayList(barangayArr);
        }
      }
    }
    setMunicipalityList(muncipalityArr);
  };

  const onRegionChange = (newValue) => {
    if (newValue?.value) {
      props.setRegion(newValue.value);
    } else {
      props.setRegion('');
    }
  };

  const onCityProvinceChange = (newValue) => {
    if (newValue?.value) {
      props.setCityProvince(newValue.value);
    } else {
      props.setCityProvince('');
    }
  };

  const onMunicipalityChange = (newValue) => {
    if (newValue?.value) {
      props.setMunicipality(newValue.value);
    } else {
      props.setMunicipality('');
    }
  };

  const onBarangayChange = (newValue) => {
    if (newValue?.value) {
      props.setBarangay(newValue.value);
    } else {
      props.setBarangay('');
    }
  };

  return (
    <>
      {/* Row 1 */}
      <Grid container spacing={2}>
        {/* Country */}
        <Grid item xs={12} md={6}>
          <InputLabel>Country</InputLabel>
          <Select
            fullWidth
            value={props.country}
            onChange={(e) => props.setCountry(e.target.value)}
            disabled={props.inputsDisabled}
          >
            {countriesList.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {/* Region */}
        <Grid item xs={12} md={6}>
          <InputLabel>Region</InputLabel>
          <Autocomplete
            freeSolo
            onChange={onRegionChange}
            options={regionList}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a region or type your own"
                variant="outlined"
                disabled={props.inputsDisabled}
              />
            )}
          />
        </Grid>
      </Grid>
      {/* Row 2 */}
      <Grid container spacing={2}>
        {/* City / Province */}
        <Grid item xs={12} md={6}>
          <InputLabel>City / Province</InputLabel>
          <Autocomplete
            freeSolo
            onChange={onCityProvinceChange}
            options={provinceList}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a city/province or type your own"
                variant="outlined"
                disabled={props.inputsDisabled}
              />
            )}
          />
        </Grid>
        {/* Municipality */}
        <Grid item xs={12} md={6}>
          <InputLabel>Municipality</InputLabel>
          <Autocomplete
            freeSolo
            onChange={onMunicipalityChange}
            options={muncipalityList}
            value={{
              label: props.municipality,
              value: props.municipality,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a municipality or type your own"
                variant="outlined"
                disabled={props.inputsDisabled}
              />
            )}
          />
        </Grid>
      </Grid>
      {/* Row 3 */}
      <Grid container spacing={2}>
        {/* Barangay */}
        <Grid item xs={12} md={6}>
          <InputLabel>Barangay</InputLabel>
          <Autocomplete
            freeSolo
            onChange={onBarangayChange}
            options={barangayList}
            value={{
              label: props.barangay,
              value: props.barangay,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a barangay or type your own"
                variant="outlined"
                disabled={props.inputsDisabled}
              />
            )}
          />
        </Grid>
        {/* Zip Code */}
        <Grid item xs={12} md={6}>
          <InputLabel>ZIP Code / Postal Code</InputLabel>
          <TextField
            fullWidth
            type='text'
            placeholder='5000, 5029, 5034'
            onChange={(e) => {
              props.setZipCode(e.target.value);
            }}
            value={props.zipCode}
            disabled={props.inputsDisabled}
          />
        </Grid>
      </Grid>
      {/* Row 4 */}
      <Grid container spacing={2}>
        {/* Street */}
        <Grid item xs={12}>
          <InputLabel>House No. / Street Village</InputLabel>
          <TextField
            fullWidth
            type='text'
            placeholder=''
            onChange={(e) => {
              props.setHouseStreet(e.target.value);
            }}
            value={props.houseStreet}
            disabled={props.inputsDisabled}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CompleteAddressInputs;
