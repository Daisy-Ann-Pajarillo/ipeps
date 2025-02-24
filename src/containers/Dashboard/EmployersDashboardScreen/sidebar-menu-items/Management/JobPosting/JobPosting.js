import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Autocomplete,
} from "@mui/material";

import PostedJob from "./PostedJob";
import countriesList from "../../../../../../reusable/constants/countriesList";

const jobSchema = yup.object().shape({
  job_title: yup.string().required("Job Title is required"),
  job_type: yup.string().required("Job Type is required"),
  experience_level: yup.string().required("Experience Level is required"),
  job_description: yup.string().required("Job Description is required"),
  estimated_salary_from: yup.number().required("Salary From is required"),
  estimated_salary_to: yup.number().required("Salary To is required"),
  no_of_vacancies: yup.number().required("Vacancies are required"),
  country: yup.string().required("Country is required"),
  city_municipality: yup.string().required("City/Municipality is required"),
  expiration_date: yup.date().required("Expiration Date is required"),
  other_skills: yup.string().required("Other Skills are required"),
  courses: yup.array().of(
    yup.object().shape({
      course_name: yup.string().required("Course Name is required"),
      training_institution: yup
        .string()
        .required("Training Institution is required"),
      certificate_received: yup.string().required("Certificate is required"),
    })
  ),
});

const JobPosting = ({ isCollapsed }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      courses: [
        { course_name: "", training_institution: "", certificate_received: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const [selectedCountry, setSelectedCountry] = useState("");

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <Box className="flex transition-all bg-white">
      <Box className="w-3/5 h-full overflow-y-auto p-6 border-r border-gray-200">
        <Typography variant="h5" className="font-bold mb-4">
          Create Job Posting
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="border-b pb-4">
            <Typography variant="h6" className="font-semibold">
              Job Details
            </Typography>
            <Grid item xs={12} md={6} className="my-3">
              <TextField
                label="Job Title"
                {...register("job_title")}
                fullWidth
                error={!!errors.job_title}
                helperText={errors.job_title?.message}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InputLabel>Job Type</InputLabel>
                <Select {...register("job_type")} fullWidth defaultValue="">
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
                {errors.job_type && (
                  <p className="text-red-500 text-sm">
                    {errors.job_type.message}
                  </p>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  {...register("experience_level")}
                  fullWidth
                  defaultValue=""
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Mid">Mid</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                </Select>
                {errors.experience_level && (
                  <p className="text-red-500 text-sm">
                    {errors.experience_level.message}
                  </p>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  {...register("job_description")}
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.job_description}
                  helperText={errors.job_description?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Post Expiration</InputLabel>
                <TextField
                  type="date"
                  {...register("expiration_date")}
                  fullWidth
                  error={!!errors.expiration_date}
                  helperText={errors.expiration_date?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </div>

          <div className="border-b pb-4">
            <Typography variant="h6" className="font-semibold mb-2">
              Salary & Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Estimated Salary From"
                  type="number"
                  {...register("estimated_salary_from")}
                  fullWidth
                  error={!!errors.estimated_salary_from}
                  helperText={errors.estimated_salary_from?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Estimated Salary To"
                  type="number"
                  {...register("estimated_salary_to")}
                  fullWidth
                  error={!!errors.estimated_salary_to}
                  helperText={errors.estimated_salary_to?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={countriesList}
                      value={selectedCountry}
                      onChange={(_, newValue) => {
                        setSelectedCountry(newValue);
                        onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          error={!!errors.country}
                          helperText={errors.country?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City/Municipality"
                  {...register("city_municipality")}
                  fullWidth
                  error={!!errors.city_municipality}
                  helperText={errors.city_municipality?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Number of Vacancies"
                  type="number"
                  {...register("no_of_vacancies")}
                  fullWidth
                  error={!!errors.no_of_vacancies}
                  helperText={errors.no_of_vacancies?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Other Skills"
                  {...register("other_skills")}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.other_skills}
                  helperText={errors.other_skills?.message}
                />
              </Grid>
            </Grid>
          </div>

          <div>
            <Typography variant="h6" className="font-semibold mb-2">
              Technical/Vocational Training
            </Typography>
            {fields.map((course, index) => (
              <Grid container spacing={2} key={course.id} className="mt-3">
                <Grid item xs={4}>
                  <TextField
                    label="Course Name"
                    {...register(`courses.${index}.course_name`)}
                    fullWidth
                    error={!!errors.courses?.[index]?.course_name}
                    helperText={errors.courses?.[index]?.course_name?.message}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Training Institution"
                    {...register(`courses.${index}.training_institution`)}
                    fullWidth
                    error={!!errors.courses?.[index]?.training_institution}
                    helperText={
                      errors.courses?.[index]?.training_institution?.message
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Certificate Received"
                    {...register(`courses.${index}.certificate_received`)}
                    fullWidth
                    error={!!errors.courses?.[index]?.certificate_received}
                    helperText={
                      errors.courses?.[index]?.certificate_received?.message
                    }
                  />
                </Grid>
                <Grid item xs={1} className="flex items-center">
                  {index > 0 && (
                    <button
                      onClick={() => remove(index)}
                      className="text-red-500 font-bold"
                    >
                      x
                    </button>
                  )}
                </Grid>
              </Grid>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({
                  course_name: "",
                  training_institution: "",
                  certificate_received: "",
                })
              }
              variant="outlined"
              className="mt-4"
            >
              Add Course
            </Button>
          </div>

          <Button
            type="submit"
            variant="contained"
            className="mt-5 bg-blue-600 text-white"
            fullWidth
          >
            Create Job Post
          </Button>
        </form>
      </Box>

      <Box className="w-2/5 bg-gray-100 p-6">
        <PostedJob />
      </Box>
    </Box>
  );
};

export default JobPosting;
