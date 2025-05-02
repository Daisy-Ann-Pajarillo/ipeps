import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import * as actions from "../../store/actions/index";
import axios from "../../axios";
import { useSelector, useDispatch } from "react-redux";

// Material-UI Components
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Modal,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom Components
import PersonalInfo from "./Pages/PersonalInfo";
import JobPreference from "./Pages/JobPreference";
import LanguageDialectProficiency from "./Pages/LanguageDialectProficiency";
import EducationalBackground from "./Pages/EducationalBackground";
import OtherTraining from "./Pages/OtherTraining";
import ProfessionalLicense from "./Pages/ProfessionalLicense";
import WorkExperience from "./Pages/WorkExperience";
import OtherSkills from "./Pages/OtherSkills";
import ReviewApplication from "./Pages/ReviewApplication";
import ToggleDarkMode from "../../reusable/components/toggleDarkMode";

const stepsForJobseekers = [
  { label: "Personal Information", component: PersonalInfo },
  { label: "Job Preference", component: JobPreference },
  { label: "Language Proficiency", component: LanguageDialectProficiency },
  { label: "Educational Background", component: EducationalBackground },
  { label: "Other Training", component: OtherTraining },
  { label: "Professional License", component: ProfessionalLicense },
  { label: "Work Experience", component: WorkExperience },
  { label: "Other Skills", component: OtherSkills },
  { label: "Review", component: ReviewApplication },
];

const stepsForEmployer = [
  { label: " ", component: PersonalInfo },
  { label: "Review", component: ReviewApplication },
];

const StyledStepper = styled(Stepper)(({ theme }) => ({
  background: "transparent",
  "& .MuiStepLabel-root": {
    cursor: "pointer",
    color: theme.palette.text.secondary,
    "&:hover": {
      opacity: 0.8,
    },
  },
  "& .MuiStepLabel-active": {
    color: theme.palette.primary.main,
    "& .MuiStepIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.divider,
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: theme.palette.success.main,
  },
}));

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UserApplicationForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [pageData, setPageData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRequestedEmailConfirmation, setUserRequestedEmailConfirmation] = useState(false);
  const [steps, setSteps] = useState([]);
  const [finishedFillUp, setFinishedFillUp] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const clickFrom = queryParams.get("click_from");
  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await props.onGetAuthStorage();
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  // Handle auth data loading
  useEffect(() => {
    if (props.auth && props.auth.user) {
      const userType = props.auth.user.user_type.toUpperCase();

      // Set steps based on user type
      if (userType === "JOBSEEKER" || userType === "STUDENT") {
        setSteps(stepsForJobseekers);
      } else if (userType === "EMPLOYER" || userType === "ACADEME") {
        setSteps(stepsForEmployer);
      } else {
        // Handle unknown user type
        console.warn("Unknown user type:", userType);
        setSteps([]);
      }

      setIsLoading(false);
    }
  }, [props.auth]);

  const userType = props.auth?.user?.user_type?.toUpperCase();
  console.log("Auth data:", userType);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchWorkExperiences = () => {
      axios.get("/api/check-personal-information-status", {
        auth: {
          username: auth.token,
        },
      })
        .then((response) => {
          //console.log("Response from check-personal-information-status:", response.data);
          setFinishedFillUp(response.data.has_personal_info);
        })
        .catch((error) => {
          console.error("Error fetching user work experience:", error);
        });
    };

    fetchWorkExperiences();
  }, []);



  // Handle navigation
  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  // Page data management
  const getPageDataKey = (stepIndex) => {
    const userType = props.auth?.user?.user_type.toUpperCase();
    let pageDataKeys = {};

    if (userType === "JOBSEEKER" || userType === "STUDENT") {
      pageDataKeys = {
        0: "personal_info_page",
        1: "job_preference_page",
        2: "dialect_lang_prof_page",
        3: "edu_background_page",
        4: "other_training_page",
        5: "eligibility_prof_license_page",
        6: "work_experience_page",
        7: "other_skills",
      };
    } else if (userType === "EMPLOYER" || userType === "ACADEME") {
      pageDataKeys = {
        0: "personal_info_page",
      };
    }

    return pageDataKeys[stepIndex];
  };

  // Get current component
  const getCurrentComponent = () => {
    if (steps.length === 0 || !steps[activeStep]) {
      return <Typography>No component available</Typography>;
    }

    const StepComponent = steps[activeStep].component;
    if (!StepComponent) return null;

    return (
      <StepComponent
        pageData={pageData?.[getPageDataKey(activeStep)]}
        isValid={isValid}
        setIsValid={setIsValid}
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        review={steps}
        user_type={props.auth?.user?.user_type.toUpperCase()}
      />
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center">
            <CircularProgress />
            <Typography className="mt-4">Loading user data...</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Email confirmation modal
  if (userRequestedEmailConfirmation) {
    return (
      <Modal
        open={userRequestedEmailConfirmation}
        onClose={() => setUserRequestedEmailConfirmation(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Verification Email Sent
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Please check your inbox and follow the instructions to verify your email.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setUserRequestedEmailConfirmation(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    );
  }

  // Guard against missing steps
  if (!steps || steps.length === 0) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <Typography>No steps available for your user type. Please contact support.</Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/logout"
              className="mt-4"
            >
              {props.backOrExit === "Exit" ? "Exit" : "Log Out"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }



  return (
    <div className="fixed inset-0 flex justify-center items-center gap-2 px-3">
      <ToggleDarkMode className="fixed bottom-0 right-0 z-50" />
      <Container className="max-w-[700px] h-full overflow-y-auto py-5 mx-0 flex flex-col items-start justify-center">
        {clickFrom === "profile" ?
          <div>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard/settings"
            >
              Back
            </Button>
          </div>
          :
          <div className="mb-4 text-left">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/logout"
            >
              Exit
            </Button>
          </div>

        }

        <Card className="overflow-y-scroll w-full">
          <CardHeader
            title={`${steps[activeStep]?.label || "Loading"} (${activeStep + 1}/${steps.length
              })`}
            className="[&_.MuiCardHeader-title]:text-md"
          />
          <CardContent>{getCurrentComponent()}</CardContent>
        </Card>
      </Container>
      <Box className="max-w-64 flex-shrink-0 hidden md:block">
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel onClick={() => { finishedFillUp && handleStepClick(index) }} >{/*/</Step>*/}
                <span className="hidden sm:block">{step.label}</span>
              </StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });
const mapDispatchToProps = (dispatch) => ({
  onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserApplicationForm);