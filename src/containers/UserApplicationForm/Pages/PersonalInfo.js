import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../store/actions/index";

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
  Paper,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

import ApplicationDivider from "../components/ApplicationDivider";
import BackNextButton from "../backnextButton";
import countriesList from "../../../reusable/constants/countriesList";
import religionOption from "../../../reusable/constants/religionOption";
import companyIndustryTypes from "../../../reusable/constants/companyIndustryTypes";
import determineChangedFields from "../components/determineChangedFields";
import {
  getBarangays,
  getMunicipalities,
  getProvinces,
} from "../components/getSpecificAddress";

import {
  baseSchema,
  academeSchema,
  employerSchema,
  employerAcademeSchema,
  jobseekerSchema,
} from "../components/schema";
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

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch user data first
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/get-user-info", {
          auth: {
            username: auth.token,
          },
        });

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
    trigger,
    formState: { errors },
    watch,
  } = formMethods;

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

  // Get provinces once on component mount
  useEffect(() => {
    const provinces = getProvinces();
    setAddressData((prevData) => ({
      ...prevData,
      provinces,
      permanentProvinces: provinces, // Same data for both
    }));
  }, []); // Empty dependency array - run once

  // Handle municipality changes for temporary address
  useEffect(() => {
    if (!selectedProvince) return;

    const municipalities = getMunicipalities(selectedProvince).map(
      (item) => item.municipality
    );

    setAddressData((prevData) => ({
      ...prevData,
      municipalities,
      // Clear barangays when province changes
      ...(prevData.municipalities !== municipalities && { barangays: [] }),
    }));
  }, [selectedProvince]);

  // Handle barangay changes for temporary address
  useEffect(() => {
    if (!selectedMunicipality) return;

    const barangays = getBarangays(selectedMunicipality);

    setAddressData((prevData) => ({
      ...prevData,
      barangays,
    }));
  }, [selectedMunicipality]);

  // Handle municipality changes for permanent address
  useEffect(() => {
    if (!selectedPermanentProvince) return;

    const permanentMunicipalities = getMunicipalities(
      selectedPermanentProvince
    ).map((item) => item.municipality);

    setAddressData((prevData) => ({
      ...prevData,
      permanentMunicipalities,
      // Clear barangays when province changes
      ...(prevData.permanentMunicipalities !== permanentMunicipalities && {
        permanentBarangays: [],
      }),
    }));
  }, [selectedPermanentProvince]);

  // Handle barangay changes for permanent address
  useEffect(() => {
    if (!selectedPermanentMunicipality) return;

    const permanentBarangays = getBarangays(selectedPermanentMunicipality);

    setAddressData((prevData) => ({
      ...prevData,
      permanentBarangays,
    }));
  }, [selectedPermanentMunicipality]);

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
        setLookingForAWork(is_looking_for_work !== "" ? (is_looking_for_work ? "YES" : "NO") : "");
        setWillingToWork(is_willing_to_work_immediately !== "" ? (is_willing_to_work_immediately ? "YES" : "NO") : "");
        setAnOfw(is_ofw !== "" ? (is_ofw ? "YES" : "NO") : "");
        setOfwCountry(ofw_country);
        setFormerOfw(is_former_ofw !== "" ? (is_former_ofw ? "YES" : "NO") : "");
        setFormerOfwCountry(former_ofw_country);
        setFourPs(is_4ps_beneficiary !== "" ? (is_4ps_beneficiary ? "YES" : "NO") : "");
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
    }
  };

  const prevFormDataRef = useRef({ ...formData });
  useEffect(() => {
    // Determine which fields have changed
    const changedFields = determineChangedFields(
      prevFormDataRef.current,
      formData
    );

    // Only trigger validation for fields that changed
    if (changedFields.length > 0) {
      trigger(changedFields);
    }

    // Update the ref with current formData for next comparison
    prevFormDataRef.current = { ...formData };
  }, [formData, trigger]);

  if (loading) {
    return <p>Loading...</p>; // Prevent rendering until data is ready
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {(user_type === "ACADEME" || user_type === "EMPLOYER") && (
          <Grid item xs={12}>
            <h1><b>{user_type.toLowerCase().replace(/^./, user_type[0].toUpperCase())}</b></h1>
          </Grid>
        )}
        {user_type === "ACADEME" && (
          <>

            <Grid item xs={12}>
              <TextField
                fullWidth
                value={formData.institution_name}
                label="Institution Name"
                {...register("institution_name")}
                required
                error={!!errors?.institution_name}
                helperText={errors?.institution_name?.message}
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
                    error={!!errors?.institution_type}
                    helperText={errors?.institution_type?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
        {/*********************************  EMPLOYER  *********************************/}
        {user_type === "EMPLOYER" && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company / Agency Affiliation"
                {...register("company_name")}
                required
                error={!!errors?.company_name}
                helperText={errors?.company_name?.message}
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
                    error={!!errors?.company_type}
                    helperText={errors?.company_type?.message}
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
                    error={!!errors?.company_classification}
                    helperText={errors?.company_classification?.message}
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
                    error={!!errors?.company_industry}
                    helperText={errors?.company_industry?.message}
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
                    error={!!errors?.company_workforce}
                    helperText={errors?.company_workforce?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
        <ApplicationDivider />
        {(user_type === "EMPLOYER" || user_type === "ACADEME") && (
          <>
            <Grid item xs={12}>
              <h1><b>Address</b></h1>
            </Grid>
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
                            error={!!errors?.temporary_country}
                            helperText={errors?.temporary_country?.message}
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
                            error={!!errors?.temporary_province}
                            helperText={errors?.temporary_province?.message}
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
                            error={!!errors?.temporary_municipality}
                            helperText={errors?.temporary_municipality?.message}
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
                        error={!!errors?.temporary_zip_code}
                        helperText={errors?.temporary_zip_code?.message}
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
                            error={!!errors?.temporary_barangay}
                            helperText={errors?.temporary_barangay?.message}
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
                      if (newValue !== "Philippines") {
                        setSelectedPermanentProvince(null);
                        setSelectedPermanentMunicipality(null);
                        setSelectedPermanentBarangay(null);
                        setValue("permanent_zip_code", null);
                        setValue("permanent_house_no_street_village", null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("permanent_country")}
                        {...params}
                        required
                        label="Country"
                        error={!!errors?.permanent_country}
                        helperText={errors?.permanent_country?.message}
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
                      setSelectedPermanentBarangay(null);
                      setValue("permanent_zip_code", null);
                      setValue("permanent_house_no_street_village", null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required={selectedPermanentCountry === "Philippines"}
                        {...register("permanent_province")}
                        {...params}
                        label="Province"
                        error={!!errors?.permanent_province}
                        helperText={errors?.permanent_province?.message}
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
                    onChange={(event, newValue) => {
                      setSelectedPermanentMunicipality(newValue);
                      setSelectedPermanentBarangay(null);
                      setValue("permanent_zip_code", null);
                      setValue("permanent_house_no_street_village", null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("permanent_municipality")}
                        required={selectedPermanentProvince}
                        {...params}
                        label="Municipality"
                        error={!!errors?.permanent_municipality}
                        helperText={errors?.permanent_municipality?.message}
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
                    error={!!errors?.permanent_zip_code}
                    helperText={errors?.permanent_zip_code?.message}
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
                        error={!!errors?.permanent_barangay}
                        helperText={errors?.permanent_barangay?.message}
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
                    error={!!errors?.permanent_house_no_street_village}
                    helperText={errors?.permanent_house_no_street_village?.message}
                    {...register("permanent_house_no_street_village")}
                  />
                </Grid>
              </>
            </>
          </>
        )}
        <ApplicationDivider />
        {/* Basic Information */}
        <>
          <Grid item xs={12}>
            {(user_type === "EMPLOYER" || user_type === "ACADEME") && (

              <h1><b>Point of Contact</b></h1>
            )}
          </Grid>
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
                  error={!!errors?.prefix}
                  helperText={errors?.prefix?.message}
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
              error={!!errors?.first_name}
              helperText={errors?.first_name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Middle Name"
              {...register("middle_name")}
              error={!!errors?.middle_name}
              helperText={errors?.middle_name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Last Name"
              {...register("last_name")}
              error={!!errors?.last_name}
              helperText={errors?.last_name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Suffix" {...register("suffix")} />
          </Grid>
        </>


        {/*********************************  JOBSEEKER *** STUDENT  *********************************/}
        {(user_type === "JOBSEEKER" || user_type === "STUDENT") && (
          <>
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
                      error={!!errors?.sex}
                      helperText={errors?.sex?.message}
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
                  error={!!errors?.date_of_birth}
                  helperText={errors?.date_of_birth?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Place of Birth"
                  {...register("place_of_birth")}
                  error={!!errors?.place_of_birth}
                  helperText={errors?.place_of_birth?.message}
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
                      error={!!errors?.civil_status}
                      helperText={errors?.civil_status?.message}
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
                  error={!!errors?.height}
                  helperText={errors?.height?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Weight (kg)"
                  {...register("weight")}
                  error={!!errors?.weight}
                  helperText={errors?.weight?.message}
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
                      error={!!errors?.religion}
                      helperText={errors?.religion?.message}
                    />
                  )}
                />
              </Grid>
            </>
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
                            error={!!errors?.temporary_country}
                            helperText={errors?.temporary_country?.message}
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
                            error={!!errors?.temporary_province}
                            helperText={errors?.temporary_province?.message}
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
                            error={!!errors?.temporary_municipality}
                            helperText={errors?.temporary_municipality?.message}
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
                        error={!!errors?.temporary_zip_code}
                        helperText={errors?.temporary_zip_code?.message}
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
                            error={!!errors?.temporary_barangay}
                            helperText={errors?.temporary_barangay?.message}
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
                      if (newValue !== "Philippines") {
                        setSelectedPermanentProvince(null);
                        setSelectedPermanentMunicipality(null);
                        setSelectedPermanentBarangay(null);
                        setValue("permanent_zip_code", null);
                        setValue("permanent_house_no_street_village", null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("permanent_country")}
                        {...params}
                        required
                        label="Country"
                        error={!!errors?.permanent_country}
                        helperText={errors?.permanent_country?.message}
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
                      setSelectedPermanentBarangay(null);
                      setValue("permanent_zip_code", null);
                      setValue("permanent_house_no_street_village", null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required={selectedPermanentCountry === "Philippines"}
                        {...register("permanent_province")}
                        {...params}
                        label="Province"
                        error={!!errors?.permanent_province}
                        helperText={errors?.permanent_province?.message}
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
                    onChange={(event, newValue) => {
                      setSelectedPermanentMunicipality(newValue);
                      setSelectedPermanentBarangay(null);
                      setValue("permanent_zip_code", null);
                      setValue("permanent_house_no_street_village", null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...register("permanent_municipality")}
                        required={selectedPermanentProvince}
                        {...params}
                        label="Municipality"
                        error={!!errors?.permanent_municipality}
                        helperText={errors?.permanent_municipality?.message}
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
                    error={!!errors?.permanent_zip_code}
                    helperText={errors?.permanent_zip_code?.message}
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
                        error={!!errors?.permanent_barangay}
                        helperText={errors?.permanent_barangay?.message}
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
                    error={!!errors?.permanent_house_no_street_village}
                    helperText={errors?.permanent_house_no_street_village?.message}
                    {...register("permanent_house_no_street_village")}
                  />
                </Grid>
              </>
            </>
          </>
        )}
        <ApplicationDivider />
        {/* Contact Number  */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth

            label="Cellphone Number"
            {...register("cellphone_number")}
            error={!!errors?.cellphone_number}
            helperText={errors?.cellphone_number?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Landline Number"
            {...register("landline_number")}
            error={!!errors?.landline_number}
            helperText={errors?.landline_number?.message}
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
                error={!!errors?.tin}
                helperText={errors?.tin?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SSS/GSIS Number"
                {...register("sss_gsis_number")}
                error={!!errors?.sss_gsis_number}
                helperText={errors?.sss_gsis_number?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pag-IBIG Number"
                {...register("pag_ibig_number")}
                error={!!errors?.pag_ibig_number}
                helperText={errors?.pag_ibig_number?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PhilHealth Number"
                {...register("phil_health_no")}
                error={!!errors?.phil_health_no}
                helperText={errors?.phil_health_no?.message}
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
                    error={!!errors?.employment_status}
                    helperText={errors?.employment_status?.message}
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
                    error={!!errors?.is_looking_for_work}
                    helperText={errors?.is_looking_for_work?.message}
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
                  error={!!errors?.since_when_looking_for_work}
                  helperText={errors?.since_when_looking_for_work?.message}
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
                    error={!!errors?.is_willing_to_work_immediately}
                    helperText={errors?.is_willing_to_work_immediately?.message}
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
                      error={!!errors?.is_ofw}
                      helperText={errors?.is_ofw?.message}
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
                        error={!!errors?.ofw_country}
                        helperText={errors?.ofw_country?.message}
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
                      error={!!errors?.is_former_ofw}
                      helperText={errors?.is_former_ofw?.message}
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
                          error={!!errors?.former_ofw_country}
                          helperText={errors?.former_ofw_country?.message}
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
                      error={!!errors?.former_ofw_country_date_return}
                      helperText={
                        errors?.former_ofw_country_date_return?.message
                      }
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
                    error={!!errors?.is_4ps_beneficiary}
                    helperText={errors?.is_4ps_beneficiary?.message}
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
                  error={!!errors?._4ps_household_id_no}
                  helperText={errors?._4ps_household_id_no?.message}
                />
              </Grid>
            )}
          </>
        )}
        {(user_type === "ACADEME" || user_type === "EMPLOYER") && (
          <>
            <Grid item xs={12} >
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                {...register("email")}
                error={!!errors?.email}
                helperText={errors?.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Employer's Position / Designation"
                {...register("employer_position")}
                error={!!errors?.employer_position}
                helperText={errors?.employer_position?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Employer's ID Number"
                {...register("employer_id_number")}
                error={!!errors?.employer_id_number}
                helperText={errors?.employer_id_number?.message}
              />
            </Grid>
          </>
        )}
      </Grid>

      <ApplicationDivider />
      {/* File Upload */}
      <Grid item xs={12}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Valid ID Upload
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please upload a clear photo of your government-issued ID (e.g.,
            Driver's License, Passport, SSS, etc.)
          </Typography>
        </Box>

        <input
          type="file"
          id="id"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          required
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <label htmlFor="id">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 1 }}
            >
              {fileName ? "Change Selected ID" : "Upload Valid ID *"}
            </Button>
          </label>

          {fileName && (
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                <InsertDriveFileIcon color="primary" />
                <Typography variant="body2" noWrap title={fileName}>
                  {fileName}
                </Typography>
              </Box>
            </Paper>
          )}

          {!!errors?.id && (
            <FormHelperText error>{errors?.id?.message}</FormHelperText>
          )}
        </Box>
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
