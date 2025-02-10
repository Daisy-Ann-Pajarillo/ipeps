import React, { useEffect } from "react";
import { Button } from "@mui/material";


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
  api
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

  let isConfirmed = false

  const pushToDataBase = () => {
    console.log("Submitting form data: ", formData);

    if (user_type === "ADMIN") {
      console.log("ADMIN")
      isConfirmed = true
    } else if (user_type === "EMPLOYER") {
      console.log("EMPLOYER")
      isConfirmed = true
    }
    else if (user_type === "JOBSEEKER" || user_type === "STUDENT") {
      console.log("JOBSEEKER")
      user_type = user_type.toLowerCase();

      if(api === 'personal-info'){
        //axious delete prevouis data
        console.log(`/add/${user_type}/${api}`)
      }
      if(api === 'job-preference'){
        console.log(`/jobseerker-student-${api}`)
       
      }
      isConfirmed = true
    }
    else if (user_type === "ACADEME") {

      console.log("ACADEME")
      isConfirmed = true
    }
    else if (user_type === "STUDENT") {
      console.log("STUDENT")
      isConfirmed = true
    }
    if (isConfirmed) {
      setTimeout(()=>{
        isDone()
      }, 3000)
    }
  };

  const isDone = () => {
    handleNext();
  }
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
        variant="contained"
        onClick={pushToDataBase}
        disabled={!isValid || activeStep === steps.length - 1}
      >
        {activeStep === steps.length - 2 ? "Finish" : "Next"}
      </Button>

    </div>
  );
};


export default BackNextButton;
