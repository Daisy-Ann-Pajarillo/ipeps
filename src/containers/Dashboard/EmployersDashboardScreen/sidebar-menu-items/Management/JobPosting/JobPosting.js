import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Autocomplete,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";

import PostedJob from "./PostedJob";
import countriesList from "../../../../../../reusable/constants/countriesList";
import axios from '../../../../../../axios';
import { useNavigate } from "react-router-dom";

//Pop-upModals
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Updated schema without required courses
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
  tech_voc_training: yup.string(),
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
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [companyStatus, setCompanyStatus] = useState("");
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
          tech_voc_training: "",
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
      toast.error(`Error submitting job posting: ${error.message}`, {
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

  useEffect(() => {
    axios.get('/api/get-company-information', {
      auth: { username: auth.token }
    })
      .then((response) => {
        setCompanyStatus(response.data.company_information.status)
      })
      .catch((error) => {
        console.error('Error data:', error);

      });
  }, []);

  const navigate = useNavigate();

  // Function to handle button click
  const handleButtonClick = () => {

    if (companyStatus === "pending") {
      // Optionally, show a modal or alert instead of immediate redirection
      alert("Your company status is pending. Please complete your company details before posting a job.");
      navigate("/dashboard/manage-employers")
    } else if (companyStatus === "approved") {
      setCreateJobOpen(!createJobOpen);
    }
    else if (companyStatus === "reject") {
      alert("Your company status is rejected. Please contact support for more information.");
      navigate("/dashboard/manage-employers")
    } else {
      alert("Error. Please check your company status.");
      navigate("/dashboard/manage-employers")
    }
  };
  return (
    <Box className="flex flex-col w-full h-full">
      <Grid container className="h-full">
        <Grid item xs={12}>
          <Button
            onClick={handleButtonClick}
            className="flex items-center justify-center w-full"
            sx={{
              backgroundColor: createJobOpen ? "#f44336" : "#1976d2",
              "&:hover": {
                backgroundColor: createJobOpen ? "#d32f2f" : "#115293",
              },
              color: "white",
              py: 1,
              transition: "background-color 0.3s ease", // Smooth hover effect
            }}
            aria-label={companyStatus === "pending" ? "Complete company details" : createJobOpen ? "Cancel job posting" : "Create job posting"}
          >
            <Typography
              variant="h5"
              className="w-full text-center font-bold py-5"
              sx={{ color: "white" }}
            >
              {companyStatus !== "approved" ? (
                companyStatus === "" ? (
                  <>
                    Finish Company Details
                    <br />
                    <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                      You can't post jobs without completing company details.
                    </span>
                  </>
                ) : companyStatus === "pending" ? (
                  <>
                    Wait for Admin Verification
                    <br />
                    <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                      You can't post jobs without admin validation.
                    </span>
                  </>
                ) : (
                  <>
                    Admin rejected your company
                    <br />
                    <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                      You can't post jobs without admin validation.
                    </span>
                  </>
                )
              ) : createJobOpen ? (
                "Cancel Job Posting"
              ) : (
                "Create Job Posting"
              )}
            </Typography>

          </Button>
        </Grid>

        <Grid container className="flex-grow h-[calc(100%-64px)]">
          {createJobOpen ? (
            <Grid item xs={12} className="h-full overflow-y-auto">
              <Box className="px-8 pb-5">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b pb-4">
                    <Typography variant="h6" className="font-semibold">
                      Job Details
                    </Typography>
                    <Grid item xs={12} className="my-3">
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
                        <Controller
                          name="job_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              fullWidth
                              defaultValue=""
                              error={!!errors.job_type}
                            >
                              <MenuItem value="">Select</MenuItem>
                              <MenuItem value="Full-Time">Full-Time</MenuItem>
                              <MenuItem value="Part-Time">Part-Time</MenuItem>
                              <MenuItem value="Internship">Internship</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.job_type && (
                          <p className="text-red-500 text-sm">
                            {errors.job_type.message}
                          </p>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <InputLabel>Experience Level</InputLabel>
                        <Controller
                          name="experience_level"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              fullWidth
                              defaultValue=""
                              error={!!errors.experience_level}
                            >
                              <MenuItem value="">Select</MenuItem>
                              <MenuItem value="Junior">Junior (0-3 years)</MenuItem>
                              <MenuItem value="Mid">Mid (3-5 years)</MenuItem>
                              <MenuItem value="Senior">Senior (5+ years)</MenuItem>
                            </Select>
                          )}
                        />
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
                          minRows={3}
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
                          render={({ field }) => (
                            <Autocomplete
                              options={countriesList}
                              value={field.value || null}
                              onChange={(_, newValue) => {
                                setSelectedCountry(newValue);
                                field.onChange(newValue);
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
                          minRows={2}
                          maxRows={10}
                          error={!!errors.other_skills}
                          helperText={errors.other_skills?.message}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div>
                    <Grid item xs={12}>
                      <TextField
                        label="Technical/Vocational Training"
                        {...register("tech_voc_training")}
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={10}
                        error={!!errors.tech_voc_training}
                        helperText={errors.tech_voc_training?.message}
                      />
                    </Grid>
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
            </Grid>
          ) : (
            <Grid item xs={12} className="h-full">
              <PostedJob createJobOpen={createJobOpen} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobPosting;