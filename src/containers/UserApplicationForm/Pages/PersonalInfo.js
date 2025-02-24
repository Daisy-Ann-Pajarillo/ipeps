import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  TextField,
  Checkbox,
  Grid,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Box,
  Autocomplete,
  Typography,
  Switch,
  Button,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ApplicationDivider from "../components/ApplicationDivider";
import BackNextButton from "../backnextButton";
import completePHAddressOption from "../../../reusable/constants/completePHAddressOption";
import countriesList from "../../../reusable/constants/countriesList";
import religionOption from "../../../reusable/constants/religionOption";
import companyIndustryTypes from "../../../reusable/constants/companyIndustryTypes";

import {
  baseSchema,
  academeSchema,
  employerSchema,
  employerAcademeSchema,
  jobseekerSchema,
} from "../schema/schema";
import validateForm from "../schema/validateForm";
import axios from "../../../axios";

// Dynamic Schema Based on User Type
const getSchema = (userType) => {
  if (userType === "EMPLOYER") {
    baseSchema.concat(employerSchema);
    return baseSchema.concat(employerAcademeSchema);
  } else if (userType === "ACADEME") {
    baseSchema.concat(academeSchema);
    return baseSchema.concat(employerAcademeSchema);
  } else if (userType === "JOBSEEKER" || userType === "STUDENT") {
    return baseSchema.concat(jobseekerSchema);
  }
  return baseSchema;
};

