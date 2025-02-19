import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Grid, Box } from "@mui/material";

import BackNextButton from "../backnextButton";

const schema = yup.object().shape({
  other_training: yup.array().of(
    yup.object().shape({
      course_name: yup.string().required("Course Name is required"),
      start_date: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      end_date: yup
        .date()
        .nullable() // ✅ Allows null values
        .notRequired() // ✅ Ensures it's not required in validation
        .when("start_date", (start_date, schema) =>
          start_date
            ? schema
                .min(yup.ref("start_date"), "End date must be after start date")
                .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      training_institution: yup
        .string()
        .required("Training Institution is required"),
      certificates_received: yup.string(),
      hours_of_training: yup
        .number()
        .required("Hours of Training is required")
        .positive("Hours must be a positive number")
        .integer("Hours must be a whole number"),
      skills_acquired: yup.string().nullable(),
      credential_id: yup.string(),
      credential_url: yup.string().url("Must be a valid URL").nullable(),
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
      other_training:[ 
        {
            "certificates_received": "Sample 1 Cert",
            "course_name": "Sample 1",
            "credential_id": "kflksng 1",
            "credential_url": "https://www.facebook.com/",
            "end_date": "Tue, 11 Feb 2025 00:00:00 GMT",
            "hours_of_training": 3,
            "skills_acquired": "Sample 1 Skill ",
            "start_date": "Mon, 03 Feb 2025 00:00:00 GMT",
            "training_institution": "Sample 1 Institution"
        },
        {
            "certificates_received": "Sample 2 Cert ",
            "course_name": "Sample 2",
            "credential_id": "2342342",
            "credential_url": "https://www.facebook.com/",
            "end_date": "Mon, 10 Feb 2025 00:00:00 GMT",
            "hours_of_training": 2,
            "skills_acquired": "Sample 2 Skills",
            "start_date": "Sat, 01 Feb 2025 00:00:00 GMT",
            "training_institution": "Sample 2"
        }
    ]
    },
  });

  // Use watch to dynamically track changes in other_training
  const other_training = watch(
    "other_training",
    getValues("other_training")
  );

  const addTrainingHistory = () => {
    const newEntry = {
      course_name: "",
      start_date: "",
      end_date: "",
      training_institution: "",
      certificates_received: "",
      hours_of_training: "",
      skills_acquired: "",
      credential_id: "",
      credential_url: "",
    };

    const updatedTrainingHistory = [...other_training, newEntry];

    // Update the form value and ensure validation is triggered
    setValue("other_training", updatedTrainingHistory, {
      shouldValidate: false,
    });
  };

  const removeTrainingHistory = (index) => {
    const updatedTrainingHistory = other_training.filter(
      (_, idx) => idx !== index
    );
    setValue("other_training", updatedTrainingHistory, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    setIsValid(formIsValid && other_training.length > 0);
  }, [formIsValid, setIsValid, other_training]);

  return (
    <Box sx={{ p: 3 }}>
      {other_training.map((entry, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={11}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register(`other_training.${index}.course_name`)}
                  label="Course Name"
                  fullWidth
                  required
                  error={!!errors.other_training?.[index]?.course_name}
                  helperText={
                    errors.other_training?.[index]?.course_name?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.start_date`)}
                  type="date"
                  label="Start Date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.other_training?.[index]?.start_date}
                  helperText={
                    errors.other_training?.[index]?.start_date?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.end_date`)}
                  type="date"
                  label="End Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.other_training?.[index]?.end_date}
                  helperText={errors.other_training?.[index]?.end_date?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`other_training.${index}.training_institution`)}
                  label="Training Institution"
                  fullWidth
                  required
                  error={!!errors.other_training?.[index]?.training_institution}
                  helperText={
                    errors.other_training?.[index]?.training_institution
                      ?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.certificates_received`)}
                  label="Certificates Received"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.hours_of_training`)}
                  type="number"
                  label="Hours of Training"
                  fullWidth
                  required
                  error={!!errors.other_training?.[index]?.hours_of_training}
                  helperText={
                    errors.other_training?.[index]?.hours_of_training?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`other_training.${index}.skills_acquired`)}
                  label="Skills Acquired"
                  fullWidth
                  error={!!errors.other_training?.[index]?.skills_acquired}
                  helperText={
                    errors.other_training?.[index]?.skills_acquired?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.credential_id`)}
                  label="Credential ID"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.credential_url`)}
                  label="Credential URL"
                  fullWidth
                  error={!!errors.other_training?.[index]?.credential_url}
                  helperText={
                    errors.other_training?.[index]?.credential_url?.message
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {other_training.length > 1 && (
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
        formData={other_training}
        user_type={user_type}
        api={"other-training"}
      />
    </Box>
  );
};

export default OtherTraining;
