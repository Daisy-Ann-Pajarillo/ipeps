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

const UserApplicationForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [pageData, setPageData] = useState({});
  const [isValid, setIsValid] = useState(false);
  //const [userHasValidEmail, setUserHasValidEmail] = useState(false);
  const [userRequestedEmailConfirmation, setUserRequestedEmailConfirmation] =
    useState(false);

  let steps = [];

  if (props.user_type === "JOBSEEKER" || props.user_type === "STUDENT") {
    steps = stepsForJobseekers;
  } else if (props.user_type === "EMPLOYER" || props.user_type === "ACADEME") {
    steps = stepsForEmployer;
  }

  useEffect(() => {
    onRefresh();
  }, []);

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
    const StepComponent = steps[activeStep].component;
    if (!StepComponent) return null;

    return (
      <StepComponent
        pageData={pageData?.[getPageDataKey(activeStep)]}
        onRefresh={onRefresh}
        isValid={isValid}
        setIsValid={setIsValid}
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        review={steps}
        user_type={props.user_type}
      />
    );
  };

  const getPageDataKey = (stepIndex) => {
    let pageDataKeys = {};

    if (props.user_type === "JOBSEEKER") {
      pageDataKeys = {
        0: "personal_info_page",
        1: "job_preference_page",
        2: "dialect_lang_prof_page",
        3: "edu_background_page",
        4: "other_training_page",
        5: "eligibility_prof_license_page",
        6: "work_experience_page",
        7: "work_experience_page", // For Other Skills
      };
    }
    if (props.user_type === "EMPLOYER") {
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
    <div className="fixed inset-0 flex justify-center items-center gap-2 px-3">
      <Container className=" max-w-[700px] h-full overflow-y-auto py-5 mx-0 flex flex-col items-start justify-center">
        <div className="mb-4 text-left">
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/logout"
          >
            Log Out
          </Button>
        </div>
        <Card className="overflow-y-scroll">
          <CardHeader
            title={`${steps[activeStep].label} (${activeStep + 1}/${
              steps.length
            })`}
            className="[&_.MuiCardHeader-title]:text-md"
          />

          <CardContent>{getCurrentComponent()}</CardContent>
        </Card>
      </Container>
      <Box className="max-w-64 flex-shrink-0 ">
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel onClick={() => handleStepClick(index)}>
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
