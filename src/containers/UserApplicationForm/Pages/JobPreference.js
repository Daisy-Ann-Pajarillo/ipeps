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
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../store/actions/index";
import axios from "../../../axios";

import BackNextButton from "../backnextButton";
import countriesList from "../../../reusable/constants/countriesList";
import userIndustryOptionTypes from "../../../reusable/constants/userIndustryOptionTypes";
import { jobPreferenceSchema } from "../components/schema";
import {
  getMunicipalities,
  getProvinces,
} from "../components/getSpecificAddress";

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

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [addressData, setAddressData] = useState({
    provinces: getProvinces(),
    municipalities: [],
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const formMethods = useForm({
    resolver: yupResolver(jobPreferenceSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = formMethods;

  const formData = watch();

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchJobPreferred = async () => {
      try {
        const response = await axios.get("api/get-user-info", {
          auth: { username: auth.token },
        });
        const jobPref = response.data?.job_preference?.[0] || {};
        setJobPreferred(jobPref);
        reset(jobPref);
      } catch (error) {
        console.error("Error fetching job preference:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPreferred();
  }, [auth.token, reset]);

  useEffect(() => {
    if (formData) {
      setIsValid(!Object.keys(errors).length);

      setSelectedCountry(formData.country || null);
      setSelectedProvince(formData.province || null);
      setSelectedMunicipality(formData.municipality || null);
      setSelectedIndustry(formData.industry || null);
    }
  }, [formData, errors, setIsValid]);

  useEffect(() => {
    if (selectedProvince) {
      const municipalities = getMunicipalities(selectedProvince).map(
        (item) => item.municipality
      );
      setAddressData((prev) => ({
        ...prev,
        municipalities,
      }));
    } else {
      setAddressData((prev) => ({
        ...prev,
        municipalities: [],
      }));
      setSelectedMunicipality(null);
    }
  }, [selectedProvince]);

  if (loading) return <p>Loading...</p>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Preferred Work Location
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={countriesList}
            getOptionLabel={(option) => option}
            value={selectedCountry}
            onChange={(e, newValue) => {
              setSelectedCountry(newValue);
              setSelectedProvince(null);
              setSelectedMunicipality(null);
              setValue("country", newValue);
              setValue("province", " ");
              setValue("municipality", " ");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                required
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={addressData.provinces}
            getOptionLabel={(option) => option}
            value={selectedProvince}
            onChange={(e, newValue) => {
              setSelectedProvince(newValue);
              setSelectedMunicipality(null);
              setValue("province", newValue);
              setValue("municipality", " ");
            }}
            disabled={selectedCountry !== "Philippines"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Province"
                required={selectedCountry === "Philippines"}
                error={!!errors.province}
                helperText={errors.province?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={addressData.municipalities}
            getOptionLabel={(option) => option}
            value={selectedMunicipality}
            onChange={(e, newValue) => {
              setSelectedMunicipality(newValue);
              setValue("municipality", newValue);
            }}
            disabled={!selectedProvince}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Municipality"
                required={selectedCountry === "Philippines"}
                error={!!errors.municipality}
                helperText={errors.municipality?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Industry</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={userIndustryOptionTypes}
            getOptionLabel={(option) => option}
            value={selectedIndustry}
            onChange={(e, newValue) => {
              setSelectedIndustry(newValue);
              setValue("industry", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Industry"
                required
                error={!!errors.industry}
                helperText={errors.industry?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Preferred Occupation"
            {...register("preferred_occupation")}
            error={!!errors.preferred_occupation}
            helperText={errors.preferred_occupation?.message}
          />
          <Divider sx={{ my: 2 }} />
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
            error={!!errors.salary_from}
            helperText={errors.salary_from?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="To"
            type="number"
            {...register("salary_to")}
            error={!!errors.salary_to}
            helperText={errors.salary_to?.message}
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
