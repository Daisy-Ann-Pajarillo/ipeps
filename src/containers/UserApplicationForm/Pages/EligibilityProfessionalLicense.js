import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, TextField, Button, Autocomplete } from "@mui/material";
import BackNextButton from "../backnextButton";

const schema = yup.object().shape({
  professional_license: yup
    .array()
    .of(
      yup.object().shape({
        type: yup.string().required("Eligibility Type is required"),
        name: yup.string().required("Name is required"),
        date: yup
          .date()
          .typeError("Date must be a valid date")
          .required("Date is required"),
        rating: yup.lazy((value) =>
          value === null || value === undefined
            ? yup.string()
            : yup
              .number()
              .required("Rating is required for Civil Service Eligibility")
        ),
        validity: yup.lazy((value) =>
          value === null || value === undefined
            ? yup.date().nullable()
            : yup
              .date()
              .typeError("Valid Until must be a valid date")
              .required("Valid Until is required for PRC Professional License")
        ),
      })
    )
    .required(),
});

const eligibilityType = [
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
  const {
    control,
    watch,
    setValue,
    formState: { isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      professional_license: [
        {
          date: "2025-02-12",
          type: "Civil Service Eligibility",
          name: "Sampleee121241",
          rating: 1,
          validity: null
        },
        {
          date: "2025-02-12",
          type: "Civil Service Eligibility",
          name: "Sampleee121241",
          rating: 1,
          validity: null
        }
      ],
    },
  });

  const professional_license = watch("professional_license");

  useEffect(() => {
    setIsValid(formIsValid && professional_license.length > 0);
  }, [formIsValid, setIsValid, professional_license]);

  const addEligibility = () => {
    const newEligibility = {
      type: null,
      name: "",
      date: "",
      rating: null,
      validity: null,
    };
    setValue("professional_license", [...professional_license, newEligibility], {
      shouldValidate: false,
    });
  };

  const removeEligibility = (index) => {
    const updatedEligibilities = professional_license.filter(
      (_, idx) => idx !== index
    );
    setValue("professional_license", updatedEligibilities, { shouldValidate: true });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container>
        {professional_license.map((eligibility, index) => (
          <Box spacing={2} key={index} sx={{ marginBottom: 5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name={`professional_license.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={eligibilityType}
                      value={field.value || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        // Reset related fields when type changes
                        if (newValue === "Civil Service Eligibility") {
                          setValue(`professional_license.${index}.validity`, null);
                        } else if (newValue === "PRC Professional License") {
                          setValue(`professional_license.${index}.rating`, null);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Select License"
                          error={!!field.error}
                          helperText={field.error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name={`professional_license.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth required label="Name" {...field} />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name={`professional_license.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      required
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                />
              </Grid>

              {watch(`professional_license.${index}.type`) === "Civil Service Eligibility" && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`professional_license.${index}.rating`}
                    control={control}
                    render={({ field }) => (
                      <TextField 
                        fullWidth 
                        required 
                        label="Rating" 
                        type="number"
                        inputProps={{ step: "0.01" }}
                        {...field} 
                      />
                    )}
                  />
                </Grid>
              )}

              {watch(`professional_license.${index}.type`) === "PRC Professional License" && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`professional_license.${index}.validity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        required
                        label="Valid Until"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              )}

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
        schema={schema}
        canSkip={true}
        formData={professional_license}
        user_type={user_type}
        api={"professional-license"}
      />
    </Box>
  );
};

export default EligibilityProfessionalLicense;