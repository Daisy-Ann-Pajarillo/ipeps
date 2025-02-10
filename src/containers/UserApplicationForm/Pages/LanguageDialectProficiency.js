import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";

import languagesList from "../../../reusable/constants/languages";
import BackNextButton from "../backnextButton";

// Validation Schema using Yup
const schema = yup.object().shape({
  languages: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Language is required"),
        read: yup.boolean(),
        write: yup.boolean(),
        speak: yup.boolean(),
        understand: yup.boolean(),
      }).test(
        "at-least-one-skill",
        "At least one skill (Read, Write, Speak, Understand) must be selected",
        (value) => value.read || value.write || value.speak || value.understand
      )
    )
    .min(1, "At least one language is required")
    .required()
});


const LanguageDialectProficiency = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type
}) => {
  const {
    setValue,
    getValues,
    watch,
    control,
    formState: { isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      languages: [{
        name: "",
      read: false,
      write: false,
      speak: false,
      understand: false,
      }],
    },
  });

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const languages = watch("languages");

  // Add new language proficiency
  const addLanguage = () => {
    if (!selectedLanguage) return;

    const currentLanguages = getValues("languages");

    // Ensure selectedLanguage is a string
    const newLangName = typeof selectedLanguage === "string" ? selectedLanguage : selectedLanguage?.name;

    // Check if the language is already added
    if (currentLanguages.some((lang) => lang.name === newLangName)) return;

    const newLanguage = {
      name: newLangName,
      read: false,
      write: false,
      speak: false,
      understand: false,
    };

    setValue("languages", [...currentLanguages, newLanguage], { shouldValidate: true });
    setSelectedLanguage(null);
  };

  // Remove language proficiency
  const removeLanguage = (languageName) => {
    const updatedLanguages = getValues("languages").filter((lang) => lang.name !== languageName);
    setValue("languages", updatedLanguages, { shouldValidate: true });
  };

  useEffect(() => {
    setIsValid(languages.length > 0 && formIsValid);
  }, [formIsValid, setIsValid, languages]);

  return (

      <Box sx={{ p: 3 }}>
        {/* Language Selection */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={languagesList}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
              value={selectedLanguage}
              onChange={(event, newValue) => setSelectedLanguage(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Language" />}
            />
          </Grid>
        </Grid>

        {/* Added Languages */}
        {languages.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
              Selected Languages
            </Typography>
            <Grid container spacing={2}>
              {languages.map((lang, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {lang.name}
                    </Typography>

                    <Controller
                      name={`languages.${index}.read`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                          label="Read"
                        />
                      )}
                    />
                    <Controller
                      name={`languages.${index}.write`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                          label="Write"
                        />
                      )}
                    />
                    <Controller
                      name={`languages.${index}.speak`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                          label="Speak"
                        />
                      )}
                    />
                    <Controller
                      name={`languages.${index}.understand`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                          label="Understand"
                        />
                      )}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeLanguage(lang.name)}
                      sx={{ marginTop: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <div className="mb-4 text-center">
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={addLanguage}
            disabled={!selectedLanguage}
          >
            Add Language
          </Button>
        </div>
        {/* Back & Next Buttons */}
        <BackNextButton
          activeStep={activeStep}
          steps={steps}
          handleBack={handleBack}
          handleNext={handleNext}
          isValid={isValid}
          setIsValid={setIsValid}
          schema={schema}
          formData={languages}
          user_type={user_type}
        />
      </Box>

  );
};

export default LanguageDialectProficiency;
