import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BackNextButton from "../backnextButton";
import { workExperienceSchema } from "../components/schema";
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
  const [noWorkExperience, setNoWorkExperience] = useState(false);

  // Fetch user work experience data
  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        const response = await axios.get("api/get-user-info");
        setWorkExperiences(response.data.work_experience);
        
        // Check if user previously selected "No Work Experience"
        if (response.data.user_preferences?.no_work_experience) {
          setNoWorkExperience(true);
        }
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

  // Update validity state whenever relevant states change
  useEffect(() => {
    // If "No Work Experience" is checked, the form is valid
    // Otherwise, rely on form validation and ensure there's at least one entry
    setIsValid(noWorkExperience || (formIsValid && work_experience.length > 0));
  }, [formIsValid, setIsValid, work_experience, noWorkExperience]);

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

  // Handle no work experience checkbox
  const handleNoWorkExperience = (event) => {
    const checked = event.target.checked;
    setNoWorkExperience(checked);
    
    // If checked, clear the work experience array
    if (checked) {
      setValue("work_experience", [], { shouldValidate: false });
    } else if (work_experience.length === 0) {
      // If unchecked and there's no work experience, add one empty entry
      addWorkExperience();
    }
  };

  // Save work experience data to API
  const saveWorkExperience = async () => {
    try {
      // If no work experience is checked, save that preference
      if (noWorkExperience) {
        await fetchData("zzapi/save-user-preferences", {
          method: "POST",
          body: JSON.stringify({ no_work_experience: true }),
        });
        return;
      }
      
      const response = await fetchData("zzapi/save-work-experience", {
        method: "POST",
        body: JSON.stringify(work_experience),
      });
      // Clear no work experience flag if adding experiences
      await fetchData("zzapi/save-user-preferences", {
        method: "POST",
        body: JSON.stringify({ no_work_experience: false }),
      });
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography variant="body2" gutterBottom color="warning.main">
          Limit to 10-year period, starting with the most recent employment.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* No Work Experience Option */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={noWorkExperience}
                onChange={handleNoWorkExperience}
              />
            }
            label="I have no work experience"
          />
          
          {noWorkExperience && (
            <Alert severity="info" sx={{ mt: 2 }}>
              You have indicated that you have no work experience. You can proceed to the next section.
            </Alert>
          )}
        </Box>

        {/* Only show work experience form if "No Work Experience" is not checked */}
        {!noWorkExperience && (
          <>
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
          </>
        )}
      </Box>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <BackNextButton
          activeStep={activeStep}
          steps={steps}
          handleBack={handleBack}
          handleNext={handleNext}
          isValid={isValid}
          setIsValid={setIsValid}
          schema={workExperienceSchema}
          formData={{ work_experience, noWorkExperience }}
          user_type={user_type}
          api={"work-experience"}
          onSave={saveWorkExperience}
          canSkip={noWorkExperience}
        />
      </Box>
    </Box>
  );
};

export default WorkExperience;
