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


const schema = yup.object().shape({
  industry: yup.string().required("Industry is required"),
  preferredOccupation: yup.string().required("Preferred Occupation is required"),
  expectedSalaryRangeFrom: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Salary must be greater than zero")
    .required("Expected salary (from) is required"),
  expectedSalaryRangeTo: yup
    .number()
    .typeError("Must be a number")
    .min(yup.ref("expectedSalaryRangeFrom"), "Must be greater than 'From' salary")
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
      country: null,
      city: null,
      industry: null,
      preferredOccupation: "",
      expectedSalaryRangeFrom: "",
      expectedSalaryRangeTo: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    setIsValid(formIsValid);
  }, [formIsValid, setIsValid]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const selectedProvinceData = selectedProvince
    ? provincesCitiesWithMunicipalities.find((item) => item.province === selectedProvince.province)
    : null;

  return (
    <Box sx={{ p: 3 }}>
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
              {...params} required label="Country" />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={provincesCitiesWithMunicipalities}
            getOptionLabel={(option) => option.province}
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

          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={selectedProvinceData ? selectedProvinceData.municipalities : []}
            getOptionLabel={(option) => option}
            value={selectedMunicipality}
            onChange={(event, newValue) => setSelectedMunicipality(newValue)}
            renderInput={(params) => <TextField
              {...register('municipality')}
              required={selectedProvince}
              {...params} label="Municipality" />}
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
                error={Boolean(errors?.industry)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Preferred Occupation"
            {...register("preferredOccupation")}
            error={Boolean(errors?.preferredOccupation)}
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
            {...register("expectedSalaryRangeFrom")}
            error={Boolean(errors?.expectedSalaryRangeFrom)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="To"
            type="number"
            {...register("expectedSalaryRangeTo")}
            error={Boolean(errors?.expectedSalaryRangeTo)}
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