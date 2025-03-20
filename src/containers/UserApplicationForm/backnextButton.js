import React, { useEffect } from "react";
import { Button } from "@mui/material";
import axios from "../../axios";

const BackNextButton = ({
  activeStep,
  steps,
  handleBack,
  setIsValid,
  isValid,
  handleNext,
  schema,
  formData,
  canSkip,
  user_type,
  api,
}) => {
  useEffect(() => {
    if (canSkip) {
      setIsValid(true);
      return; // Skip validation if allowed
    }

    const validateForm = async () => {
      try {
        await schema.validate(formData, { abortEarly: false });
        setIsValid(true);
      } catch (error) {
        console.error("Validation errors:", error.errors);
        setIsValid(false);
      }
    };

    validateForm();
  }, [formData, schema, canSkip, setIsValid, activeStep]);

  useEffect(() => {
    if (canSkip) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [activeStep, canSkip, setIsValid]);

  let isConfirmed = false;

  const pushToDataBase = () => {
    if (user_type === "ADMIN") {
      console.log("ADMIN");
      isConfirmed = true;
    } else if (user_type === "EMPLOYER") {
      console.log("EMPLOYER data: ", formData);
      if (api === "personal-info") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-employer-personal-information", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      isConfirmed = true;
    } else if (user_type === "JOBSEEKER" || user_type === "STUDENT") {
      console.log("JOBSEEKER");
      console.log("api: ", api);

      if (api === "personal-info") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-personal-information", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "job-preference") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-job-preference", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "language-proficiency") {
        console.log("Data: ", formData.language_proficiency);
        axios
          .post(
            "/api/add-jobseeker-student-language-proficiency",
            formData.language_proficiency
          )
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "educational-background") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-educational-background", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "educational-background") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-educational-background", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "other-training") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-other-training", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (api === "professional-license") {
        console.log("Data: ", formData.professional_license);
        axios
          .post(
            "/api/add-jobseeker-student-professional-license",
            formData.professional_license
          )
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      if (api === "work-experience") {
        console.log("Data: ", formData.work_experience);
        axios
          .post(
            "/api/add-jobseeker-student-work-experience",
            formData.work_experience
          )
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      if (api === "other-skills") {
        console.log("Data: ", formData);
        axios
          .post("/api/add-jobseeker-student-other-skills", formData)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      isConfirmed = true;
    } else if (user_type === "ACADEME") {
      console.log("ACADEME");
      console.log("Academe Personal Information: ", formData);
      axios
        .post("/api/add-academe-personal-information", formData)
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      isConfirmed = true;
    } else if (user_type === "STUDENT") {
      console.log("STUDENT");
      isConfirmed = true;
    }
    if (isConfirmed) {
      isDone();
    }
  };

  const isDone = () => {
    handleNext();
  };
  return (
    <div className="flex justify-between mt-4">
      <Button
        type="button"
        variant="contained"
        onClick={handleBack}
        disabled={activeStep === 0}
      >
        Back
      </Button>

      {canSkip && (
        <Button
          type="button"
          variant="contained"
          onClick={handleNext} // Skip directly to the next step
        >
          Skip
        </Button>
      )}
      <Button
        type="button"
        variant={isValid ? "contained" : "text"}
        className={isValid ? "" : "text-red-500 pointer-events-none"}
        onClick={() => {
          if (isValid) pushToDataBase();
        }}
      >
        {!isValid
          ? "Please fill all fields with *"
          : activeStep === steps.length - 2
          ? "Finish"
          : "Next"}
      </Button>
    </div>
  );
};

export default BackNextButton;
