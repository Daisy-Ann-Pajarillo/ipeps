import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid2 as Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Autocomplete
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import employmentStatusTypes from '../../../../reusable/constants/employmentStatusTypes';
import civilStatusTypes2 from '../../../../reusable/constants/civilStatusTypes2';
import suffixTypes from '../../../../reusable/constants/suffixTypes';
import sexTypes2 from '../../../../reusable/constants/sexTypes2';
import userIndustryOptionTypes2 from '../../../../reusable/constants/userIndustryOptionTypes2';
import heightOptionTypes from '../../../../reusable/constants/heightOptionTypes';
import religionOptionTypes from '../../../../reusable/constants/religionOptionTypes';
import countriesList2 from '../../../../reusable/constants/countriesList2';
import yesAndNoOptionTypes2 from '../../../../reusable/constants/yesAndNoOptionTypes2';
import CompleteAddressInputs from '../../../../reusable/components/CompleteAddressInputs';

const schema = yup.object().shape({
  firstname: yup.string().required('First Name is required').default(''),
  middlename: yup.string().default(''),
  lastname: yup.string().required('Last Name is required').default(''),
  suffix: yup.string().default(''),
  sex: yup.string().required('Sex is required'),
  dateofbirth: yup.string().required('Date of birth is required').default(''),
  placeofbirth: yup.string().required('Place of birth is required').default(''),
  religion: yup.string().default(''),
  civilstatus: yup.string().required('Civil Status is required').default(''),
  height: yup.string().default(''),
  landlineno: yup.string().default(''),
  cellphoneno: yup.string().required('Cellphone number is required').default(''),
  tin: yup.string().default(''),
  sssandgsisno: yup.string().default(''),
  pagibigno: yup.string().default(''),
  philhealthno: yup.string().default(''),
  employmentstatus: yup.string().required('Employment status is required').default(''),
  isseekingwork: yup.string().required('Are you actively looking for work field is required').default('Yes'),
  seekingwhenwork: yup.string().default(''),
  sincewhenseekingwork: yup.string().default(''),
  iswillingtoworkimmediately: yup.string().default('Yes'),
  iscurrentofw: yup.string().required('Are you an OFW field is required').default(''),
  currentofwcountry: yup.string().default(''),
  isformerofw: yup.string().default('No'),
  lastcountrydeployment: yup.string().default(''),
  datereturntoph: yup.string().default(''),
  is4pbeneficiary: yup.string().default('No'),
  householdidno: yup.string().default(''),
});

