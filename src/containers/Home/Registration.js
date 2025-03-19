import React, { useState } from "react";
import { connect } from "react-redux";
import bannerBg from "./images/banner-bg.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import * as actions from "../../store/actions/index";
import {
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  InputLabel,
  Select,
  FormControl,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Registration validation schema using Yup
const registrationSchema = yup.object().shape({
  userType: yup.string().required("Please select a role"),
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .required("Username is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

// Login validation schema using Yup
const loginSchema = yup.object().shape({
  loginUsername: yup.string().required("Username is required"),
  loginPassword: yup.string().required("Password is required"),
});

function Registration(props) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(1);
  const [errors, setErrors] = useState({
    login: { error: false, message: "" },
    register: { error: false, message: "" },
  });
  const [success, setSuccess] = useState({
    login: { success: false, message: "" },
    register: { success: false, message: "" },
  });

  // useForm hook for registration
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegisterForm,
    formState: { errors: registerFormErrors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      userType: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // useForm hook for login
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    reset: resetLoginForm,
    formState: { errors: loginFormErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      loginUsername: "",
      loginPassword: "",
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset errors, success messages, and forms
    setErrors({
      login: { error: false, message: "" },
      register: { error: false, message: "" },
    });
    setSuccess({
      login: { success: false, message: "" },
      register: { success: false, message: "" },
    });

    // Reset forms when switching tabs
    resetRegisterForm();
    resetLoginForm();
  };

  const handleRegisterFormSubmit = async (data) => {
    // Reset previous errors and success messages
    setErrors((prev) => ({ ...prev, register: { error: false, message: "" } }));
    setSuccess((prev) => ({
      ...prev,
      register: { success: false, message: "" },
    }));

    try {
      const registerData = new FormData();
      registerData.append("user_type", data.userType);
      registerData.append("username", data.username);
      registerData.append("email", data.email);
      registerData.append("password", data.password);

      const response = await axios.post("/api/create-user", registerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success handling
      setSuccess((prev) => ({
        ...prev,
        register: {
          success: true,
          message: "Registration successful! Please log in.",
        },
      }));

      // Reset form after successful registration
      resetRegisterForm();

      // Optional: Automatically switch to login tab
      setTabValue(1);
    } catch (error) {
      // Error handling
      setErrors((prev) => ({
        ...prev,
        register: {
          error: true,
          message:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        },
      }));
    }
  };

  const handleLoginFormSubmit = (data) => {
    // Reset previous errors and success messages
    setErrors((prev) => ({ ...prev, login: { error: false, message: "" } }));
    setSuccess((prev) => ({ ...prev, login: { success: false, message: "" } }));

    props.onAuth(data.loginUsername, data.loginPassword);
  };

  return (
    <Box className="rounded-md m-4 px-4 py-3 min-w-[250px] sm:min-w-[350px] max-w-[450px] bg-neutral-100 dark:bg-neutral-800">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: "24px" }}
      >
        <Tab label="Register" sx={{ fontSize: "14px" }} />
        <Tab label="Login" sx={{ fontSize: "14px" }} />
      </Tabs>

      {/* Error and Success Messages */}
      {tabValue === 0 && (
        <>
          {errors.register.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.register.message}
            </Alert>
          )}
          {success.register.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success.register.message}
            </Alert>
          )}
        </>
      )}
      {tabValue === 1 && (
        <>
          {errors.login.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.login.message}
            </Alert>
          )}
          {success.login.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success.login.message}
            </Alert>
          )}
        </>
      )}

      {/* Register Form */}
      {tabValue === 0 && (
        <form
          onSubmit={handleRegisterSubmit(handleRegisterFormSubmit)}
          className="min-h-[450px] h-full w-full flex flex-col gap-3"
        >
          <FormControl
            variant="outlined"
            className="w-full"
            error={!!registerFormErrors.userType}
          >
            <InputLabel
              htmlFor="userType"
              className="bg-neutral-100 dark:bg-neutral-800 px-2"
            >
              Select Role
            </InputLabel>
            <Controller
              name="userType"
              control={registerControl}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    native
                    className="bg-white dark:bg-neutral-700"
                  >
                    <option value="">Select a role</option>
                    <option value="EMPLOYER">EMPLOYER</option>
                    <option value="JOBSEEKER">JOBSEEKER</option>
                    <option value="ACADEME">ACADEME</option>
                    <option value="STUDENT">STUDENT</option>
                  </Select>
                  {registerFormErrors.userType && (
                    <Typography variant="caption" color="error">
                      {registerFormErrors.userType.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </FormControl>

          {/* Username Field */}
          <Controller
            name="username"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!registerFormErrors.username}
                helperText={registerFormErrors.username?.message}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!registerFormErrors.email}
                helperText={registerFormErrors.email?.message}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!registerFormErrors.password}
                helperText={registerFormErrors.password?.message}
              />
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type="password"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!registerFormErrors.confirmPassword}
                helperText={registerFormErrors.confirmPassword?.message}
              />
            )}
          />

          <Button variant="contained" type="submit">
            Register
          </Button>

          <Typography variant="body2">
            Forgot password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 dark:text-blue-400"
            >
              Click here
            </Link>
          </Typography>
        </form>
      )}

      {/* Login Form */}
      {tabValue === 1 && (
        <form
          onSubmit={handleLoginSubmit(handleLoginFormSubmit)}
          className="min-h-[450px] h-full w-full flex flex-col gap-3"
        >
          <Controller
            name="loginUsername"
            control={loginControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!loginFormErrors.loginUsername}
                helperText={loginFormErrors.loginUsername?.message}
              />
            )}
          />

          <Controller
            name="loginPassword"
            control={loginControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                className="bg-white dark:bg-neutral-700"
                error={!!loginFormErrors.loginPassword}
                helperText={loginFormErrors.loginPassword?.message}
              />
            )}
          />

          <Button variant="contained" type="submit">
            Login
          </Button>

          <Typography variant="body2">
            Forgot password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 dark:text-blue-400"
            >
              Click here
            </Link>
          </Typography>
        </form>
      )}
    </Box>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  loading: state.auth.loading,
  error: state.auth.error,
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = (dispatch) => ({
  onAuth: (username, password) => dispatch(actions.auth(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
