import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Autocomplete } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../store/actions/index";
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
import field_of_study_options from "../../../reusable/constants/fieldOfStudyTypes";
import fetchData from "../api/fetchData";
import axios from "../../../axios";
import { auth } from "../../../store/actions";

const schema = yup.object().shape({
  educationHistory: yup.array().of(
    yup.object().shape({
      school_name: yup
        .string()
        .min(3, "School Name should be at least 3 characters long")
        .required("School name is required"),
      degree_or_qualification: yup
        .string()
        .required("Degree qualification is required"),
      date_from: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      date_to: yup
        .date()
        .nullable()
        .notRequired()
        .when("date_from", (date_from, schema) =>
          date_from
            ? schema
              .test(
                "end-date-after-start",
                "End date must be after start date",
                (date_to) =>
                  !date_to ||
                  (date_from && new Date(date_to) > new Date(date_from))
              )
              .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      is_current: yup.boolean().default(false),
      field_of_study: yup
        .string()
        .required()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      program_duration: yup
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
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchEducationalBackground = async () => {
      try {
        const response = await axios.get("api/get-user-info", {
          auth: {
            username: auth.token,
          },
        });
        console.log("educationallll", response.data)
        setEducationHistory(response.data.educational_background);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducationalBackground();
  }, []);

  const watchEducationHistory = watch("educationHistory");

  useEffect(() => {
    setEducationHistory(watchEducationHistory || []);
  }, [watchEducationHistory]);

  const addEducation = () => {
    const newEntry = {
      school_name: "",
      degree_or_qualification: "",
      date_from: "",
      date_to: "",
      is_current: false,
      field_of_study: "",
      program_duration: "",
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
    updatedHistory[index].is_current = checked;
    if (checked) {
      updatedHistory[index].date_to = null;
    }
    setEducationHistory(updatedHistory);
    setValue(`educationHistory.${index}.is_current`, checked);
    setValue(`educationHistory.${index}.date_to`, null);
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
              value={item.school_name}
              onChange={(_, newValue) => {
                setValue(`educationHistory.${index}.school_name`, newValue, {
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...register(`educationHistory.${index}.school_name`)}
                  label="School Name"
                  required
                  error={!!errors.educationHistory?.[index]?.school_name}
                  helperText={
                    errors.educationHistory?.[index]?.school_name?.message
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register(`educationHistory.${index}.date_from`)}
              label="Date From"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.educationHistory?.[index]?.date_from}
              helperText={errors.educationHistory?.[index]?.date_from?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register(`educationHistory.${index}.date_to`)}
              label="Date To"
              type="date"
              disabled={item.is_current}
              InputLabelProps={{ shrink: true }}
              error={!!errors.educationHistory?.[index]?.date_to}
              helperText={errors.educationHistory?.[index]?.date_to?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.is_current}
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
                {...register(`educationHistory.${index}.degree_or_qualification`)}
                error={!!errors.educationHistory?.[index]?.degree_or_qualification}
                value={item.degree_or_qualification || ""}
              >
                {degreeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">
                {errors.educationHistory?.[index]?.degree_or_qualification?.message}
              </p>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Field of Study</InputLabel>
              <Select
                {...register(`educationHistory.${index}.field_of_study`)}
                error={!!errors.educationHistory?.[index]?.field_of_study}
                value={item.field_of_study || ""}
              >
                {field_of_study_options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">
                {errors.educationHistory?.[index]?.field_of_study?.message}
              </p>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              {...register(`educationHistory.${index}.program_duration`)}
              label="Program Duration (Years)"
              type="number"
              inputProps={{ min: 0 }} // Ensures the input doesn't allow negatives
              value={item.program_duration || ""}
              error={!!errors.educationHistory?.[index]?.program_duration}
              helperText={
                errors.educationHistory?.[index]?.program_duration?.message
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