const PersonalInfo = (props) => {
  const { control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // Present Address
  const [presentCountry, setPresentCountry] = useState('Philippines');
  const [presentRegion, setPresentRegion] = useState('');
  const [presentCityProvince, setPresentCityProvince] = useState('');
  const [presentMunicipality, setPresentMunicipality] = useState('');
  const [presentBarangay, setPresentBarangay] = useState('');
  const [presentZipCode, setPresentZipCode] = useState('');
  const [presentHouseStreet, setPresentHouseStreet] = useState('');

  // Permanent Address
  const [permanentCountry, setPermanentCountry] = useState('Philippines');
  const [permanentRegion, setPermanentRegion] = useState('');
  const [permanentCityProvince, setPermanentCityProvince] = useState('');
  const [permanentMunicipality, setPermanentMunicipality] = useState('');
  const [permanentBarangay, setPermanentBarangay] = useState('');
  const [permanentZipCode, setPermanentZipCode] = useState('');
  const [permanentHouseStreet, setPermanentHouseStreet] = useState('');

  // Disabilities
  const [isCheckedVisual, setIsCheckedVisual] = useState(false);
  const [isCheckedHearing, setIsCheckedHearing] = useState(false);
  const [isCheckedSpeech, setIsCheckedSpeech] = useState(false);
  const [isCheckedPhysical, setIsCheckedPhysical] = useState(false);
  const [userAddedDisabilities, setUserAddedDisabilities] = useState([]);

  // Employment Status / Type
  const [selectedSeekingWorkType, setSelectedSeekingWorkType] = useState('Yes');
  const [selectedFourPsBeneficiaryTypes, setSelectedFourPsBeneficiaryTypes] =
    useState('No');
  const [isCurrentOFW, setIsCurrentOFW] = useState('No');
  const [isFormerOFW, setIsFormerOFW] = useState('No');

  // File Uploading and Handling
  const [uploadedIDFileURL, setUploadedIDFileURL] = useState('#');
  const labelReqStyle = { color: 'red' }
/*
  useEffect(() => {
    if (props.pageData && Object.keys(props.pageData).length !== 0) {
      // console.log('props.pageData', props.pageData);

      // Basic Info
      control.setValue('firstname', props.pageData.first_name);
      control.setValue('middlename', props.pageData.middle_name);
      control.setValue('lastname', props.pageData.last_name);
      control.setValue('suffix', props.pageData.suffix);
      control.setValue('dateofbirth', props.pageData.date_of_birth);
      control.setValue('placeofbirth', props.pageData.place_of_birth);
      control.setValue('sex', props.pageData.sex);

      // Present Address
      setPresentCountry(props.pageData.present_country);
      setPresentRegion(props.pageData.present_region);
      setPresentCityProvince(props.pageData.present_city_province);
      setPresentMunicipality(props.pageData.present_municipality);
      setPresentBarangay(props.pageData.present_barangay);
      setPresentZipCode(props.pageData.present_zipcode);
      setPresentHouseStreet(props.pageData.present_house_street);

      // Permanent Address
      setPermanentCountry(props.pageData.permanent_country);
      setPermanentRegion(props.pageData.permanent_region);
      setPermanentCityProvince(props.pageData.permanent_city_province);
      setPermanentMunicipality(props.pageData.permanent_municipality);
      setPermanentBarangay(props.pageData.permanent_barangay);
      setPermanentZipCode(props.pageData.permanent_zipcode);
      setPermanentHouseStreet(props.pageData.permanent_house_street);

      // Other Personal Info
      control.setValue('religion', props.pageData.religion);
      control.setValue('height', props.pageData.height);
      control.setValue('civilstatus', props.pageData.civil_type);

      //
      control.setValue('landlineno', props.pageData.landline_no);
      control.setValue('cellphoneno', props.pageData.cellphone_no);

      //
      control.setValue('tin', props.pageData.tin);
      control.setValue('sssandgsisno', props.pageData.sss_and_gsis_no);
      control.setValue('pagibigno', props.pageData.pag_ibig_no);
      control.setValue('philhealthno', props.pageData.philhealth_no);

      // Disabilities
      setIsCheckedVisual(props.pageData.visual === 'true' ? true : false);
      setIsCheckedHearing(props.pageData.hearing === 'true' ? true : false);
      setIsCheckedSpeech(props.pageData.speech === 'true' ? true : false);
      setIsCheckedPhysical(props.pageData.physical === 'true' ? true : false);
      setUserAddedDisabilities(props.pageData.user_added_disabilities?.split(','));

      // // Employment Status / Type
      control.setValue('employmentstatus', props.pageData.employment_status);
      control.setValue('isseekingwork', props.pageData.is_seeking_work);
      setSelectedSeekingWorkType(props.pageData.is_seeking_work)
      control.setValue('seekingwhenwork', props.pageData.seeking_when_work);
      control.setValue('sincewhenseekingwork', props.pageData.since_when_seeking_work);
      control.setValue('iswillingtoworkimmediately', props.pageData.is_willin_to_work_immediately);

      //
      control.setValue('iscurrentofw', props.pageData.is_current_ofw);
      setIsCurrentOFW(props.pageData.is_current_ofw);
      control.setValue('currentofwcountry', props.pageData.current_ofw_country);
      control.setValue('isformerofw', props.pageData.is_former_ofw);
      setIsFormerOFW(props.pageData.is_former_ofw)
      control.setValue('lastcountrydeployment', props.pageData.last_country_deployment);
      control.setValue('datereturntoph', props.pageData.date_return_to_ph);

      //
      control.setValue('is4pbeneficiary', props.pageData.four_ps_beneficiary);
      setSelectedFourPsBeneficiaryTypes(props.pageData.four_ps_beneficiary)
      control.setValue('householdidno', props.pageData.household_id_no);

      // File Uploading and Handling
      setUploadedIDFileURL(props.pageData.valid_id_file_url);
    } else {
      //  Set default values 
      control.setValue('isseekingwork', 'Yes')
      control.setValue('iswillingtoworkimmediately', 'Yes')
      control.setValue('iscurrentofw', 'No');
      control.setValue('isformerofw', 'No');
      control.setValue('is4pbeneficiary', 'No');
    }

  }, [props.pageData]);
*/
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Personal Information</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                variant="outlined"
                fullWidth
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
                disabled
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="middlename"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Middle Name"
                variant="outlined"
                fullWidth
                error={!!errors.middlename}
                helperText={errors.middlename?.message}
                disabled
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="outlined"
                fullWidth
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
                disabled
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="suffix"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                freeSolo
                disabled
                clearOnBlur
                clearOnEscape
                options={suffixTypes}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  return option.label || '';
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a suffix or type your own"
                    fullWidth
                  />
                )}
              />
            )}
          />
          <Typography variant="body2" color="error">
            {errors.suffix?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <Autocomplete
              {...field}
              disabled
              options={sexTypes2}
              getOptionLabel={(option) => option.label || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Are you Male or Female"
                  fullWidth
                />
              )}
            />
            )}
          />
          <Typography variant="body2" color="error">
            {errors.sex?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="dateofbirth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.dateofbirth}
                helperText={errors.dateofbirth?.message}
                disabled
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="placeofbirth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Place of Birth"
                variant="outlined"
                fullWidth
                error={!!errors.placeofbirth}
                helperText={errors.placeofbirth?.message}
                disabled
              />
            )}
          />
        </Grid>
      </Grid>
      {/* Continue converting the rest of the form fields similarly */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(PersonalInfo);
