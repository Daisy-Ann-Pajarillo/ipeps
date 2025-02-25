import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, TextField, Button, Autocomplete } from "@mui/material";
import BackNextButton from "../backnextButton";
import fetchData from "../api/fetchData";
import { professionalEligibilitySchema } from "../components/schema";
import axios from "../../../axios";

const eligibilityTypeOptions = [
  "Civil Service Eligibility",
  "PRC Professional License",
];

const EligibilityProfessionalLicense = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [professionalLicenses, setProfessionalLicenses] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data first
  useEffect(() => {
    const fetchProfessionalLicenses = async () => {
      try {
        const response = await axios.get("api/get-user-info");
        setProfessionalLicenses(response.data.professional_license);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionalLicenses();
  }, []);

  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(professionalEligibilitySchema),
    mode: "onChange",
    defaultValues: {
      professional_license: [],
    },
  });

  const professional_license = watch("professional_license");

  // Update form values with fetched data when loading is done
  useEffect(() => {
    if (professionalLicenses && !loading) {
      setValue("professional_license", professionalLicenses, {
        shouldValidate: true,
      });
    }
  }, [loading, professionalLicenses, setValue]);

  // Validate form when license history changes
  useEffect(() => {
    if (!loading) {
      setIsValid(formIsValid); // Automatically updates when form is valid
    }
  }, [professional_license, loading, formIsValid, setIsValid]);

  const addEligibility = () => {
    const newEligibility = {
      license: null,
      name: "",
      date: "",
      rating: null,
      valid_until: null,
    };
    const updatedLicenses = [...professional_license, newEligibility];
    setValue("professional_license", updatedLicenses, {
      shouldValidate: true,
    });
  };

  const removeEligibility = (index) => {
    const updatedLicenses = professional_license.filter(
      (_, idx) => idx !== index
    );
    setValue("professional_license", updatedLicenses, { shouldValidate: true });
  };

  // Handle license type change
  const handleLicenseTypeChange = (index, newValue) => {
    const updatedLicenses = [...professional_license];
    updatedLicenses[index].license = newValue;

    // Reset conditional fields when switching license types
    if (newValue === "Civil Service Eligibility") {
      updatedLicenses[index].rating = null;
      updatedLicenses[index].valid_until = null;
    } else if (newValue === "PRC Professional License") {
      updatedLicenses[index].valid_until = null;
      updatedLicenses[index].rating = null;
    }

    setValue("professional_license", updatedLicenses, { shouldValidate: true });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container>
        {professional_license.map((eligibility, index) => (
          <Box key={index} sx={{ marginBottom: 5, width: "100%" }}>
            <Grid container spacing={3}>
              {/* Select License - Using Controller for Autocomplete */}
              <Grid item xs={12}>
                <Controller
                  name={`professional_license.${index}.license`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={eligibilityTypeOptions}
                      getOptionLabel={(option) => option || ""}
                      value={field.value || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        handleLicenseTypeChange(index, newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select License"
                          required
                          error={
                            !!errors?.professional_license?.[index]?.license
                          }
                          helperText={
                            errors?.professional_license?.[index]?.license
                              ?.message || ""
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Name Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  {...register(`professional_license.${index}.name`)}
                  error={!!errors?.professional_license?.[index]?.name}
                  helperText={
                    errors?.professional_license?.[index]?.name?.message || ""
                  }
                />
              </Grid>

              {/* Date Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register(`professional_license.${index}.date`)}
                  error={!!errors?.professional_license?.[index]?.date}
                  helperText={
                    errors?.professional_license?.[index]?.date?.message || ""
                  }
                />
              </Grid>

              {/* Rating Field for Civil Service Eligibility */}
              {eligibility.license === "Civil Service Eligibility" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Rating"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    {...register(`professional_license.${index}.rating`)}
                    error={!!errors?.professional_license?.[index]?.rating}
                    helperText={
                      errors?.professional_license?.[index]?.rating?.message ||
                      ""
                    }
                  />
                </Grid>
              )}

              {/* Valid Until Field for PRC Professional License */}
              {eligibility.license === "PRC Professional License" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Valid Until"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register(`professional_license.${index}.valid_until`)}
                    error={!!errors?.professional_license?.[index]?.valid_until}
                    helperText={
                      errors?.professional_license?.[index]?.valid_until
                        ?.message || ""
                    }
                  />
                </Grid>
              )}

              {/* Remove Button */}
              {professional_license.length > 1 && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeEligibility(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
      </Grid>

      {/* Add Eligibility Button */}
      <div className="mb-4 text-center">
        <Button
          variant="contained"
          onClick={addEligibility}
          color="primary"
          sx={{ marginBottom: 2 }}
        >
          Add Eligibility
        </Button>
      </div>

      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        schema={professionalEligibilitySchema}
        canSkip={true}
        formData={{ professional_license }}
        user_type={user_type}
        api={"professional-license"}
      />
    </Box>
  );
};

export default EligibilityProfessionalLicense;
