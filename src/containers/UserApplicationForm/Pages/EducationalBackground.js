import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Autocomplete } from "@mui/material";
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
import fetchData from "../api/fetchData";

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
        .nullable()
        .notRequired()
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
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
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
  "ALS",
  "TESDA",
];

// Sample list of schools for autocomplete
const schoolsList = [
  "University of the Philippines",
  "Ateneo de Manila University",
  "De La Salle University",
  "ISATU",
  "TIONCO",
  // Add more schools as needed
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
  const [loading, setLoading] = useState(true);
  const [educationHistory, setEducationHistory] = useState([]);

  const {
    register,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      educationHistory: [],
    },
  });

  // Fetch and transform data
  useEffect(() => {
    const fetchEducationalBackground = async () => {
      try {
        const response = await fetchData("api/get-user-info");
        if (response.educational_background) {
          const transformedData = response.educational_background.map(
            (edu) => ({
              schoolName: edu.school_name,
              degreeQualification: edu.degree_or_qualification,
              dateFrom: new Date(edu.date_from).toISOString().split("T")[0],
              dateTo: new Date(edu.date_to).toISOString().split("T")[0],
              isCurrent: false,
              fieldOfStudy: edu.field_of_study,
              programDuration: edu.program_duration,
            })
          );
          setEducationHistory(transformedData);
          setValue("educationHistory", transformedData);
        }
      } catch (error) {
        console.error("Error fetching educational background:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducationalBackground();
  }, [setValue]);

  const watchEducationHistory = watch("educationHistory");

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

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <Autocomplete
              freeSolo
              options={schoolsList}
              value={item.schoolName}
              onChange={(_, newValue) => {
                setValue(`educationHistory.${index}.schoolName`, newValue, {
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...register(`educationHistory.${index}.schoolName`)}
                  label="School Name"
                  required
                  error={!!errors.educationHistory?.[index]?.schoolName}
                  helperText={
                    errors.educationHistory?.[index]?.schoolName?.message
                  }
                />
              )}
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
                value={item.degreeQualification || ""}
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
                value={item.fieldOfStudy || ""}
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
              inputProps={{ min: 0 }} // Ensures the input doesn't allow negatives
              value={item.programDuration || ""}
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
