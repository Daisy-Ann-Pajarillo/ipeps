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

const schema = yup.object().shape({
  language_proficiency: yup
    .array()
    .of(
      yup.object().shape({
        language: yup.string().required("Language is required"),
        can_read: yup.boolean().default(false),
        can_write: yup.boolean().default(false),
        can_speak: yup.boolean().default(false),
        can_understand: yup.boolean().default(false),
      }).test(
        "at-least-one-skill",
        "At least one skill (Read, Write, Speak, Understand) must be selected",
        (value) => {
          if (!value) return false;
          return value.can_read || value.can_write || value.can_speak || value.can_understand;
        }
      )
    )
    .min(1, "At least one language is required")
    .required(),
});

const LanguageDialectProficiency = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
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
      language_proficiency: [
        {
          can_read: true,
          can_speak: true,
          can_understand: false,
          can_write: true,
          language: "Filipino"
        },
        {
          can_read: true,
          can_speak: true,
          can_understand: true,
          can_write: true,
          language: "English"
        }
      ],
    }
  });

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState(languagesList);
  const language_proficiency = watch("language_proficiency");

  // Update available languages whenever language_proficiency changes
  useEffect(() => {
    const selectedLanguages = language_proficiency.map(lang => lang.language);
    const filteredLanguages = languagesList.filter(
      lang => !selectedLanguages.includes(lang.name)
    );
    setAvailableLanguages(filteredLanguages);
  }, [language_proficiency]);

  // Add new language proficiency
  const addLanguage = () => {
    if (!selectedLanguage) return;

    const newLangName = selectedLanguage.name;
    const currentLanguages = getValues("language_proficiency");

    // Final check to prevent duplicates
    if (currentLanguages.some((lang) => lang.language === newLangName)) {
      return;
    }

    const newLanguage = {
      language: newLangName,
      can_read: false,
      can_write: false,
      can_speak: false,
      can_understand: false,
    };

    setValue("language_proficiency", [...currentLanguages, newLanguage], {
      shouldValidate: true,
    });
    setSelectedLanguage(null);
  };

  // Remove language proficiency
  const removeLanguage = (languageName) => {
    const updatedLanguages = getValues("language_proficiency").filter(
      (lang) => lang.language !== languageName
    );
    setValue("language_proficiency", updatedLanguages, { shouldValidate: true });
  };

  useEffect(() => {
    setIsValid(language_proficiency.length > 0 && formIsValid);
  }, [formIsValid, setIsValid, language_proficiency]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Language Selection */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={availableLanguages}
            getOptionLabel={(option) => `${option.name} (${option.value})`}
            value={selectedLanguage}
            onChange={(event, newValue) => setSelectedLanguage(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Language" />
            )}
            isOptionEqualToValue={(option, value) => option.name === value?.name}
          />
        </Grid>
      </Grid>

      {/* Added Languages */}
      {language_proficiency.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
            Selected Languages
          </Typography>
          <Grid container spacing={2}>
            {language_proficiency.map((lang, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 1 }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {lang.language}
                  </Typography>

                  <Controller
                    name={`language_proficiency.${index}.can_read`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Read"
                      />
                    )}
                  />
                  <Controller
                    name={`language_proficiency.${index}.can_write`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Write"
                      />
                    )}
                  />
                  <Controller
                    name={`language_proficiency.${index}.can_speak`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Speak"
                      />
                    )}
                  />
                  <Controller
                    name={`language_proficiency.${index}.can_understand`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Understand"
                      />
                    )}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeLanguage(lang.language)}
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
        formData={{ language_proficiency }}
        user_type={user_type}
        api={"language-proficiency"}
      />
    </Box>
  );
};

export default LanguageDialectProficiency;