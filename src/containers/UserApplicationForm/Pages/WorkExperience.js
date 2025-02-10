import React, { useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  MenuItem,
  Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BackNextButton from '../backnextButton';

// Yup Validation Schema
const schema = yup.object().shape({
  workExperience: yup
    .array()
    .of(
      yup.object().shape({
        companyName: yup.string().required('Company Name is required'),
        companyAddress: yup.string().required('Company Address is required'),
        position: yup.string().required('Position is required'),
        employmentStatus: yup.string().required('Employment Status is required'),
        dateStart: yup
          .date()
          .required('Start date is required')
          .max(new Date(), 'Start date cannot be in the future'),
        dateEnd: yup
          .date()
          .required('Date End is required')
          .when('dateStart', (dateStart, schema) =>
            dateStart
              ? schema.test(
                  'end-date-after-start',
                  'End date must be after start date',
                  (dateEnd) => !dateEnd || (dateStart && new Date(dateEnd) > new Date(dateStart))
                ).max(new Date(), 'End date cannot be in the future')
              : schema
          )
          .transform((value, originalValue) => (originalValue === '' ? null : value)),
      })
    )
    .min(1, 'At least one work experience entry is required') // Ensure at least one entry exists
    .required('Work Experience is required'), // Ensure the array itself is required
});

const WorkExperience = ({ activeStep, steps, handleBack, handleNext, isValid, setIsValid, user_type }) => {
  // React Hook Form Setup
  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      workExperience: [
        {
          companyName: '',
          companyAddress: '',
          position: '',
          employmentStatus: '',
          dateStart: '',
          dateEnd: '',
        },
      ],
    },
  });

  // Employment Status Options
  const employmentStatusOptions = ['Full-Time', 'Part-Time', 'Contract', 'Freelance'];

  // Watch for changes in the workExperience field
  const workExperience = watch('workExperience');

  // Update Parent Component's Validity State
  useEffect(() => {
    setIsValid(formIsValid && workExperience.length > 0);
  }, [formIsValid, setIsValid, workExperience]);

  // Add Work Experience Entry
  const addWorkExperience = () => {
    const newEntry = {
      companyName: '',
      companyAddress: '',
      position: '',
      employmentStatus: '',
      dateStart: '',
      dateEnd: '',
    };
    const updatedWorkExperience = [...workExperience, newEntry];
    setValue('workExperience', updatedWorkExperience, { shouldValidate: false });
  };

  // Remove Work Experience Entry
  const removeWorkExperience = (index) => {
    const updatedWorkExperience = workExperience.filter((_, idx) => idx !== index);
    setValue('workExperience', updatedWorkExperience, { shouldValidate: true });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body2" gutterBottom color="warning">
        Limit to 10-year period, starting with the most recent employment.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Display Added Work Experience Entries */}
      {workExperience.map((entry, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              error={!!errors?.workExperience?.[index]?.companyName}
              helperText={errors?.workExperience?.[index]?.companyName?.message}
              {...register(`workExperience.${index}.companyName`)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Address"
              error={!!errors?.workExperience?.[index]?.companyAddress}
              helperText={errors?.workExperience?.[index]?.companyAddress?.message}
              {...register(`workExperience.${index}.companyAddress`)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position"
              error={!!errors?.workExperience?.[index]?.position}
              helperText={errors?.workExperience?.[index]?.position?.message}
              {...register(`workExperience.${index}.position`)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Employment Status"
              error={!!errors?.workExperience?.[index]?.employmentStatus}
              helperText={errors?.workExperience?.[index]?.employmentStatus?.message}
              {...register(`workExperience.${index}.employmentStatus`)}
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
              error={!!errors?.workExperience?.[index]?.dateStart}
              helperText={errors?.workExperience?.[index]?.dateStart?.message}
              {...register(`workExperience.${index}.dateStart`)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date End"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors?.workExperience?.[index]?.dateEnd}
              helperText={errors?.workExperience?.[index]?.dateEnd?.message}
              {...register(`workExperience.${index}.dateEnd`)}
            />
          </Grid>
          {workExperience.length > 1 && (
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
        formData={workExperience}
        user_type = {user_type}
      />
    </Box>
  );
};

export default WorkExperience;