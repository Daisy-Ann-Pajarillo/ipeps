import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { languageProficiencySchema } from "../components/schema";
import fetchData from "../api/fetchData";
import axios from "../../../axios";

const LanguageDialectProficiency = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [languageProficiency, setLanguageProficiency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState(languagesList);

  // Fetch user data first
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("api/get-user-info");
        console.log(response.data.language_proficiency);
        setLanguageProficiency(response.data.language_proficiency);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  // Initialize form with default values
  const {
    setValue,
    getValues,
    watch,
    control,
    formState: { isValid: formIsValid },
  } = useForm({
    resolver: yupResolver(languageProficiencySchema),
    mode: "onChange",
    defaultValues: {
      language_proficiency: [], // Default to empty array
    },
  });

  // Watch the language_proficiency field
  const language_proficiency = watch("language_proficiency");

  // Update available languages whenever language_proficiency changes
  useEffect(() => {
    if (!language_proficiency || !Array.isArray(language_proficiency)) return;

    const selectedLanguages = language_proficiency.map((lang) => lang.language);
    const filteredLanguages = languagesList.filter(
      (lang) => !selectedLanguages.includes(lang.name)
    );
    setAvailableLanguages(filteredLanguages);
  }, [language_proficiency]);

  useEffect(() => {
    if (languageProficiency && !loading) {
      setValue("language_proficiency", languageProficiency, {
        shouldValidate: true,
      });
    }
  }, [languageProficiency, loading, setValue]);

  // Add a new language proficiency
  const addLanguage = () => {
    if (!selectedLanguage) return;

    const newLangName = selectedLanguage.name;
    const currentLanguages = getValues("language_proficiency");

    // Final check to prevent duplicates
    if (currentLanguages.some((lang) => lang.language === newLangName)) {
      console.warn(`Language "${newLangName}" already exists.`);
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
    setSelectedLanguage(null); // Reset the selected language
  };

  // Remove a language proficiency
  const removeLanguage = (languageName) => {
    const updatedLanguages = getValues("language_proficiency").filter(
      (lang) => lang.language !== languageName
    );

    setValue("language_proficiency", updatedLanguages, {
      shouldValidate: true,
    });
  };

  // Update the overall validity of the form
  useEffect(() => {
    setIsValid(
      Array.isArray(languageProficiency) &&
        language_proficiency.length > 0 &&
        formIsValid
    );
  }, [formIsValid, language_proficiency]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
              isOptionEqualToValue={(option, value) =>
                option.name === value?.name
              }
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
      </Box>
      
      {/* Back & Next Buttons */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <BackNextButton
          activeStep={activeStep}
          steps={steps}
          handleBack={handleBack}
          handleNext={handleNext}
          isValid={isValid}
          setIsValid={setIsValid}
          schema={languageProficiencySchema}
          formData={{ language_proficiency }}
          user_type={user_type}
          api={"language-proficiency"}
        />
      </Box>
    </Box>
  );
};

export default LanguageDialectProficiency;
