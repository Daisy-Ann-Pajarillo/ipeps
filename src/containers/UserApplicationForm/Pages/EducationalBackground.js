import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { educationalBackgroundSchema } from "../schema/schema";
import fetchData from "../api/fetchData";

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
  const [educationBackground, setEducationBackground] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data first
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetchData("api/get-user-info");
        setEducationBackground(response.educational_background || []);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  // Initialize form with default values
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(educationalBackgroundSchema),
    mode: "onChange",
    defaultValues: {
      educational_background: [],
    },
  });

  // Watch for changes in the form
  const watchEducationHistory = watch("educational_background");

  // State to track education history
  const [educationHistory, setEducationHistory] = useState(
    getValues("educational_background")
  );

  // Update state when form values change
  useEffect(() => {
    setEducationHistory(watchEducationHistory || []);
  }, [watchEducationHistory]);

  // Populate form with fetched educationBackground data
  useEffect(() => {
    if (educationBackground && !loading) {
      setValue("educational_background", educationBackground, {
        shouldValidate: true,
      });
    }
  }, [educationBackground, loading, setValue]);

  // Add a new education entry
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
    setValue("educational_background", updatedEducationHistory, {
      shouldValidate: false,
    });
  };

  // Remove an education entry
  const removeEducation = (index) => {
    const updatedEducationHistory = educationHistory.filter(
      (_, idx) => idx !== index
    );
    setEducationHistory(updatedEducationHistory);
    setValue("educational_background", updatedEducationHistory, {
      shouldValidate: true,
    });
  };

  // Handle "Currently Attending" checkbox
  const handleCurrentCheckbox = (index, checked) => {
    const updatedHistory = [...educationHistory];
    updatedHistory[index].is_current = checked;
    if (checked) {
      updatedHistory[index].date_to = null; // Clear end date if "Currently Attending"
    }
    setEducationHistory(updatedHistory);
    setValue(`educational_background.${index}.is_current`, checked);
    setValue(`educational_background.${index}.date_to`, null);
  };

  // Update overall form validity
  useEffect(() => {
    setIsValid(formIsValid && educationHistory.length > 0);
  }, [formIsValid, educationHistory]);

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
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
            <TextField
              fullWidth
              required
              label="School Name"
              {...register(`educational_background.${index}.school_name`)}
              error={!!errors.educationHistory?.[index]?.school_name}
              helperText={
                errors.educationHistory?.[index]?.school_name?.message
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              {...register(`educational_background.${index}.date_from`)}
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
              {...register(`educational_background.${index}.date_to`)}
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
                {...register(
                  `educational_background.${index}.degree_or_qualification`
                )}
                error={
                  !!errors.educationHistory?.[index]?.degree_or_qualification
                }
              >
                {degreeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">
                {
                  errors.educationHistory?.[index]?.degree_or_qualification
                    ?.message
                }
              </p>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Field of Study</InputLabel>
              <Select
                {...register(`educational_background.${index}.field_of_study`)}
                error={!!errors.educationHistory?.[index]?.field_of_study}
              >
                {fieldOfStudyTypes.map((option) => (
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
              {...register(`educational_background.${index}.program_duration`)}
              label="Program Duration (Years)"
              type="number"
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
        schema={educationalBackgroundSchema}
        formData={educationHistory}
        user_type={user_type}
        api={"educational-background"}
      />
    </Box>
  );
};

export default EducationalBackground;
