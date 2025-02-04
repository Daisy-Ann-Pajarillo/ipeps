import React, { useState } from 'react';
import {
  Button,
  TextField,
  FormControl,
  Checkbox,
  Grid2 as Grid,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
//import { useNavigate, Link } from 'react-router-dom';

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    suffix: '',
    sex: '',
    dateofbirth: '',
    placeofbirth: '',
    religion: '',
    civilstatus: '',
    height: '',
    landlineno: '',
    cellphoneno: '',
    tin: '',
    sssandgsisno: '',
    pagibigno: '',
    philhealthno: '',
    employmentstatus: '',
    isseekingwork: 'Yes',
    seekingwhenwork: '',
    sincewhenseekingwork: '',
    iswillingtoworkimmediately: 'Yes',
    iscurrentofw: 'No',
    currentofwcountry: '',
    isformerofw: 'No',
    lastcountrydeployment: '',
    datereturntoph: '',
    is4pbeneficiary: 'No',
    householdidno: '',
  });

  const [isSameAsPresentAddress, setIsSameAsPresentAddress] = useState(false);
  const [isCheckedVisual, setIsCheckedVisual] = useState(false);
  const [isCheckedHearing, setIsCheckedHearing] = useState(false);
  const [isCheckedSpeech, setIsCheckedSpeech] = useState(false);
  const [isCheckedPhysical, setIsCheckedPhysical] = useState(false);
  const [userAddedDisabilities, setUserAddedDisabilities] = useState([]);
  const [otherDisabilitiesValue, setOtherDisabilitiesValue] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  const onAddDisabilities = () => {
    if (otherDisabilitiesValue.trim()) {
      setUserAddedDisabilities([...userAddedDisabilities, otherDisabilitiesValue]);
      setOtherDisabilitiesValue('');
    }
  };

  const onRemoveOtherDisability = (disabilityName) => {
    setUserAddedDisabilities(userAddedDisabilities.filter((disability) => disability !== disabilityName));
  };

  return (
    <div>
      <h2>Please fill in the application form.</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <Grid className='flex flex-col gap-3'>
          <Grid >
            <TextField
            fullWidth
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required

            />
          </Grid>
          <Grid >
            <TextField
            fullWidth
              label="Middle Name"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Suffix"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
            />
          </Grid>
          <Grid className='min-w-1/2'>
            <FormControl >
              <InputLabel className='bg-white px-2'>Sex</InputLabel>
              <Select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                className='min-w-[100px]'
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateofbirth"
              type="date"
              value={formData.dateofbirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Place of Birth"
              name="placeofbirth"
              value={formData.placeofbirth}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel className='bg-white px-2'>Civil Status</InputLabel>
              <Select
                name="civilstatus"
                value={formData.civilstatus}
                onChange={handleChange}
                required
                className='min-w-[200px]'
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Height"
              name="height"
              value={formData.height}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Landline Number"
              name="landlineno"
              value={formData.landlineno}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cellphone Number"
              name="cellphoneno"
              value={formData.cellphoneno}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="TIN"
              name="tin"
              value={formData.tin}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SSS/GSIS Number"
              name="sssandgsisno"
              value={formData.sssandgsisno}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pag-ibig Number"
              name="pagibigno"
              value={formData.pagibigno}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Philhealth Number"
              name="philhealthno"
              value={formData.philhealthno}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <div>
          <div>
            <h3>Disability</h3>
            <FormGroup className='flex flex-row'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedVisual}
                    onChange={(e) => setIsCheckedVisual(e.target.checked)}
                  />
                }
                label="Visual"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedHearing}
                    onChange={(e) => setIsCheckedHearing(e.target.checked)}
                  />
                }
                label="Hearing"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedSpeech}
                    onChange={(e) => setIsCheckedSpeech(e.target.checked)}
                  />
                }
                label="Speech"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedPhysical}
                    onChange={(e) => setIsCheckedPhysical(e.target.checked)}
                  />
                }
                label="Physical"
              />
              {userAddedDisabilities.map((disability, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked
                      onChange={() => onRemoveOtherDisability(disability)}
                    />
                  }
                  label={disability}
                />
              ))}
            </FormGroup>
          </div>
          <div className='flex items-center'>
            <TextField
              label="Other Disabilities"
              value={otherDisabilitiesValue}
              onChange={(e) => setOtherDisabilitiesValue(e.target.value)}
            />
            <Button onClick={onAddDisabilities}>Add Disability</Button>
          </div>
        </div>


        <Grid className='flex flex-col'>
          <h3>Employment Status/Type</h3>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="employmentstatus"
                value={formData.employmentstatus}
                onChange={handleChange}
                required
                className='min-w-[200px] max-w-[200px]'
              >
                <MenuItem value="Employed">Employed</MenuItem>
                <MenuItem value="Unemployed">Unemployed</MenuItem>
                <MenuItem value="Self-Employed">Self-Employed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" className='max-w-[200px]'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PersonalInfo;