const PersonalInfo = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  isValid,
  setIsValid,
  user_type,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data first
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/get-user-info");

        console.log("Response Data: ", response.data.personal_information[0]);
        setUserInfo(response.data.personal_information[0]);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Create form with a separate reset action after data loads
  const formMethods = useForm({
    resolver: yupResolver(getSchema(user_type)),
    mode: "onChange",
    defaultValues: {}, // Start with empty defaults
  });

  // Use reset when userInfo is available
  useEffect(() => {
    if (userInfo && !loading) {
      formMethods.reset(userInfo); // This sets all values at once
      console.log("Form reset with user data:", userInfo);
    }
  }, [userInfo, loading, formMethods]);

  // Destructure after form is created
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = formMethods;

  const [formErrors, setFormErrors] = useState({});

  const formData = watch();

  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState(null);
  //********** for address
  const [isPermanent, setIsPermanent] = useState(true);
  //********** for temporary address
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  //********** for permanent address
  const [selectedPermanentCountry, setSelectedPermanentCountry] =
    useState(null);
  const [selectedPermanentProvince, setSelectedPermanentProvince] =
    useState(null);
  const [selectedPermanentMunicipality, setSelectedPermanentMunicipality] =
    useState(null);
  const [selectedPermanentBarangay, setSelectedPermanentBarangay] =
    useState(null);
  //**********
  const [selectedReligion, setSelectedReligion] = useState(null);

  const [fileName, setFileName] = useState("");
  //********** for jobseeker
  const [employmentStatus, setEmploymentStatus] = useState(null);
  const [lookingForAWork, setLookingForAWork] = useState(null);
  const [willingToWork, setWillingToWork] = useState(null);

  const [anOfw, setAnOfw] = useState(null);
  const [ofwCountry, setOfwCountry] = useState(null);

  const [formerOfw, setFormerOfw] = useState(null);
  const [formerOfwCountry, setFormerOfwCountry] = useState(null);

  const [fourPs, setFourPs] = useState(null);

  //********** for employer
  const [selectedCompanyClassification, setSelectedCompanyClassification] =
    useState(null);
  const [selectedCompanyIndustry, setSelectedCompanyIndustry] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [selectedCompanyWorkforce, setSelectedCompanyWorkforce] =
    useState(null);

  //********** for academe
  const [selectedInstitutionType, setSelectedInstitutionType] = useState(null);

  const [addressData, setAddressData] = useState({
    provinces: [],
    municipalities: [],
    barangays: [],
    permanentProvinces: [],
    permanentMunicipalities: [],
    permanentBarangays: [],
  });

  // Address helper functions
  const getProvinces = () => {
    return Object.keys(completePHAddressOption)
      .map((regionId) =>
        Object.keys(completePHAddressOption[regionId].province_list)
      )
      .flat();
  };

  const getMunicipalities = (selectedProvince) => {
    if (!selectedProvince) {
      return [];
    }

    const municipalities = Object.values(completePHAddressOption).flatMap(
      (region) => {
        const provinceData = region.province_list?.[selectedProvince];
        if (!provinceData) {
          return [];
        }

        return provinceData.municipality_list.map((municipalityObj) => {
          const municipalityName = Object.keys(municipalityObj)[0];
          return { municipality: municipalityName };
        });
      }
    );

    return municipalities;
  };

  const getBarangays = (selectedMunicipality) => {
    if (!selectedMunicipality) {
      return [];
    }

    let barangays = [];

    Object.values(completePHAddressOption).forEach((region) => {
      Object.values(region.province_list || {}).forEach((province) => {
        province.municipality_list.forEach((municipalityObj) => {
          const municipalityName = Object.keys(municipalityObj)[0];
          if (municipalityName === selectedMunicipality) {
            barangays = municipalityObj[municipalityName].barangay_list;
          }
        });
      });
    });
    return barangays;
  };

  // Address data effect - optimized with conditions
  useEffect(() => {
    // Skip if no address selections yet
    if (
      (!selectedProvince && !selectedPermanentProvince) ||
      (!selectedMunicipality && !selectedPermanentMunicipality)
    )
      return;

    // Get all provinces once
    const provinces = getProvinces();

    // Get data for temporary address
    const municipalities = selectedProvince
      ? getMunicipalities(selectedProvince).map((item) => item.municipality)
      : [];

    const barangays = selectedMunicipality
      ? getBarangays(selectedMunicipality)
      : [];

    // Get data for permanent address
    const permanentMunicipalities = selectedPermanentProvince
      ? getMunicipalities(selectedPermanentProvince).map(
          (item) => item.municipality
        )
      : [];

    const permanentBarangays = selectedPermanentMunicipality
      ? getBarangays(selectedPermanentMunicipality)
      : [];

    setAddressData({
      provinces,
      municipalities,
      barangays,
      permanentProvinces: provinces, // Reuse provinces data
      permanentMunicipalities,
      permanentBarangays,
    });
  }, [
    selectedProvince,
    selectedMunicipality,
    selectedPermanentProvince,
    selectedPermanentMunicipality,
  ]);

  // Form validation and data sync effect
  useEffect(() => {
    // Update validation state
    setIsValid(!Object.keys(errors).length);

    // If formData is available, update all state variables
    if (formData && Object.keys(formData).length > 0) {
      const {
        temporary_country,
        temporary_province,
        temporary_municipality,
        temporary_barangay,
        permanent_country,
        permanent_province,
        permanent_municipality,
        permanent_barangay,
        prefix,
        sex,
        civil_status,
        religion,
        is_permanent,
        employment_status,
        is_looking_for_work,
        is_willing_to_work_immediately,
        is_ofw,
        ofw_country,
        is_former_ofw,
        former_ofw_country,
        is_4ps_beneficiary,
        company_workforce,
        company_industry,
        company_classification,
        company_type,
        institution_type,
      } = formData;

      // Set address-related state
      setIsPermanent(is_permanent);
      setSelectedCountry(temporary_country);
      setSelectedProvince(temporary_province);
      setSelectedMunicipality(temporary_municipality);
      setSelectedBarangay(temporary_barangay);
      setSelectedPermanentCountry(permanent_country);
      setSelectedPermanentProvince(permanent_province);
      setSelectedPermanentMunicipality(permanent_municipality);
      setSelectedPermanentBarangay(permanent_barangay);

      // User type specific state
      if (user_type === "JOBSEEKER" || user_type === "STUDENT") {
        setSelectedPrefix(prefix);
        setSelectedSex(sex);
        setSelectedCivilStatus(civil_status);
        setSelectedReligion(religion);
        setEmploymentStatus(employment_status);
        setLookingForAWork(is_looking_for_work ? "YES" : "NO");
        setWillingToWork(is_willing_to_work_immediately ? "YES" : "NO");
        setAnOfw(is_ofw ? "YES" : "NO");
        setOfwCountry(ofw_country);
        setFormerOfw(is_former_ofw ? "YES" : "NO");
        setFormerOfwCountry(former_ofw_country);
        setFourPs(is_4ps_beneficiary ? "YES" : "NO");
      }

      if (user_type === "EMPLOYER") {
        setSelectedCompanyClassification(company_classification);
        setSelectedCompanyIndustry(company_industry);
        setSelectedCompanyType(company_type);
        setSelectedCompanyWorkforce(company_workforce);
      }

      if (user_type === "ACADEME") {
        setSelectedInstitutionType(institution_type);
      }
    }
  }, [errors, user_type]);

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setFileName(file.name);

      // Set the file value directly through register
      setValue("id", event.target.files, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      validateForm(getSchema(user_type), watch(), setIsValid, setFormErrors);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Prevent rendering until data is ready
  }
  return (
    <Box
      sx={{ p: 3 }}
      onClick={() => {
        validateForm(getSchema(user_type), formData, setIsValid, setFormErrors);
      }}
    >
      <Grid container spacing={2}>
        {/* Basic Information */}
        <>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={["Mr.", "Ms.", "Mrs."]}
              getOptionLabel={(option) => option}
              value={selectedPrefix}
              onChange={(event, newValue) => {
                setSelectedPrefix(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Prefix"
                  variant="outlined"
                  required
                  {...register("prefix")}
                  error={formErrors.prefix}
                  helperText={formErrors.prefix}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="First Name"
              {...register("first_name")}
              error={formErrors.first_name}
              helperText={formErrors.first_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Middle Name"
              {...register("middle_name")}
              error={formErrors.middle_name}
              helperText={formErrors.middle_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Last Name"
              {...register("last_name")}
              error={formErrors.last_name}
              helperText={formErrors.last_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Suffix" {...register("suffix")} />
          </Grid>
        </>
        {/*********************************  EMPLOYER  *********************************/}
        {user_type === "EMPLOYER" && (
          <>
            <ApplicationDivider />
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company / Agency Affiliation"
                {...register("company_name")}
                required
                error={formErrors.company_name}
                helperText={formErrors.company_name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["Private", "Public"]}
                getOptionLabel={(option) => option}
                value={selectedCompanyType}
                onChange={(event, newValue) => {
                  setSelectedCompanyType(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    required
                    {...register("company_type")}
                    error={formErrors.company_type}
                    helperText={formErrors.company_type}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["Local", "Overseas"]}
                getOptionLabel={(option) => option}
                value={selectedCompanyClassification}
                onChange={(event, newValue) => {
                  setSelectedCompanyClassification(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Classification"
                    variant="outlined"
                    required
                    {...register("company_classification")}
                    error={formErrors.company_classification}
                    helperText={formErrors.company_classification}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={companyIndustryTypes}
                getOptionLabel={(option) => option}
                value={selectedCompanyIndustry}
                onChange={(event, newValue) => {
                  setSelectedCompanyIndustry(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Industry"
                    required
                    variant="outlined"
                    {...register("company_industry")}
                    error={formErrors.company_industry}
                    helperText={formErrors.company_industry}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={[
                  "MICRO ENTERPRISE(<10)",
                  "SMALL ENTERPRISE(10 - 50)",
                  "MEDIUM-SIZED ENTERPRISE(51 - 250)",
                  "LARGE ENTERPRISE(>250)",
                ]}
                getOptionLabel={(option) => option}
                value={selectedCompanyWorkforce}
                onChange={(event, newValue) => {
                  setSelectedCompanyWorkforce(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Workforce"
                    variant="outlined"
                    {...register("company_workforce")}
                    error={formErrors.company_workforce}
                    helperText={formErrors.company_workforce}
                  />
                )}
              />
            </Grid>
          </>
        )}
        {user_type === "ACADEME" && (
          <>
            <ApplicationDivider />

            <Grid item xs={12}>
              <TextField
                fullWidth
                value={formData.institution_name}
                label="Institution Name"
                {...register("institution_name")}
                required
                error={formErrors.institution_name}
                helperText={formErrors.institution_name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={[
                  "Public Universities",
                  "Private Universities",
                  "Community Colleges",
                  "Technical Colleges",
                  "Vocational Colleges",
                  "Nursing Schools",
                  "Special Interest Colleges",
                  "Art Colleges",
                ]}
                getOptionLabel={(option) => option}
                value={selectedInstitutionType}
                onChange={(event, newValue) => {
                  setSelectedInstitutionType(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    required
                    {...register("institution_type")}
                    error={formErrors.institution_type}
                    helperText={formErrors.institution_type}
                  />
                )}
              />
            </Grid>
          </>
        )}
        {(user_type === "EMPLOYER" || user_type === "ACADEME") && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                {...register("email")}
                error={formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Employer's Position / Designation"
                {...register("employer_position")}
                error={formErrors.employer_position}
                helperText={formErrors.employer_position}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Employer's ID Number"
                {...register("employer_id_number")}
                error={formErrors.employer_id_number}
                helperText={formErrors.employer_id_number}
              />
            </Grid>
          </>
        )}
        {/*********************************  JOBSEEKER *** STUDENT  *********************************/}
        {(user_type === "JOBSEEKER" || user_type === "STUDENT") && (
          <>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["Male", "Female"]}
                getOptionLabel={(option) => option}
                value={selectedSex}
                onChange={(event, newValue) => {
                  setSelectedSex(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sex"
                    variant="outlined"
                    required
                    {...register("sex")}
                    error={formErrors.sex}
                    helperText={formErrors.sex}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Date of Birth"
                type="date"
                {...register("date_of_birth")}
                InputLabelProps={{ shrink: true }}
                error={formErrors.date_of_birth}
                helperText={formErrors.date_of_birth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Place of Birth"
                {...register("place_of_birth")}
                error={formErrors.place_of_birth}
                helperText={formErrors.place_of_birth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["Single", "Married", "Divorced", "Widowed"]}
                getOptionLabel={(option) => option}
                value={selectedCivilStatus}
                onChange={(event, newValue) => {
                  setSelectedCivilStatus(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Civil Status"
                    variant="outlined"
                    required
                    {...register("civil_status")}
                    error={formErrors.civil_status}
                    helperText={formErrors.civil_status}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Height (cm)"
                {...register("height")}
                error={formErrors.height}
                helperText={formErrors.height}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Weight (kg)"
                {...register("weight")}
                error={formErrors.weight}
                helperText={formErrors.weight}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={religionOption}
                getOptionLabel={(option) => option}
                value={selectedReligion}
                onChange={(event, newValue) => {
                  setSelectedReligion(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Religion"
                    variant="outlined"
                    {...register("religion")}
                    error={formErrors.religion}
                    helperText={formErrors.religion}
                  />
                )}
              />
            </Grid>
          </>
        )}
        <ApplicationDivider />
        {/*********************************  Address *********************************/}
        <>
          {/* Switch */}
          <Grid item xs={12} sx={{ display: "flex", justifyItems: "center" }}>
            <label>
              {!isPermanent ? "Temporary Address" : "Permanent Address"}
              <Switch
                {...register("permanent")}
                checked={isPermanent}
                onChange={() => {
                  setIsPermanent((val) => !val);
                }}
                color="primary"
              />
            </label>
          </Grid>
          {/* Temporary Address */}
          <>
            {!isPermanent && (
              <>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={countriesList}
                    getOptionLabel={(option) => option}
                    value={selectedCountry}
                    onChange={(event, newValue) => {
                      setSelectedCountry(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("temporary_country")}
                        {...params}
                        required
                        label="Country"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={addressData.provinces}
                    getOptionLabel={(option) => option}
                    value={selectedProvince}
                    onChange={(event, newValue) => {
                      setSelectedProvince(newValue);
                      setSelectedMunicipality(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required={selectedCountry === "Philippines"}
                        {...register("temporary_province")}
                        {...params}
                        label="Province"
                      />
                    )}
                    disabled={selectedCountry !== "Philippines"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={addressData.municipalities}
                    getOptionLabel={(option) => option}
                    value={selectedMunicipality}
                    onChange={(event, newValue) =>
                      setSelectedMunicipality(newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...register("temporary_municipality")}
                        required={selectedProvince}
                        {...params}
                        label="Municipality"
                      />
                    )}
                    disabled={!selectedProvince} // Disable if no province is selected
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required={selectedMunicipality}
                    disabled={!selectedMunicipality}
                    label="Zip Code"
                    {...register("temporary_zip_code")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={addressData.barangays}
                    getOptionLabel={(option) => option || ""}
                    value={selectedBarangay}
                    onChange={(event, newValue) =>
                      setSelectedBarangay(newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...register("temporary_barangay")}
                        required={selectedMunicipality}
                        {...params}
                        label="Barangay"
                      />
                    )}
                    disabled={!selectedMunicipality} // Disable if no province is selected
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formData.temporary_house_no_street_village}
                    disabled={!selectedMunicipality}
                    label="House No./Street Village"
                    {...register("temporary_house_no_street_village")}
                  />
                </Grid>
              </>
            )}
          </>
          {/* Permanent Address */}
          <>
            <Grid item xs={12}>
              <Typography>{!isPermanent && "Permanent Address"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={countriesList}
                getOptionLabel={(option) => option}
                value={selectedPermanentCountry}
                onChange={(event, newValue) => {
                  setSelectedPermanentCountry(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...register("permanent_country")}
                    {...params}
                    required
                    label="Country"
                    error={formErrors.permanent_country}
                    helperText={formErrors.permanent_country}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={addressData.permanentProvinces}
                getOptionLabel={(option) => option}
                value={selectedPermanentProvince}
                onChange={(event, newValue) => {
                  setSelectedPermanentProvince(newValue);
                  setSelectedPermanentMunicipality(null);
                }}
                renderInput={(params) => (
                  <TextField
                    required={selectedPermanentCountry === "Philippines"}
                    {...register("permanent_province")}
                    {...params}
                    label="Province"
                    error={formErrors.permanent_province}
                    helperText={formErrors.permanent_province}
                  />
                )}
                disabled={selectedPermanentCountry !== "Philippines"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={addressData.permanentMunicipalities}
                getOptionLabel={(option) => option}
                value={selectedPermanentMunicipality}
                onChange={(event, newValue) =>
                  setSelectedPermanentMunicipality(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...register("permanent_municipality")}
                    required={selectedPermanentProvince}
                    {...params}
                    label="Municipality"
                    error={formErrors.permanent_municipality}
                    helperText={formErrors.permanent_municipality}
                  />
                )}
                disabled={!selectedPermanentProvince} // Disable if no province is selected
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required={selectedPermanentMunicipality}
                disabled={!selectedPermanentMunicipality}
                label="Zip Code"
                {...register("permanent_zip_code")}
                error={formErrors.permanent_zip_code}
                helperText={formErrors.permanent_zip_code}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={addressData.permanentBarangays}
                getOptionLabel={(option) => option || ""}
                value={selectedPermanentBarangay}
                onChange={(event, newValue) =>
                  setSelectedPermanentBarangay(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...register("permanent_barangay")}
                    required={selectedPermanentMunicipality}
                    {...params}
                    error={formErrors.permanent_barangay}
                    helperText={formErrors.permanent_barangay}
                    label="Barangay"
                  />
                )}
                disabled={!selectedPermanentMunicipality} // Disable if no province is selected
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={formData.permanent_house_no_street_village}
                disabled={!selectedPermanentMunicipality}
                label="House No./Street Village"
                error={formErrors.permanent_house_no_street_village}
                helperText={formErrors.permanent_house_no_street_village}
                {...register("permanent_house_no_street_village")}
              />
            </Grid>
          </>
        </>
        <ApplicationDivider />
        {/* Contact Number  */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Cellphone Number"
            {...register("cellphone_number")}
            error={formErrors.cellphone_number}
            helperText={formErrors.cellphone_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Landline Number"
            {...register("landline_number")}
            error={formErrors.landline_number}
            helperText={formErrors.landline_number}
          />
        </Grid>
        {/* Employer-Specific Fields */}
        {(user_type === "JOBSEEKER" || user_type === "STUDENT") && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="TIN"
                {...register("tin")}
                error={formErrors.tin}
                helperText={formErrors.tin}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="SSS/GSIS Number"
                {...register("sss_gsis_number")}
                error={formErrors.sss_gsis_number}
                helperText={formErrors.sss_gsis_number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Pag-IBIG Number"
                {...register("pag_ibig_number")}
                error={formErrors.pag_ibig_number}
                helperText={formErrors.pag_ibig_number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="PhilHealth Number"
                {...register("phil_health_no")}
                error={formErrors.phil_health_no}
                helperText={formErrors.phil_health_no}
              />
            </Grid>

            <ApplicationDivider />

            {/* Disabilities Section */}
            <Grid item xs={12}>
              <FormLabel>Disability</FormLabel>
              <FormGroup row>
                {["visual", "hearing", "speech", "physical"].map((key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        {...register(`disability.${key}`)}
                        checked={formData.disability?.[key] || false}
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </FormGroup>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Other Disabilities"
                {...register("other_disabilities")}
                value={formData.other_disabilities || ""}
              />
            </Grid> */}

            <ApplicationDivider />

            <Grid item xs={12}>
              <Autocomplete
                options={["Employed", "Unemployed", "Self-Employed"]}
                getOptionLabel={(option) => option}
                value={employmentStatus}
                onChange={(event, newValue) => {
                  setEmploymentStatus(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employment Status"
                    variant="outlined"
                    required
                    {...register("employment_status")}
                    error={formErrors.employment_status}
                    helperText={formErrors.employment_status}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["YES", "NO"]}
                getOptionLabel={(option) => option}
                value={lookingForAWork}
                onChange={(event, newValue) => {
                  setLookingForAWork(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Looking for a work?"
                    variant="outlined"
                    required
                    {...register("is_looking_for_work")}
                    error={formErrors.is_looking_for_work}
                    helperText={formErrors.is_looking_for_work}
                  />
                )}
              />
            </Grid>
            {lookingForAWork === "YES" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Since when?"
                  type="date"
                  {...register("since_when_looking_for_work")}
                  required={lookingForAWork === "YES"}
                  InputLabelProps={{ shrink: true }}
                  error={formErrors.since_when_looking_for_work}
                  helperText={formErrors.since_when_looking_for_work}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={["YES", "NO"]}
                getOptionLabel={(option) => option}
                value={willingToWork}
                onChange={(event, newValue) => {
                  setWillingToWork(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wiling to work immediately?"
                    variant="outlined"
                    required
                    {...register("is_willing_to_work_immediately")}
                    error={formErrors.is_willing_to_work_immediately}
                    helperText={formErrors.is_willing_to_work_immediately}
                  />
                )}
              />
            </Grid>

            <ApplicationDivider />
            {/*  ofw */}
            <Grid
              item
              xs={12}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Grid item xs={12}>
                <Autocomplete
                  options={["YES", "NO"]}
                  getOptionLabel={(option) => option}
                  value={anOfw}
                  onChange={(event, newValue) => {
                    setAnOfw(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Are you an OFW?"
                      variant="outlined"
                      required
                      {...register("is_ofw")}
                      error={formErrors.is_ofw}
                      helperText={formErrors.is_ofw}
                    />
                  )}
                />
              </Grid>
              {anOfw === "YES" && (
                <Grid item xs={12}>
                  <Autocomplete
                    options={countriesList}
                    getOptionLabel={(option) => option}
                    value={ofwCountry}
                    onChange={(event, newValue) => {
                      setOfwCountry(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("ofw_country")}
                        {...params}
                        label="Specify Country"
                        required={anOfw === "YES"}
                        error={formErrors.ofw_country}
                        helperText={formErrors.ofw_country}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
            {/* former ofw */}
            <Grid
              item
              xs={12}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Grid item xs={12}>
                <Autocomplete
                  options={["YES", "NO"]}
                  getOptionLabel={(option) => option}
                  value={formerOfw}
                  onChange={(event, newValue) => {
                    setFormerOfw(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Are you a Former OFW?"
                      variant="outlined"
                      {...register("is_former_ofw")}
                      required
                      error={formErrors.is_former_ofw}
                      helperText={formErrors.is_former_ofw}
                    />
                  )}
                />
              </Grid>
              {formerOfw === "YES" && (
                <>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={countriesList}
                      getOptionLabel={(option) => option}
                      value={formerOfwCountry}
                      onChange={(event, newValue) => {
                        setFormerOfwCountry(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...register("former_ofw_country")}
                          {...params}
                          required={formerOfw === "YES"}
                          label="Previous Country of Deployment"
                          error={formErrors.former_ofw_country}
                          helperText={formErrors.former_ofw_country}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required={formerOfw === "YES"}
                      label="Date of return to Philippines"
                      type="date"
                      {...register("former_ofw_country_date_return")}
                      InputLabelProps={{ shrink: true }}
                      error={formErrors.former_ofw_country_date_return}
                      helperText={formErrors.former_ofw_country_date_return}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <ApplicationDivider />
            {/* 4ps */}
            <Grid item xs={12}>
              <Autocomplete
                options={["YES", "NO"]}
                getOptionLabel={(option) => option}
                value={fourPs}
                onChange={(event, newValue) => {
                  setFourPs(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Are you a 4P's Beneficiary?"
                    variant="outlined"
                    required
                    {...register("is_4ps_beneficiary")}
                    error={formErrors.is_4ps_beneficiary}
                    helperText={formErrors.is_4ps_beneficiary}
                  />
                )}
              />
            </Grid>
            {fourPs === "YES" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required={fourPs === "YES"}
                  label="Household ID no."
                  {...register("_4ps_household_id_no")}
                  error={formErrors._4ps_household_id_no}
                  helperText={formErrors._4ps_household_id_no}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>

      <ApplicationDivider />
      {/* File Upload */}
      <Grid item xs={12}>
        <input
          type="file"
          id="id"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="id">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Valid ID
          </Button>
        </label>
        {fileName && (
          <Typography variant="body2">Selected file: {fileName}</Typography>
        )}
        {formErrors.id && (
          <FormHelperText error>{formErrors.id}</FormHelperText>
        )}
      </Grid>
      <BackNextButton
        activeStep={activeStep}
        steps={steps}
        handleBack={handleBack}
        handleNext={handleNext}
        isValid={isValid}
        setIsValid={setIsValid}
        schema={getSchema(user_type)}
        formData={formData}
        user_type={user_type}
        api="personal-info"
      />
    </Box>
  );
};

export default PersonalInfo;
