import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  Box
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BackNextButton from "../backnextButton";
import countriesList from "../../../reusable/constants/countriesList";
import userIndustryOptionTypes from "../../../reusable/constants/userIndustryOptionTypes";
import provincesCitiesWithMunicipalities from "../../../reusable/constants/provincesCitiesWithMunicipalities"
import completePHAddressOption from "../../../reusable/constants/completePHAddressOption";

const schema = yup.object().shape({
  industry: yup.string().required("Industry is required"),
  preferred_occupation: yup.string().required("Preferred Occupation is required"),
  salary_from: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Salary must be greater than zero")
    .required("Expected salary (from) is required"),
  salary_to: yup
    .number()
    .typeError("Must be a number")
    .min(yup.ref("salary_from"), "Must be greater than 'From' salary")
    .required("Expected salary (to) is required"),
  country: yup.string().required('Province is required'),
  province: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  municipality: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Municipality is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});


const JobPreference = ({ activeStep, steps, handleBack, handleNext, isValid, setIsValid, user_type }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      "country": "Philippines",
      "industry": "[A] Agriculture, forestry and fishing",
      "municipality": "Buenavista",
      "preferred_occupation": "Software Engineer",
      "province": "Agusan del Norte",
      "salary_from": 30000.0,
      "salary_to": 50000.0
    }
  });

  const formData = watch();

  const [formErrors, setFormErrors] = useState({});

  const validateForm = async () => {
    try {
      // Validate the formData based on schema
      await schema.validate(formData, { abortEarly: false });
      setIsValid(true); // If validation passes, set isValid to true
      setFormErrors({}); // Clear previous errors
    } catch (error) {
      setIsValid(false); // If validation fails, set isValid to false
      const errorMessages = error.inner.reduce((acc, currError) => {
        acc[currError.path] = currError.message;
        return acc;
      }, {});
      setFormErrors(errorMessages); // Store errors in formErrors state
    }
  };


  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const [addressData, setAddressData] = useState({
    provinces: [],
    municipalities: [],
  });
  // Helper functions to fetch provinces, municipalities, and barangays
  const getProvinces = () => {
    return Object.keys(completePHAddressOption).map(regionId =>
      Object.keys(completePHAddressOption[regionId].province_list)
    ).flat();
  };

  const getMunicipalities = (selectedProvince) => {
    if (!selectedProvince) {
      console.log('No selected province');
      return [];
    }

    // Find the province from the completePHAddressOption
    const municipalities = Object.values(completePHAddressOption)
      .flatMap(region => {
        const provinceData = region.province_list?.[selectedProvince];
        if (!provinceData) {
          console.log(`No province data found for ${selectedProvince}`);
          return [];
        }

        return provinceData.municipality_list.map(municipalityObj => {
          const municipalityName = Object.keys(municipalityObj)[0]; // Get municipality name
          return { municipality: municipalityName };
        });
      });

    return municipalities;
  };


  // useEffect to update the addressData state based on selected province/municipality
  useEffect(() => {
    if (!selectedProvince || !selectedMunicipality) return;

    const provinceData = getProvinces();
    const provinces = provinceData;

    const municipalityData = getMunicipalities(selectedProvince);
    const municipalities = municipalityData.map(item => item.municipality);

    setAddressData({
      provinces,
      municipalities,

    });
  }, [
    selectedProvince,
    selectedMunicipality,
  ]);

  // // Log addressData and selection values after update
  // useEffect(() => {
  //   console.log('Updated addressData:', addressData);
  //   console.log('Selected Province:', selectedProvince);
  //   console.log('Selected Municipality:', selectedMunicipality);
  // }, [addressData, selectedProvince, selectedMunicipality]);


  useEffect(() => {
    setIsValid(formIsValid);
    const { country, municipality, province } = formData
    setSelectedCountry(country);
    setSelectedProvince(province);
    setSelectedMunicipality(municipality)
  }, [formIsValid, setIsValid]);

  useEffect(() => {
    validateForm()
  }, [])

  return (
    <Box sx={{ p: 3 }} onClick={() => { validateForm() }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Preferred Work Location
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={countriesList}
            getOptionLabel={(option) => option}
            value={selectedCountry}
            onChange={(event, newValue) => {
              setSelectedCountry(newValue)
            }}
            renderInput={(params) => <TextField
              {...register('country')}
              {...params} required label="Country"
              error={formErrors.country}
              helperText={formErrors.country}
            />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={addressData.provinces}
            getOptionLabel={(option) => option}
            value={selectedProvince}
            onChange={(event, newValue) => {
              setSelectedProvince(newValue);
              setSelectedMunicipality(null);
            }}
            renderInput={(params) => <TextField
              required={selectedCountry === "Philippines"}
              {...register('province')}
              {...params} label="Province" />}
            disabled={selectedCountry !== "Philippines"}
            error={formErrors.province}
            helperText={formErrors.province}

          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={addressData.municipalities}
            getOptionLabel={(option) => option}
            value={selectedMunicipality}
            onChange={(event, newValue) => setSelectedMunicipality(newValue)}
            renderInput={(params) => <TextField
              {...register('municipality')}
              required={selectedProvince}
              {...params} label="Municipality"
              error={formErrors.country}
              helperText={formErrors.country}
            />}
            disabled={!selectedProvince} // Disable if no province is selected
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" >
            Industry
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            required
            options={userIndustryOptionTypes}
            getOptionLabel={(option) => option}
            filterOptions={(options, { inputValue }) =>
              options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
            }
            value={formData.industry}
            onChange={(event, newValue) => setValue("industry", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Industry"
                variant="outlined"
                fullWidth
                error={formErrors.industry}
                helperText={formErrors.industry}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Preferred Occupation"
            {...register("preferred_occupation")}
            error={formErrors.preferred_occupation}
            helperText={formErrors.preferred_occupation}
          />
          <Divider sx={{ marginBottom: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" >
            Expected Salary (PHP)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="From"
            type="number"
            {...register("salary_from")}
            error={formErrors.salary_from}
            helperText={formErrors.salary_from}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="To"
            type="number"
            {...register("salary_to")}
            error={formErrors.salary_to}
            helperText={formErrors.salary_to}
          />
        </Grid>
      </Grid>

      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        schema={schema}
        formData={formData}
        user_type={user_type}
        api="job-preference"
      />
    </Box>
  );
};

export default JobPreference;