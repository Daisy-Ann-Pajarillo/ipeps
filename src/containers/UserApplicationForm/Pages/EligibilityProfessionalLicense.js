import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, TextField, Button, Autocomplete } from "@mui/material";
import BackNextButton from "../backnextButton";

// Validation Schema using Yup
const schema = yup.object().shape({
  eligibilities: yup
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
            ? yup.string().nullable()
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
                .required(
                  "Valid Until is required for PRC Professional License"
                )
        ),
      })
    )
    //.min(1, "At least one eligibility is required")
    .required(),
});

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
    mode: "onChange", // Trigger validation on every change
    defaultValues: {
      eligibilities: [
        {
          type: null,
          name: "",
          date: "",
          rating: null,
          validity: null,
        },
      ],
    },
  });

  const eligibilities = watch("eligibilities");

  useEffect(() => {
    setIsValid(formIsValid && eligibilities.length > 0);
  }, [formIsValid, setIsValid, eligibilities]);

  const addEligibility = () => {
    const newEligibility = {
      type: null,
      name: "",
      date: "",
      rating: null,
      validity: null,
    };
    setValue("eligibilities", [...eligibilities, newEligibility], {
      shouldValidate: false,
    });
  };

  const removeEligibility = (index) => {
    const updatedEligibilities = eligibilities.filter(
      (_, idx) => idx !== index
    );
    setValue("eligibilities", updatedEligibilities, { shouldValidate: true });
  };

  const eligibilityType = [
    "Civil Service Eligibility",
    "PRC Professional License",
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Display Added Eligibilities */}
      <Grid container>
        {eligibilities.map((eligibility, index) => (
          <Box spacing={2} key={index} sx={{ marginBottom: 5 }}>
            <Grid container spacing={3}>
              {/* Eligibility Type */}
              <Grid item xs={12}>
                <Controller
                  name={`eligibilities[${index}].type`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={eligibilityType}
                      getOptionLabel={(option) => option}
                      value={field.value || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue); // Update the form state immediately
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Select License"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Name Field */}
              <Grid item xs={12}>
                <Controller
                  name={`eligibilities[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth required label="Name" {...field} />
                  )}
                />
              </Grid>

              {/* Date Field */}
              <Grid item xs={12} md={6}>
                <Controller
                  name={`eligibilities[${index}].date`}
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

              {/* Rating Field (only for Civil Service) */}
              {watch(`eligibilities[${index}].type`) ===
                "Civil Service Eligibility" && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`eligibilities[${index}].rating`}
                    control={control}
                    render={({ field }) => (
                      <TextField fullWidth required label="Rating" {...field} />
                    )}
                  />
                </Grid>
              )}

              {/* Validity Field (only for PRC License) */}
              {watch(`eligibilities[${index}].type`) ===
                "PRC Professional License" && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`eligibilities[${index}].validity`}
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

              {/* Remove Button */}

              {eligibilities.length > 1 && (
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
      {/* Navigation Buttons */}
      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        schema={schema}
        canSkip={true}
        formData={eligibilities}
        user_type={user_type}
        api={"professional-license"}
      />
    </Box>
  );
};

export default EligibilityProfessionalLicense;
