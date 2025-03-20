import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import * as actions from "../../store/actions/index";

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
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';

// Import images
import logoImg from '../../containers/Home/images/logonav.png';
import bannerBg from '../../containers/Home/images/banner-bg.png';

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
  { label: "Personal Information", component: PersonalInfo },
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

// Header Component similar to the Home component's header
const Header = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <div className='w-full bg-cyan-800/10 fixed top-0 left-0 right-0 z-10'>
      <Container className='flex justify-between py-3 gap-3 items-center'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoImg}
              alt="IPEPS Logo"
              style={{ width: '50px', height: '50px' }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif',
                color: isDarkMode ? '#FFFFFF' : '#191a20', // Change to white in dark mode
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '24px',
                marginTop: '10px',
              }}
            >
              IPEPS
            </Typography>
          </Box>
        </Box>
        

        {/* Header Text */}
        <Box className='flex flex-col justify-center items-end'>
          <Typography
            className='text-right text-balance text-[12px] md:[15px] font-bold leading-1 opacity-70 sm:opacity-100 sm:leading-none sm:mb-2 sm:text-lg'
          >
            Iloilo Province Employment
            Portal and Services
          </Typography>

          <Typography
            className='text-right text-balance text-[10px] md:text-[13px] leading-none max-w-[250px] sm:max-w-fit opacity-50 hidden sm:block'
          >
            Build career resumes. Explore jobs. Find employment match.
          </Typography>
        </Box>
        

        
        {/* Logout Button
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/logout"
          startIcon={<LogoutIcon />}
          sx={{ ml: 2 }}
        >
          Log Out
        </Button>
         */}

               {/* Logout Button - Absolute positioned in the top right corner */}
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/logout"
          endIcon={<LogoutIcon />}
          sx={{ 
            position: 'absolute',
           // top: '5px',
            right: '20px',
          }}
          size="medium"
        >
          Log Out
        </Button>
      </Container>
    </div>
  );
};

const UserApplicationForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [pageData, setPageData] = useState({});
  const [isValid, setIsValid] = useState(false);
  

  const userType = useSelector((state) => state.user.userType) || "JOBSEEKER"; // Provide a default value
  console.log("userType", userType)
  //const [userHasValidEmail, setUserHasValidEmail] = useState(false);
  const [userRequestedEmailConfirmation, setUserRequestedEmailConfirmation] =
    useState(false);

  let steps = [];

  // Set default steps if userType is undefined
  if (userType === "JOBSEEKER" || userType === "STUDENT") {
    steps = stepsForJobseekers;
  } else if (userType === "EMPLOYER" || userType === "ACADEME") {
    steps = stepsForEmployer;
  } else {
    // Default fallback if userType is undefined
    steps = stepsForJobseekers;
  }

  useEffect(() => {
    onRefresh();
  }, []);
  console.log("sepspssssst", steps)

  const onRefresh = () => {
    props.onGetAuthStorage();
    getAllPageData(props.auth.token);
    //checkIfUserEmailVerified(props.auth.token);
  };

  const getAllPageData = (token) => {
    const url = "/api/user/registration/jobseeker/get-all-pages";
    const authData = {
      auth: {
        username: token,
      },
    };

    axios
      .get(url, authData)
      .then((response) => {
        setPageData(response.data.registration_application);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // const checkIfUserEmailVerified = (token) => {
  //   const url = "/api/check-user-email-validated";
  //   const authData = {
  //     auth: {
  //       username: token,
  //     },
  //   };

  //   axios
  //     .get(url, authData)
  //     .then((response) => {
  //       setUserHasValidEmail(response.data.user_validate_email);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const resendEmailVerification = (token) => {
  //   axios({
  //     method: "post",
  //     url: `/api/request-email-verification`,
  //     headers: { "Content-Type": "multipart/form-data" },
  //     auth: {
  //       username: token,
  //     },
  //   })
  //     .then((response) => {
  //       setUserRequestedEmailConfirmation(response.data.sent);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // };

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    onRefresh();
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    onRefresh();
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
    onRefresh();
  };

  const getCurrentComponent = () => {
    // Ensure activeStep is within bounds
    const safeActiveStep = Math.min(activeStep, steps.length - 1);
    
    // Make sure there's a valid step before trying to access it
    if (!steps || steps.length === 0 || !steps[safeActiveStep]) {
      return <div>Loading application form...</div>;
    }

    const StepComponent = steps[safeActiveStep].component;
    if (!StepComponent) return <div>Component not found</div>;

    return (
      <StepComponent
        pageData={pageData?.[getPageDataKey(safeActiveStep)]}
        onRefresh={onRefresh}
        isValid={isValid}
        setIsValid={setIsValid}
        activeStep={safeActiveStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        review={steps}
        user_type={userType}
      />
    );
  };

  const getPageDataKey = (stepIndex) => {
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
        7: "other_skills", // For Other Skills
      };
    }
    if (userType === "EMPLOYER" || userType === "ACADEME") {
      pageDataKeys = {
        0: "personal_info_page",
        
      };
    }

    return pageDataKeys[stepIndex];
  };

  if (userRequestedEmailConfirmation) {
    return (
      <Modal
        open={userRequestedEmailConfirmation}
        onClose={() => setUserRequestedEmailConfirmation(false)}
      >
        <Card>
          <CardHeader title="Sent verification email" />
          <CardContent>
            <Typography>Please check your inbox</Typography>
          </CardContent>
        </Card>
      </Modal>
    );
  }

  return (
    <>
      <Header />
      {/*positioning for banner-bg only*/}

      <Box
        className="fixed inset-0 flex justify-start items-center px-3,"
        sx={{
          backgroundImage: `url(${bannerBg})`,
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          marginTop: "70px", 
          height: "calc(100vh - 70px)",
          top: "70px", 
          bottom: 0,
          position: "absolute",
        }}
      />

{/*positioning for forms*/}
      <Box
        className="fixed inset-0 flex justify-start items-center px-3,"
        sx={{
          marginTop: "15px", 
          height: "calc(100vh - -30px)",
        }}
      >
        <ToggleDarkMode className={"fixed bottom-0 right-0 z-50"} />
       
        <Container 
          className="w-[900px] max-w-[900px] overflow-hidden py-5 mx-0 flex flex-col items-start justify-center"
          sx={{
            // Adjust this height value to make the form taller or shorter
            height: "calc(100vh - 50px)", // Adjust the value (100px) as needed
          }}
        >
          <Card 
            className="w-full overflow-hidden flex flex-col"
            sx={{
              // Adjust this height value to make the form content taller or shorter
              height: "calc(100vh - 80px)", // Adjust the value (120px) as needed
            }}
          >
            {/* Card header with dark blue background */}
            <CardHeader
              title={steps && steps[activeStep] ? `${steps[activeStep].label} (${activeStep + 1}/${steps.length})` : "Loading..."}
              className="[&_.MuiCardHeader-title]:text-md"
              sx={{
                backgroundColor: 'rgba(39,117,140,255)', 
                color: 'white',
                '& .MuiCardHeader-title': {
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }
              }}
            />
            
            {/* Card content with flex layout to place stepper and form side by side */}
            <CardContent className="flex-1 overflow-hidden p-0 flex">
              {/* Stepper container on the left side */}
              <Box 
                className="w-64 flex-shrink-0"
                sx={{
                  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, )',
                  }}
                >
                  <StyledStepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label || index} completed={index < activeStep}>
                        <StepLabel onClick={() => handleStepClick(index)}>
                          <span className="block">{step.label || "Step"}</span>
                        </StepLabel>
                      </Step>
                    ))}
                  </StyledStepper>
                </Box>
              </Box>
              
              {/* Form content on the right side */}
              <Box className="flex-1 overflow-y-auto">
                <div className="h-full p-4">{getCurrentComponent()}</div>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
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
