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

const schema = yup.object().shape({
  skills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill must be selected"),
  other_skills: yup
    .array()
    .of(
      yup.object().shape({
        skills: yup.string().required()
      })
    )
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
  const { register, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      skills: [],
      other_skills: [
        { skills: "beautician" },
        { skills: "carpentry" },
        { skills: "embroidery" },
        { skills: "Sample skill" },
        { skills: "auto mechanic" },
        { skills: "gardening" },
        { skills: "Sample" }
      ],
    },
  });

  const skills = watch("skills");
  const other_skills = watch("other_skills");

  // Predefined skills list
  const predefinedSkills = [
    "auto mechanic",
    "beautician",
    "carpentry",
    "computer literate",
    "domestic chores",
    "driver",
    "electrician",
    "embroidery",
    "gardening",
    "masonry",
    "digital artist",
    "painting jobs",
    "photography",
    "plumbing",
    "sewing dresses",
    "stenography",
    "tailoring"
  ];

  const handleSkillChange = (skill) => (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setValue("skills", [...skills, skill], { shouldValidate: true });
    } else {
      setValue(
        "skills",
        skills.filter((selectedSkill) => selectedSkill !== skill),
        { shouldValidate: true }
      );
    }
  };

  const handleAddSkill = () => {
    const newSkill = watch("newSkill")?.trim().toLowerCase();
    if (!newSkill) return;

    // Check if the skill exists in predefined skills
    const existingSkill = predefinedSkills.find(
      skill => skill.toLowerCase() === newSkill
    );

    if (existingSkill) {
      // If skill exists in predefined list, check its checkbox
      if (!skills.includes(existingSkill)) {
        setValue("skills", [...skills, existingSkill], { shouldValidate: true });
      }
    } else {
      // If skill doesn't exist in predefined list, add to other_skills
      const skillExists = other_skills.some(
        item => item.skills.toLowerCase() === newSkill
      );
      
      if (!skillExists && other_skills.length < 50) {
        setValue("other_skills", [...other_skills, { skills: newSkill }], {
          shouldValidate: true,
        });
      }
    }
    setValue("newSkill", "");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setValue(
      "other_skills",
      other_skills.filter((skill) => skill.skills !== skillToRemove),
      { shouldValidate: true }
    );
  };

  // Split predefined skills into columns
  const splitSkills = (skills, columns) => {
    const itemsPerColumn = Math.ceil(skills.length / columns);
    return Array.from({ length: columns }, (_, index) =>
      skills.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)
    );
  };

  const skillColumns = splitSkills(predefinedSkills, 3);

  // Check if a predefined skill is also in other_skills
  const isSkillInOtherSkills = (skill) => {
    return other_skills.some(item => item.skills.toLowerCase() === skill.toLowerCase());
  };

  // Initialize checkboxes based on other_skills
  React.useEffect(() => {
    const initialSkills = other_skills
      .map(item => item.skills)
      .filter(skill => predefinedSkills.includes(skill.toLowerCase()));
    
    if (initialSkills.length > 0) {
      setValue("skills", initialSkills, { shouldValidate: true });
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Your Skills
      </Typography>
      
      <Grid container spacing={3}>
        {skillColumns.map((columnSkills, columnIndex) => (
          <Grid item xs={12} md={4} key={columnIndex}>
            {columnSkills.map((skill) => {
              const formattedLabel = skill
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              return (
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      checked={skills.includes(skill) || isSkillInOtherSkills(skill)}
                      onChange={handleSkillChange(skill)}
                    />
                  }
                  label={formattedLabel}
                />
              );
            })}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, mb: 5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Add other skills..."
              {...register("newSkill")}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              onClick={handleAddSkill}
              disabled={!watch("newSkill")?.trim() || other_skills.length >= 50}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          {other_skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill.skills}
              onDelete={() => handleRemoveSkill(skill.skills)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>

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
        formData={{ skills, other_skills }}
        api="other-skills"
      />
    </Box>
  );
};

export default OtherSkills;