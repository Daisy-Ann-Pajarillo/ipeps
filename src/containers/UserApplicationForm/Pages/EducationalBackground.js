import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import BackNextButton from "../backnextButton";
import fieldOfStudyTypes from "../../../reusable/constants/fieldOfStudyTypes";

// Updated validation schema to match form fields
const schema = yup.object().shape({
  educationHistory: yup.array().of(
    yup.object().shape({
      schoolName: yup
        .string()
        .min(3, "School Name should be at least 3 characters long")
        .required("School name is required"),
      degreeQualification: yup
        .string()
        .required("Degree qualification is required"),
      dateFrom: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      dateTo: yup
        .date()
        .nullable() // ✅ Allows null values
        .notRequired() // ✅ Ensures it's not required in validation
        .when("dateFrom", (dateFrom, schema) =>
          dateFrom
            ? schema
                .test(
                  "end-date-after-start",
                  "End date must be after start date",
                  (dateTo) =>
                    !dateTo ||
                    (dateFrom && new Date(dateTo) > new Date(dateFrom))
                )
                .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      isCurrent: yup.boolean().default(false),
      fieldOfStudy: yup
        .string()
        .nullable() // ✅ Made optional (no required rule)
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ), // Optional and handles empty strings
      major: yup.string().nullable(),
      programDuration: yup
        .number()
        .typeError("Program duration must be a number")
        .positive("Must be a positive number")
        .integer("Must be an integer"),
    })
  ),
});

const degreeOptions = [
  "Elementary",
  "Secondary (Non-K12)",
  "Secondary (K-12)",
  "Associates",
  "Bachelor",
  "Master's",
  "PhD",
];

const EducationalBackground = ({
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
      educationHistory: [
        {
          schoolName: "",
          degreeQualification: "",
          dateFrom: "",
          dateTo: "",
          isCurrent: false,
          fieldOfStudy: "",
          programDuration: "",
        },
      ],
    },
  });

  const [educationHistory, setEducationHistory] = useState(
    getValues("educationHistory")
  );

  // Watch for changes in the form
  const watchEducationHistory = watch("educationHistory");

  // Update state when form values change
  useEffect(() => {
    setEducationHistory(watchEducationHistory || []);
  }, [watchEducationHistory]);

  const addEducation = () => {
    const newEntry = {
      schoolName: "",
      degreeQualification: "",
      dateFrom: "",
      dateTo: "",
      isCurrent: false,
      fieldOfStudy: "",
      programDuration: "",
    };

    const updatedEducationHistory = [...educationHistory, newEntry];
    setEducationHistory(updatedEducationHistory);
    setValue("educationHistory", updatedEducationHistory, {
      shouldValidate: false,
    });
  };

  const removeEducation = (index) => {
    const updatedEducationHistory = educationHistory.filter(
      (_, idx) => idx !== index
    );
    setEducationHistory(updatedEducationHistory);
    setValue("educationHistory", updatedEducationHistory, {
      shouldValidate: true,
    });
  };

  // Handle "Currently Attending" checkbox
  const handleCurrentCheckbox = (index, checked) => {
    const updatedHistory = [...educationHistory];
    updatedHistory[index].isCurrent = checked;
    if (checked) {
      updatedHistory[index].dateTo = null;
    }
    setEducationHistory(updatedHistory);
    setValue(`educationHistory.${index}.isCurrent`, checked);
    setValue(`educationHistory.${index}.dateTo`, null);
  };

  useEffect(() => {
    setIsValid(formIsValid && educationHistory.length > 0);
  }, [formIsValid, setIsValid, educationHistory]);

  return (
    <Box sx={{ p: 3 }}>
      {errors.educationHistory?.message && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {errors.educationHistory.message}
        </div>
      )}

      {educationHistory.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="School Name"
              {...register(`educationHistory.${index}.schoolName`)}
              error={!!errors.educationHistory?.[index]?.schoolName}
              helperText={errors.educationHistory?.[index]?.schoolName?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register(`educationHistory.${index}.dateFrom`)}
              label="Date From"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.educationHistory?.[index]?.dateFrom}
              helperText={errors.educationHistory?.[index]?.dateFrom?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register(`educationHistory.${index}.dateTo`)}
              label="Date To"
              type="date"
              disabled={item.isCurrent}
              InputLabelProps={{ shrink: true }}
              error={!!errors.educationHistory?.[index]?.dateTo}
              helperText={errors.educationHistory?.[index]?.dateTo?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.isCurrent}
                  onChange={(e) =>
                    handleCurrentCheckbox(index, e.target.checked)
                  }
                />
              }
              label="Currently Attending"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Degree or Qualification</InputLabel>
              <Select
                {...register(`educationHistory.${index}.degreeQualification`)}
                error={!!errors.educationHistory?.[index]?.degreeQualification}
              >
                {degreeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">
                {errors.educationHistory?.[index]?.degreeQualification?.message}
              </p>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Field of Study</InputLabel>
              <Select
                {...register(`educationHistory.${index}.fieldOfStudy`)}
                error={!!errors.educationHistory?.[index]?.fieldOfStudy}
              >
                {fieldOfStudyTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">
                {errors.educationHistory?.[index]?.fieldOfStudy?.message}
              </p>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              {...register(`educationHistory.${index}.programDuration`)}
              label="Program Duration (Years)"
              type="number"
              error={!!errors.educationHistory?.[index]?.programDuration}
              helperText={
                errors.educationHistory?.[index]?.programDuration?.message
              }
            />
          </Grid>
          {educationHistory.length > 1 && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeEducation(index)}
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
          onClick={addEducation}
          sx={{ marginBottom: 2 }}
        >
          Add Education
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
        formData={educationHistory}
        user_type={user_type}
        api={"educational-background"}
      />
    </Box>
  );
};

export default EducationalBackground;
