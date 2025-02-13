import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  FormControl,
  Checkbox,
  Grid,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
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
import provincesCitiesWithMunicipalities from "../../../reusable/constants/provincesCitiesWithMunicipalities";
import countriesList from "../../../reusable/constants/countriesList";
import religionOption from "../../../reusable/constants/religionOptionTypes";

const baseSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  sex: yup.string().required("Please select your sex"),
  date_of_birth: yup.string().required("Date of birth is required"),
  place_of_birth: yup.string().required("Place of birth is required"),
  civil_status: yup.string().required("Please select your civil status"),
  cell_phone_no: yup
    .string()
    .matches(/^[0-9]+$/, "Must be a number")
    .min(10, "Must be at least 10 digits")
    .required("Cellphone number is required"),
  permanent: yup.boolean(),
  permanent_country: yup.string().required("Province is required"),
  permanent_province: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanent_municipality: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Municipality is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanent_barangay: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Barangay is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanent_zipcode: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Zip Code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  //////////////----------------------- Permanent Address
  country: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Country is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  province: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  municipality: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Municipality is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  barangay: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Barangay is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  zipcode: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Zip Code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  id: yup
    .mixed()
    .test("fileSize", "File size is too large", (value) => {
      if (!value || !value.length) return true;
      const fileSize = value[0]?.size || 0;
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      console.log("Testing file size:", fileSize, "Max size:", maxSize);
      return fileSize <= maxSize;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || !value.length) return true;
      const fileType = value[0]?.type || "";
      const supportedTypes = ["image/jpeg", "image/png", "application/pdf"];
      console.log("Testing file type:", fileType);
      return supportedTypes.includes(fileType);
    })
    .required("Company ID is required"),
});

