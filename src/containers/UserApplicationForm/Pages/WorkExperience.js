import React, { useEffect, useState } from "react";
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
import BackNextButton from "../backnextButton";
import { workExperienceSchema } from "../schema/schema";
import fetchData from "../api/fetchData"; // Assuming this function handles API calls
import axios from "../../../axios";

const WorkExperience = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user work experience data
  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        const response = await axios.get("api/get-user-info");
        setWorkExperiences(response.data.work_experience);
      } catch (error) {
        console.error("Error fetching user work experience:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkExperiences();
  }, []);

  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(workExperienceSchema),
    mode: "onChange",
    defaultValues: {
      work_experience: [],
    },
  });

  const employmentStatusOptions = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Freelance",
  ];

  const work_experience = watch("work_experience");

  // Update form values with fetched data when loading is done
  useEffect(() => {
    if (workExperiences && !loading) {
      setValue("work_experience", workExperiences, {
        shouldValidate: true,
      });
    }
  }, [loading, workExperiences, setValue]);

  useEffect(() => {
    setIsValid(formIsValid && work_experience.length > 0);
  }, [formIsValid, setIsValid, work_experience]);

  // Add a new work experience entry
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

  // Remove work experience entry
  const removeWorkExperience = (index) => {
    const updatedWorkExperience = work_experience.filter(
      (_, idx) => idx !== index
    );
    setValue("work_experience", updatedWorkExperience, {
      shouldValidate: true,
    });
  };

  // Save work experience data to API
  const saveWorkExperience = async () => {
    try {
      const response = await fetchData("zzapi/save-work-experience", {
        method: "POST",
        body: JSON.stringify(work_experience),
      });
      // Handle successful response (e.g., show success message, update state, etc.)
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

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
              required
              error={!!errors?.work_experience?.[index]?.company_name}
              helperText={
                errors?.work_experience?.[index]?.company_name?.message
              }
              {...register(`work_experience.${index}.company_name`)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Address"
              required
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
              required
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
              required
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
              required
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
              required
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
        schema={workExperienceSchema}
        formData={{ work_experience }}
        user_type={user_type}
        api={"work-experience"}
        onSave={saveWorkExperience} // This should trigger when the user moves forward
      />
    </Box>
  );
};

export default WorkExperience;
