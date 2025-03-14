import React, { useState, useEffect } from "react";
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

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";

import PostedJob from "./PostedJob";
import countriesList from "../../../../../../reusable/constants/countriesList";
import axios from '../../../../../../axios';


//Pop-upModals
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    reset,
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

  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Submit the form data to the backend
  const onSubmit = async (data) => {
    if (data.expiration_date) {
      data.expiration_date = new Date(data.expiration_date)
        .toISOString()
        .split("T")[0];
    }
    try {
      const response = await axios.post("/api/job-postings", data, {
        auth: { username: auth.token },
        headers: {
          "Content-Type": "application/json",

        },
        auth: {
          username: auth.token,
        },
      });
      console.log("Response:", response.data);
      if (response.status === 201) {
        console.log("✅ Job posting created successfully");
        console.log("Response Data:", response.data);

        // Show success toast notification
        toast.success("Job posting created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => window.location.reload(),
        });

        // Reset the form fields to their default values
        reset({
          job_title: "",
          job_type: "",
          experience_level: "",
          job_description: "",
          estimated_salary_from: "",
          estimated_salary_to: "",
          no_of_vacancies: "",
          country: "",
          city_municipality: "",
          expiration_date: "",
          other_skills: "",
          courses: [
            {
              course_name: "",
              training_institution: "",
              certificate_received: "",
            },
          ],
        });

        // Clear the selected country in the Autocomplete
        setSelectedCountry("");
      } else {
        console.warn("⚠️ Unexpected status code:", response.status);

        // Show warning toast notification
        toast.warn(`Unexpected status code: ${response.status}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("❌ Error submitting job posting:", error.message);

      // Show error toast notification
      toast.error("Error submitting job posting!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const [createJobOpen, setCreateJobOpen] = useState(false);

  return (
    <Box
      className={`flex  transition-all justify-center items-center${createJobOpen ? "flex-row" : "w-3/5 flex-col"
        }`}
    >
      <Grid
        className={` h-full flex flex-col ${createJobOpen ? "w-3/5" : "w-full"
          }`}
      >
        <Button
          onClick={() => setCreateJobOpen(!createJobOpen)}
          className="flex items-center justify-center"
        >
          <Typography
            variant="h5"
            className="w-full text-center font-bold py-5"
          >
            Create Job Posting
          </Typography>
        </Button>
        {createJobOpen && (
          <Box className="px-8 pb-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
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
                        helperText={
                          errors.courses?.[index]?.course_name?.message
                        }
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
            <ToastContainer />
          </Box>
        )}
      </Grid>

      <PostedJob createJobOpen={createJobOpen} />
    </Box>
  );
};

export default JobPosting;