// Job Seeker-Specific Schema
const jobseekerSchema = yup.object().shape({
  height: yup.number().required("Height is required"),
  weight: yup.number().required("Weight is required"),
  employment_status: yup.string().required("Employment status is required"),
  disabilities: yup
    .object()
    .shape({
      visual: yup.boolean().nullable(),
      hearing: yup.boolean().nullable(),
      speech: yup.boolean().nullable(),
      physical: yup.boolean().nullable(),
    })
    .nullable()
    .notRequired(),
  other_disabilities: yup.string().nullable().notRequired(),
  land_line_no: yup.string().nullable().notRequired(),
  religion: yup.string().required("Religion is required"),
  //--------------------------------------------
  tin: yup.string().required("TIN is required"),
  sss_and_gsis_no: yup.string().required("SSS/GSIS number is required"),
  pagibig_no: yup.string().required("Pag-IBIG number is required"),
  phil_health_no: yup.string().required("PhilHealth number is required"),
  //--------------------------------------------
  looking_for_a_work: yup.string().required("Answer is required"),
  looking_for_a_work_since: yup.string().when("looking_for_a_work", {
    is: "YES",
    then: (schema) =>
      schema.required("Please specify since when you are looking for work"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // OFW Section
  an_ofw: yup.string().required("Answer is required"),
  ofw_country: yup.string().when("an_ofw", {
    is: "YES",
    then: (schema) =>
      schema.required(
        "Please specify the country where you are working as an OFW"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Former OFW Section
  former_ofw: yup.string().required("Answer is required"),
  former_ofw_country: yup.string().when("former_ofw", {
    is: "YES",
    then: (schema) =>
      schema.required(
        "Please specify the country where you previously worked as an OFW"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  ofw_date_return: yup.string().when("former_ofw", {
    is: "YES",
    then: (schema) => schema.required("Please specify the date of your return"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // 4Ps Beneficiary Section
  four_ps_beneficiary: yup.string().required("Answer is required"),
  household_id: yup.string().when("four_ps_beneficiary", {
    is: "YES",
    then: (schema) => schema.required("Please provide your household ID"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Employer-Specific Schema
const employerSchema = yup.object().shape({
  company: yup.string().required("Company / Agency Affiliation is required"),
  employer_name: yup.string().required("Employer Name is required"),
  employer_address: yup.string().required("Employer Number is required"),
  employer_contact_number: yup
    .string()
    .required("Employer Contact Number is required"),
  employer_position: yup.string().required("Employer Position is required"),
  employer_id_number: yup.string().required("Employer ID Number is required"),
});

// Dynamic Schema Based on User Type
const getSchema = (userType) => {
  if (userType === "EMPLOYER") {
    return baseSchema.concat(employerSchema);
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
  const defaultValues = {
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    sex: "",
    date_of_birth: "",
    place_of_birth: "",
    civil_status: "",
    cell_phone_no: "",
    country: "",
    province: "",
    municipality: "",
    barangay: "",
    zipcode: "",
    housestreet: "",
    landlineno: "",
    ...(user_type === "EMPLOYER"
      ? {
          company: "",
          employer_name: "",
          employer_address: "",
          employer_contact_number: "",
          employer_position: "",
          employer_id_number: "",
          id: undefined,
        }
      : {}),
    ...(user_type === "JOBSEEKER"
      ? {
          height: "",
          weight: "",
          employment_status: "",
          disabilities: {
            visual: false,
            hearing: false,
            speech: false,
            physical: false,
          },
          other_disabilities: "",
          religion: "",
          tin: "",
          designation: "",
          sss_and_gsis_no: "",
          pagibig_no: "",
          phil_health_no: "",
        }
      : {}),
  };
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(getSchema(user_type)),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const formData = watch();

  const [isPermanent, setIsPermanent] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const [selectedPermanentCountry, setSelectedPermanentCountry] =
    useState(null);
  const [selectedPermanentProvince, setSelectedPermanentProvince] =
    useState(null);
  const [selectedPermanentMunicipality, setSelectedPermanentMunicipality] =
    useState(null);

  const [selectedReligion, setSelectedReligion] = useState(null);

  const selectedProvinceData = selectedProvince
    ? provincesCitiesWithMunicipalities.find(
        (item) => item.province === selectedProvince.province
      )
    : null;
  const selectedPermanentProvinceData = selectedProvince
    ? provincesCitiesWithMunicipalities.find(
        (item) => item.province === selectedProvince.province
      )
    : null;

  const [fileName, setFileName] = useState("");

  const [employmentStatus, setEmploymentStatus] = useState(null);
  const [lookingForAWork, setLookingForAWork] = useState(null);
  const [willingToWork, setWillingToWork] = useState(null);

  const [anOfw, setAnOfw] = useState(null);
  const [ofwCountry, setOfwCountry] = useState(null);

  const [formerOfw, setFormerOfw] = useState(null);
  const [formerOfwCountry, setFormerOfwCountry] = useState(null);

  const [fourPs, setFourPs] = useState(null);

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

  // Effect to update form validation state
  useEffect(() => {
    setIsValid(!Object.keys(errors).length);
  }, [errors, setIsValid]);
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Basic Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="First Name"
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Middle Name"
            {...register("middle_name")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Last Name"
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Suffix" {...register("suffix")} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Sex</InputLabel>
            <Select {...register("sex")} error={!!errors.sex}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <p className="text-red-500 text-sm">{errors.sex?.message}</p>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Date of Birth"
            type="date"
            {...register("date_of_birth")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Place of Birth"
            {...register("place_of_birth")}
            error={!!errors.place_of_birth}
            helperText={errors.place_of_birth?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Civil Status</InputLabel>
            <Select {...register("civil_status")} error={!!errors.civil_status}>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
            <p className="text-red-500 text-sm">
              {errors.civil_status?.message}
            </p>
          </FormControl>
        </Grid>
        {(user_type === "JOBSEEKER" || user_type === "STUDENT") && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Height (cm)"
                {...register("height")}
                error={!!errors.height}
                helperText={errors.height?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Weight (kg)"
                {...register("weight")}
                error={!!errors.weight}
                helperText={errors.weight?.message}
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
                  />
                )}
              />
            </Grid>
          </>
        )}
        <ApplicationDivider />

        {/* Address */}
        <>
          <Grid item xs={12} sx={{ display: "flex", justifyItems: "center" }}>
            <label>
              <Grid item xs={12}>
                <Typography>
                  {!isPermanent ? "Temporary Address" : "Permanent Address"}
                </Typography>
              </Grid>
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
          {/* Permanent Address */}
          {!isPermanent && (
            <>
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
                      {...register("country")}
                      {...params}
                      required
                      label="Country"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={provincesCitiesWithMunicipalities}
                  getOptionLabel={(option) => option.province}
                  value={selectedPermanentProvince}
                  onChange={(event, newValue) => {
                    setSelectedPermanentProvince(newValue);
                    setSelectedPermanentMunicipality(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      required={selectedPermanentCountry === "Philippines"}
                      {...register("province")}
                      {...params}
                      label="Province"
                    />
                  )}
                  disabled={selectedPermanentCountry !== "Philippines"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={
                    selectedPermanentProvinceData
                      ? selectedPermanentProvinceData.municipalities
                      : []
                  }
                  getOptionLabel={(option) => option}
                  value={selectedPermanentMunicipality}
                  onChange={(event, newValue) =>
                    setSelectedPermanentMunicipality(newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...register("municipality")}
                      required={selectedPermanentProvince}
                      {...params}
                      label="Municipality"
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
                  {...register("zipcode")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!selectedPermanentMunicipality}
                  label="Barangay"
                  {...register("barangay")}
                  error={!!errors.barangay}
                  helperText={errors.barangay?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!selectedPermanentMunicipality}
                  label="House No./Street Village"
                  {...register("housestreet")}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography>{!isPermanent && "Permanent Address"}</Typography>
          </Grid>
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
                  {...register("permanent_country")}
                  {...params}
                  required
                  label="Country"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={provincesCitiesWithMunicipalities}
              getOptionLabel={(option) => option.province}
              value={selectedProvince}
              onChange={(event, newValue) => {
                setSelectedProvince(newValue);
                setSelectedMunicipality(null);
              }}
              renderInput={(params) => (
                <TextField
                  required={selectedCountry === "Philippines"}
                  {...register("permanent_province")}
                  {...params}
                  label="Province"
                />
              )}
              disabled={selectedCountry !== "Philippines"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={
                selectedProvinceData ? selectedProvinceData.municipalities : []
              }
              getOptionLabel={(option) => option}
              value={selectedMunicipality}
              onChange={(event, newValue) => setSelectedMunicipality(newValue)}
              renderInput={(params) => (
                <TextField
                  {...register("permanent_municipality")}
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
              {...register("permanent_zipcode")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled={!selectedMunicipality}
              label="Barangay"
              {...register("permanent_barangay")}
              error={!!errors.barangay}
              helperText={errors.barangay?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled={!selectedMunicipality}
              label="House No./Street Village"
              {...register("permanent_housestreet")}
            />
          </Grid>
        </>

        <ApplicationDivider />

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Cellphone Number"
            {...register("cell_phone_no")}
            error={!!errors.cell_phone_no}
            helperText={errors.cell_phone_no?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Landline Number"
            {...register("landlineno")}
            error={!!errors.landlineno}
            helperText={errors.landlineno?.message}
          />
        </Grid>

        {user_type === "EMPLOYER" && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company / Agency Affiliation"
                {...register("company")}
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emplolyer's Name"
                {...register("employer_name")}
                error={!!errors.employer_name}
                helperText={errors.employer_name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emplolyer's Address"
                {...register("employer_address")}
                error={!!errors.employer_address}
                helperText={errors.employer_address?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer's Contact Number"
                {...register("employercontactnumber")}
                error={!!errors.employercontactnumber}
                helperText={errors.employercontactnumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer's Position / Designation"
                {...register("employer_position")}
                error={!!errors.employer_position}
                helperText={errors.employer_position?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer's ID Number"
                {...register("employer_id_number")}
                error={!!errors.employer_id_number}
                helperText={errors.employer_id_number?.message}
              />
            </Grid>
          </>
        )}

        {/* Employer-Specific Fields */}
        {(user_type === "JOBSEEKER" || user_type === "STUDENT") && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="TIN"
                {...register("tin")}
                error={!!errors.tin}
                helperText={errors.tin?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="SSS/GSIS Number"
                {...register("sss_and_gsis_no")}
                error={!!errors.sss_and_gsis_no}
                helperText={errors.sss_and_gsis_no?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Pag-IBIG Number"
                {...register("pagibig_no")}
                error={!!errors.pagibig_no}
                helperText={errors.pagibig_no?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="PhilHealth Number"
                {...register("phil_health_no")}
                error={!!errors.phil_health_no}
                helperText={errors.phil_health_no?.message}
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
                        {...register(`disabilities.${key}`)}
                        checked={formData.disabilities?.[key] || false}
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Other Disabilities"
                {...register("other_disabilities")}
                value={formData.other_disabilities || ""}
              />
            </Grid>

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
                    error={!!errors.employment_status}
                    helperText={errors.employment_status?.message}
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
                    {...register("looking_for_a_work")}
                    error={!!errors.looking_for_a_work}
                    helperText={errors.looking_for_a_work?.message}
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
                  {...register("looking_for_a_work_since")}
                  required={lookingForAWork === "YES"}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.looking_for_a_work_since}
                  helperText={errors.looking_for_a_work_since?.message}
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
                    {...register("willing_to_work_immediately")}
                    error={!!errors.willing_to_work_immediately}
                    helperText={errors.willing_to_work_immediately?.message}
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
                      {...register("an_ofw")}
                      error={!!errors.an_ofw}
                      helperText={errors.an_ofw?.message}
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
                        error={!!errors.ofw_country}
                        helperText={errors.ofw_country?.message}
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
                      {...register("former_ofw")}
                      required
                      error={!!errors.former_ofw}
                      helperText={errors.former_ofw?.message}
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
                          error={!!errors.former_ofw_country}
                          helperText={errors.former_ofw_country?.message}
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
                      {...register("ofw_date_return")}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.ofw_date_return}
                      helperText={errors.ofw_date_return?.message}
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
                    {...register("four_ps_beneficiary")}
                    error={!!errors.former_ofw}
                    helperText={errors.former_ofw?.message}
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
                  {...register("household_id")}
                  error={!!errors.household_id}
                  helperText={errors.household_id?.message}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>

      <ApplicationDivider />

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
            Upload Valid {user_type === "EMPLOYER" && "Company"} ID
          </Button>
        </label>
        {fileName && (
          <Typography variant="body2">Selected file: {fileName}</Typography>
        )}
        {errors.id && (
          <FormHelperText error>{errors.id.message}</FormHelperText>
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
