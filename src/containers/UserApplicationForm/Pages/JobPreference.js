import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import BackNextButton from "../backnextButton";
import countriesList from "../../../reusable/constants/countriesList";
import userIndustryOptionTypes from "../../../reusable/constants/userIndustryOptionTypes";
import completePHAddressOption from "../../../reusable/constants/completePHAddressOption";
import validateForm from "../schema/validateForm";
import { jobPreferenceSchema } from "../schema/schema";
import fetchData from "../api/fetchData";

const JobPreference = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [jobPreferred, setJobPreferred] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [addressData, setAddressData] = useState({
    provinces: [],
    municipalities: [],
  });

  // Fetch user data first
  useEffect(() => {
    const fetchJobPreferred = async () => {
      try {
        const response = await fetchData("api/get-user-info");
        setJobPreferred(response.job_preference[0]);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobPreferred();
  }, []);

  // Create form with a separate reset action after data loads
  const formMethods = useForm({
    resolver: yupResolver(jobPreferenceSchema),
    mode: "onChange",
    defaultValues: {}, // Start with empty defaults
  });

  // Use reset when userInfo is available
  useEffect(() => {
    if (jobPreferred && !loading) {
      formMethods.reset(jobPreferred); // This sets all values at once
      console.log("Form reset with user data:", jobPreferred);
    }
  }, [jobPreferred, loading, formMethods]);

  // Destructure after form is created
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = formMethods;
  const formData = watch();

  // Helper functions to fetch provinces, municipalities, and barangays
  const getProvinces = () => {
    return Object.keys(completePHAddressOption)
      .map((regionId) =>
        Object.keys(completePHAddressOption[regionId].province_list)
      )
      .flat();
  };

  const getMunicipalities = (selectedProvince) => {
    if (!selectedProvince) {
      console.log("No selected province");
      return [];
    }

    // Find the province from the completePHAddressOption
    const municipalities = Object.values(completePHAddressOption).flatMap(
      (region) => {
        const provinceData = region.province_list?.[selectedProvince];
        if (!provinceData) {
          console.log(`No province data found for ${selectedProvince}`);
          return [];
        }
        return provinceData.municipality_list.map((municipalityObj) => {
          const municipalityName = Object.keys(municipalityObj)[0]; // Get municipality name
          return { municipality: municipalityName };
        });
      }
    );
    return municipalities;
  };

  // useEffect to update the addressData state based on selected province/municipality
  useEffect(() => {
    if (!selectedProvince) {
      setAddressData({
        provinces: getProvinces(),
        municipalities: [],
      });
      setSelectedMunicipality(null); // Reset municipality when province changes
      return;
    }

    const municipalityData = getMunicipalities(selectedProvince);
    const municipalities = municipalityData.map((item) => item.municipality);
    setAddressData({
      provinces: getProvinces(),
      municipalities,
    });
  }, [selectedProvince]);

  // Update selected fields whenever formData changes
  useEffect(() => {
    setIsValid(!Object.keys(errors).length);
    if (formData && Object.keys(formData).length > 0) {
      const { country, municipality, province, industry } = formData;
      setSelectedCountry(country);
      setSelectedProvince(province);
      setSelectedMunicipality(municipality);
      setSelectedIndustry(industry);
    }
  }, [errors]);
  
  if (loading) {
    return <p>Loading...</p>; // Prevent rendering until data is ready
  }

  return (
    <Box
      sx={{ p: 3 }}
      onClick={() => {
        validateForm(jobPreferenceSchema, formData, setIsValid, setFormErrors);
      }}
    >
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
              setSelectedCountry(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...register("country")}
                {...params}
                required
                label="Country"
                error={formErrors.country}
                helperText={formErrors.country}
              />
            )}
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
            renderInput={(params) => (
              <TextField
                required={selectedCountry === "Philippines"}
                {...register("province")}
                {...params}
                label="Province"
              />
            )}
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
            renderInput={(params) => (
              <TextField
                {...register("municipality")}
                required={selectedProvince}
                {...params}
                label="Municipality"
                error={formErrors.country}
                helperText={formErrors.country}
              />
            )}
            disabled={!selectedProvince} // Disable if no province is selected
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Industry</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            required
            options={userIndustryOptionTypes}
            getOptionLabel={(option) => option}
            filterOptions={(options, { inputValue }) =>
              options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            value={selectedIndustry}
            onChange={(event, newValue) => setSelectedIndustry(newValue)}
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
          <Typography variant="h6">Expected Salary (PHP)</Typography>
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
        schema={jobPreferenceSchema}
        formData={formData}
        user_type={user_type}
        api="job-preference"
      />
    </Box>
  );
};

export default JobPreference;
