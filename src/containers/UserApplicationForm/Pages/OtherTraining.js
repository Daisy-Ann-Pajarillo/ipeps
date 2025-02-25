import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Grid, Box } from "@mui/material";
import { otherTrainingsSchema } from "../components/schema";
import fetchData from "../api/fetchData";
import BackNextButton from "../backnextButton";
import axios from "../../../axios";

const OtherTraining = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [otherTrainings, setOtherTrainings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data first
  useEffect(() => {
    const fetchOtherTrainings = async () => {
      try {
        const response = await axios.get("api/get-user-info");
        setOtherTrainings(response.data.other_training);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOtherTrainings();
  }, []);

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(otherTrainingsSchema),
    mode: "onChange",
    defaultValues: {
      other_training: [],
    },
  });

  // Use watch to dynamically track changes in other_training
  const other_training = watch("other_training", getValues("other_training"));

  // Populate form with fetched data
  useEffect(() => {
    if (otherTrainings && !loading) {
      setValue("other_training", otherTrainings, {
        shouldValidate: true,
      });
    }
  }, [loading, setValue, otherTrainings]);

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

  // Update isValid state based on form validation and other_training length
  useEffect(() => {
    setIsValid(formIsValid && other_training.length > 0);
  }, [formIsValid, setIsValid, other_training]);

  if (loading) {
    return <p>Loading...</p>;
  }

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
                  error={!!errors?.other_training?.[index]?.course_name}
                  helperText={
                    errors?.other_training?.[index]?.course_name?.message
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
                  error={!!errors?.other_training?.[index]?.start_date}
                  helperText={
                    errors?.other_training?.[index]?.start_date?.message
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
                  error={!!errors?.other_training?.[index]?.end_date}
                  helperText={
                    errors?.other_training?.[index]?.end_date?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`other_training.${index}.training_institution`)}
                  label="Training Institution"
                  fullWidth
                  required
                  error={
                    !!errors?.other_training?.[index]?.training_institution
                  }
                  helperText={
                    errors?.other_training?.[index]?.training_institution
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
                  error={
                    !!errors?.other_training?.[index]?.certificates_received
                  }
                  helperText={
                    errors?.other_training?.[index]?.certificates_received
                      ?.message
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register(`other_training.${index}.hours_of_training`)}
                  type="number"
                  label="Hours of Training"
                  fullWidth
                  required
                  error={!!errors?.other_training?.[index]?.hours_of_training}
                  helperText={
                    errors?.other_training?.[index]?.hours_of_training?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register(`other_training.${index}.skills_acquired`)}
                  label="Skills Acquired"
                  fullWidth
                  error={!!errors?.other_training?.[index]?.skills_acquired}
                  helperText={
                    errors?.other_training?.[index]?.skills_acquired?.message
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
                  error={!!errors?.other_training?.[index]?.credential_url}
                  helperText={
                    errors?.other_training?.[index]?.credential_url?.message
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {other_training.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeTrainingHistory(index)}
              >
                Remove Entry
              </Button>
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
        schema={otherTrainingsSchema}
        formData={other_training}
        user_type={user_type}
        api={"other-training"}
      />
    </Box>
  );
};

export default OtherTraining;
