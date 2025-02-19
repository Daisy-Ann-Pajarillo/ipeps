import React, { useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BackNextButton from "../backnextButton";

const schema = yup.object().shape({
  work_experience: yup
    .array()
    .of(
      yup.object().shape({
        company_name: yup.string().required("Company Name is required"),
        company_address: yup.string().required("Company Address is required"),
        position: yup.string().required("Position is required"),
        employment_status: yup
          .string()
          .required("Employment Status is required"),
        date_start: yup
          .date()
          .required("Start date is required")
          .max(new Date(), "Start date cannot be in the future"),
        date_end: yup
          .date()
          .required("End date is required")
          .when("date_start", (date_start, schema) =>
            date_start
              ? schema
                  .test(
                    "end-date-after-start",
                    "End date must be after start date",
                    (date_end) =>
                      !date_end ||
                      (date_start && new Date(date_end) > new Date(date_start))
                  )
                  .max(new Date(), "End date cannot be in the future")
              : schema
          )
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          ),
      })
    )
    .min(1, "At least one work experience entry is required")
    .required("Work Experience is required"),
});

const WorkExperience = ({
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
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      work_experience: [
        {
          company_address: "Sample 1",
          company_name: "Sample 1",
          date_end: "2025-02-11",
          date_start: "2025-02-09",
          employment_status: "Full-Time",
          position: "Sample 1"
        },
        {
          company_address: "Sample 2",
          company_name: "Sample 2",
          date_end: "2025-02-11",
          date_start: "2025-02-10",
          employment_status: "Full-Time",
          position: "Sample 2"
        }
      ]
    },
  });

  const employmentStatusOptions = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Freelance",
  ];

  const work_experience = watch("work_experience");

  useEffect(() => {
    setIsValid(formIsValid && work_experience.length > 0);
  }, [formIsValid, setIsValid, work_experience]);

  const addWorkExperience = () => {
    const newEntry = {
      company_name: "",
      company_address: "",
      position: "",
      employment_status: "",
      date_start: "",
      date_end: "",
    };
    setValue("work_experience", [...work_experience, newEntry], {
      shouldValidate: false,
    });
  };

  const removeWorkExperience = (index) => {
    const updatedWorkExperience = work_experience.filter(
      (_, idx) => idx !== index
    );
    setValue("work_experience", updatedWorkExperience, { shouldValidate: true });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body2" gutterBottom color="warning.main">
        Limit to 10-year period, starting with the most recent employment.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {work_experience.map((entry, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              error={!!errors?.work_experience?.[index]?.company_name}
              helperText={errors?.work_experience?.[index]?.company_name?.message}
              {...register(`work_experience.${index}.company_name`)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Address"
              error={!!errors?.work_experience?.[index]?.company_address}
              helperText={
                errors?.work_experience?.[index]?.company_address?.message
              }
              {...register(`work_experience.${index}.company_address`)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position"
              error={!!errors?.work_experience?.[index]?.position}
              helperText={errors?.work_experience?.[index]?.position?.message}
              {...register(`work_experience.${index}.position`)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Employment Status"
              error={!!errors?.work_experience?.[index]?.employment_status}
              helperText={
                errors?.work_experience?.[index]?.employment_status?.message
              }
              {...register(`work_experience.${index}.employment_status`)}
              defaultValue={entry.employment_status}
            >
              {employmentStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Start"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors?.work_experience?.[index]?.date_start}
              helperText={errors?.work_experience?.[index]?.date_start?.message}
              {...register(`work_experience.${index}.date_start`)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date End"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors?.work_experience?.[index]?.date_end}
              helperText={errors?.work_experience?.[index]?.date_end?.message}
              {...register(`work_experience.${index}.date_end`)}
            />
          </Grid>
          {work_experience.length > 1 && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeWorkExperience(index)}
              >
                Remove
              </Button>
            </Grid>
          )}
        </Grid>
      ))}

      <div className="mb-4 text-center">
        <Button
          variant="contained"
          color="primary"
          onClick={addWorkExperience}
          sx={{ marginBottom: 2 }}
        >
          Add Work Experience
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
        formData={{work_experience}}
        user_type={user_type}
        api={"work-experience"}
      />
    </Box>
  );
};

export default WorkExperience;