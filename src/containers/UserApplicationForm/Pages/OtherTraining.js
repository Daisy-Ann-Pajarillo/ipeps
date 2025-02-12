import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Grid, Box } from "@mui/material";

import BackNextButton from "../backnextButton";

const schema = yup.object().shape({
  trainingHistory: yup.array().of(
    yup.object().shape({
      courseName: yup.string().required("Course Name is required"),
      dateStart: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      dateEnd: yup
        .date()
        .nullable() // ✅ Allows null values
        .notRequired() // ✅ Ensures it's not required in validation
        .when("dateStart", (dateStart, schema) =>
          dateStart
            ? schema
                .min(yup.ref("dateStart"), "End date must be after start date")
                .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      trainingInstitution: yup
        .string()
        .required("Training Institution is required"),
      certificatesReceived: yup.string(),
      hoursOfTraining: yup
        .number()
        .required("Hours of Training is required")
        .positive("Hours must be a positive number")
        .integer("Hours must be a whole number"),
      skillsAcquired: yup.string().nullable(),
      credentialID: yup.string(),
      credentialURL: yup.string().url("Must be a valid URL").nullable(),
    })
  ),
});

const OtherTraining = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      trainingHistory: [
        {
          courseName: "",
          dateStart: "",
          dateEnd: "",
          trainingInstitution: "",
          certificatesReceived: "",
          hoursOfTraining: "",
          skillsAcquired: "",
          credentialID: "",
          credentialURL: "",
        },
      ],
    },
  });

  // Use watch to dynamically track changes in trainingHistory
  const trainingHistory = watch(
    "trainingHistory",
    getValues("trainingHistory")
  );

  const addTrainingHistory = () => {
    const newEntry = {
      courseName: "",
      dateStart: "",
      dateEnd: "",
      trainingInstitution: "",
      certificatesReceived: "",
      hoursOfTraining: "",
      skillsAcquired: "",
      credentialID: "",
      credentialURL: "",
    };

    const updatedTrainingHistory = [...trainingHistory, newEntry];

    // Update the form value and ensure validation is triggered
    setValue("trainingHistory", updatedTrainingHistory, {
      shouldValidate: false,
    });
  };

  const removeTrainingHistory = (index) => {
    const updatedTrainingHistory = trainingHistory.filter(
      (_, idx) => idx !== index
    );
    setValue("trainingHistory", updatedTrainingHistory, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    setIsValid(formIsValid && trainingHistory.length > 0);
  }, [formIsValid, setIsValid, trainingHistory]);

  return (
    <Box sx={{ p: 3 }}>
      {trainingHistory.map((entry, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={11}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register(`trainingHistory.${index}.courseName`)}
                  label="Course Name"
                  fullWidth
                  required
                  error={!!errors.trainingHistory?.[index]?.courseName}
                  helperText={
                    errors.trainingHistory?.[index]?.courseName?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.dateStart`)}
                  type="date"
                  label="Start Date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.trainingHistory?.[index]?.dateStart}
                  helperText={
                    errors.trainingHistory?.[index]?.dateStart?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.dateEnd`)}
                  type="date"
                  label="End Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.trainingHistory?.[index]?.dateEnd}
                  helperText={errors.trainingHistory?.[index]?.dateEnd?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`trainingHistory.${index}.trainingInstitution`)}
                  label="Training Institution"
                  fullWidth
                  required
                  error={!!errors.trainingHistory?.[index]?.trainingInstitution}
                  helperText={
                    errors.trainingHistory?.[index]?.trainingInstitution
                      ?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.certificatesReceived`)}
                  label="Certificates Received"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.hoursOfTraining`)}
                  type="number"
                  label="Hours of Training"
                  fullWidth
                  required
                  error={!!errors.trainingHistory?.[index]?.hoursOfTraining}
                  helperText={
                    errors.trainingHistory?.[index]?.hoursOfTraining?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`trainingHistory.${index}.skillsAcquired`)}
                  label="Skills Acquired"
                  fullWidth
                  error={!!errors.trainingHistory?.[index]?.skillsAcquired}
                  helperText={
                    errors.trainingHistory?.[index]?.skillsAcquired?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.credentialID`)}
                  label="Credential ID"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`trainingHistory.${index}.credentialURL`)}
                  label="Credential URL"
                  fullWidth
                  error={!!errors.trainingHistory?.[index]?.credentialURL}
                  helperText={
                    errors.trainingHistory?.[index]?.credentialURL?.message
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {trainingHistory.length > 1 && (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeTrainingHistory(index)}
                >
                  Remove Entry
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
      <div className="mb-4 text-center">
        <Button
          variant="contained"
          color="primary"
          onClick={addTrainingHistory}
          sx={{ marginBottom: 2 }}
        >
          Add Training
        </Button>
      </div>
      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        canSkip={true}
        schema={schema}
        formData={trainingHistory}
        user_type={user_type}
        api={"other-training"}
      />
    </Box>
  );
};

export default OtherTraining;
