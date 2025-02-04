import React, { useEffect, useState } from "react";
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

function Registration(props) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(1);
  const [formData, setFormData] = useState({
    userType: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    loginUsername: "",
    loginPassword: "",
  });
  const [errors, setErrors] = useState({
    login: { error: false, message: "" },
    register: { error: false, message: "" },
  });
  const [success, setSuccess] = useState({
    login: { success: false, message: "" },
    register: { success: false, message: "" },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset errors and success messages
    setErrors({
      login: { error: false, message: "" },
      register: { error: false, message: "" },
    });
    setSuccess({
      login: { success: false, message: "" },
      register: { success: false, message: "" },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateRegistration = () => {
    if (
      !formData.userType ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        register: { error: true, message: "Please fill in all fields" },
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        register: { error: true, message: "Passwords do not match" },
      }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        register: {
          error: true,
          message: "Please enter a valid email address",
        },
      }));
      return false;
    }

    return true;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, register: { error: false, message: "" } }));
    setSuccess((prev) => ({
      ...prev,
      register: { success: false, message: "" },
    }));

    if (!validateRegistration()) return;

    try {
      const registerData = new FormData();
      registerData.append("user_type", formData.userType);
      registerData.append("username", formData.username);
      registerData.append("email", formData.email);
      registerData.append("password", formData.password);

      const response = await axios({
        method: "post",
        url: "/api/user/create-v",
        data: registerData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setSuccess((prev) => ({
        ...prev,
        register: { success: true, message: "Registration successful!" },
      }));

      // Reset form
      setFormData((prev) => ({
        ...prev,
        userType: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        register: {
          error: true,
          message: error.response?.data?.message || "Registration failed",
        },
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, login: { error: false, message: "" } }));
    setSuccess((prev) => ({ ...prev, login: { success: false, message: "" } }));

    if (!formData.loginUsername || !formData.loginPassword) {
      setErrors((prev) => ({
        ...prev,
        login: { error: true, message: "Please fill in all fields" },
      }));
      return;
    }

    props.onAuth(formData.loginUsername, formData.loginPassword);
  };

  useEffect(() => {
    if (props.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [props.isAuthenticated, navigate]);

  return (
    <Box
      className="h-full flex justify-center items-center md:justify-start"
      sx={{
        backgroundImage: `url(${bannerBg})`,
        backgroundSize: "",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        className="rounded-md m-4 px-4 py-3 min-w-[250px] sm:min-w-[350px] max-w-[450px] bg-neutral-100
                md:ml-16 lg:ml-36 xl:ml-48 transition duration-500"
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ marginBottom: "24px" }}
        >
          <Tab label="Register" sx={{ fontSize: "14px" }} />
          <Tab label="Login" sx={{ fontSize: "14px" }} />
        </Tabs>

        {errors.register.error && tabValue === 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.register.message}
          </Alert>
        )}
        {success.register.success && tabValue === 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success.register.message}
          </Alert>
        )}
        {errors.login.error && tabValue === 1 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.login.message}
          </Alert>
        )}
        {success.login.success && tabValue === 1 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success.login.message}
          </Alert>
        )}

        {/* Register Form */}
        {tabValue === 0 && (
          <form
            onSubmit={handleRegisterSubmit}
            className="min-h-[450px] h-full w-full flex flex-col gap-3"
          >
            <FormControl variant="outlined" className="w-full">
              <InputLabel htmlFor="userType" className="bg-neutral-100 px-2">
                Select Role
              </InputLabel>
              <Select
                native
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                inputProps={{
                  id: "userType",
                }}
              >
                <option aria-label="None" value="" />
                <option value="EMPLOYER">EMPLOYER</option>
                <option value="JOBSEEKER">JOBSEEKER</option>
                <option value="ACADEME">ACADEME</option>
                <option value="STUDENT">STUDENT</option>
              </Select>
            </FormControl>

            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
            />

            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            <Button variant="contained" type="submit">
              Register
            </Button>

            <Typography variant="body2">
              Forget password?{" "}
              <Link to="/forgot-password" style={{ color: "#008394" }}>
                Click here
              </Link>
            </Typography>
          </form>
        )}

        {/* Login Form */}
        {tabValue === 1 && (
          <form
            onSubmit={handleLoginSubmit}
            className="min-h-[450px] h-full w-full flex flex-col gap-3"
          >
            <TextField
              name="loginUsername"
              className="m-0"
              label="Username"
              fullWidth
              value={formData.loginUsername}
              sx={{
                marginBottom: "16px",
                "& .MuiInputBase-input": { fontSize: "14px" },
                "& .MuiInputLabel-root": { fontSize: "14px" },
              }}
              onChange={handleInputChange}
            />

            <TextField
              name="loginPassword"
              className="m-0"
              label="Password"
              type="password"
              fullWidth
              value={formData.loginPassword}
              sx={{
                marginBottom: "16px",
                "& .MuiInputBase-input": { fontSize: "14px" },
                "& .MuiInputLabel-root": { fontSize: "14px" },
              }}
              onChange={handleInputChange}
            />

            <Button variant="contained" type="submit">
              Login
            </Button>

            <Typography variant="body2">
              Forget password?{" "}
              <Link to="/forgot-password" style={{ color: "#008394" }}>
                Click here
              </Link>
            </Typography>
          </form>
        )}
      </Box>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  loading: state.auth.loading,
  error: state.auth.error,
  isAuthenticated: state.auth.token !== null ? true : false,
});
const mapDispatchToProps = (dispatch) => ({
  onAuth: (username, password) => dispatch(actions.auth(username, password)),
  onLogout: () => dispatch(actions.logout()),
  // onVerifyCaptcha: (recaptchaValue) => dispatch(actions.verifyCaptcha(recaptchaValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
