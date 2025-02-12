import React from "react";
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BackNextButton from "../backnextButton";

// Yup Validation Schema
const schema = yup.object().shape({
  skills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill must be selected"),
  otherSkills: yup
    .array()
    .of(yup.string())
    .max(50, "Maximum 50 additional skills allowed"),
});

const OtherSkills = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  // React Hook Form Setup
  const { register, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      skills: [],
      otherSkills: [],
    },
  });

  // Watch for changes in form values
  const skills = watch("skills");
  const otherSkills = watch("otherSkills");

  // Handle checkbox changes
  const handleSkillChange = (skill) => (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the skill to the array if checked
      setValue("skills", [...skills, skill], { shouldValidate: true });
    } else {
      // Remove the skill from the array if unchecked
      setValue(
        "skills",
        skills.filter((selectedSkill) => selectedSkill !== skill),
        { shouldValidate: true }
      );
    }
  };

  // Add a new skill
  const handleAddSkill = () => {
    const newSkill = watch("newSkill"); // Get the value of the "newSkill" field
    if (newSkill !== "" && otherSkills.length < 50) {
      setValue("otherSkills", [...otherSkills, newSkill], {
        shouldValidate: true,
      });
      setValue("newSkill", ""); // Clear the input field
    }
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove) => {
    setValue(
      "otherSkills",
      otherSkills.filter((skill) => skill !== skillToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Skills Section */}
      <Typography variant="h6" gutterBottom>
        Select Your Skills
      </Typography>
      <Grid container spacing={3}>
        {/* First Column */}
        <Grid item xs={12} md={4}>
          {[
            "auto mechanic",
            "beautician",
            "carpentry",
            "computer literate",
            "domestic chores",
            "driver",
          ].map((skill) => {
            const formattedLabel = skill
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={skills.includes(skill)}
                    onChange={handleSkillChange(skill)}
                  />
                }
                label={formattedLabel}
              />
            );
          })}
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} md={4}>
          {[
            "electrician",
            "embroidery",
            "gardening",
            "masonry",
            "digital artist",
            "painting jobs",
          ].map((skill) => {
            const formattedLabel = skill
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={skills.includes(skill)}
                    onChange={handleSkillChange(skill)}
                  />
                }
                label={formattedLabel}
              />
            );
          })}
        </Grid>

        <Grid item xs={12} md={4}>
          {[
            "photography",
            "plumbing",
            "sewing dresses",
            "stenography",
            "tailoring",
          ].map((skill) => {
            const formattedLabel = skill
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={skills.includes(skill)}
                    onChange={handleSkillChange(skill)}
                  />
                }
                label={formattedLabel}
              />
            );
          })}
        </Grid>
      </Grid>

      {/* Additional Skills Section */}
      <Box sx={{ mt: 3, mb: 5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Add other skills..."
              {...register("newSkill")}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              onClick={handleAddSkill}
              disabled={watch("newSkill") === "" || otherSkills.length >= 50}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {/* Display Added Skills */}
        <Box sx={{ mt: 2 }}>
          {otherSkills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleRemoveSkill(skill)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        schema={schema}
        canSkip={true}
        user_type={user_type}
        formData={[...skills, ...otherSkills]} // Combine skills and otherSkills for submission
        api={"other-skills"}
      />
    </Box>
  );
};

export default OtherSkills;
