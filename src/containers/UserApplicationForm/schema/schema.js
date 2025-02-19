import * as yup from "yup";

export const baseSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  cellphone_number: yup
    .string()
    .matches(/^\+?[0-9]+$/, "Must be a valid number")
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
  permanent_zip_code: yup.string().when("country", {
    is: "Philippines",
    then: (schema) => schema.required("Zip Code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  //////////////----------------------- Permanent Address
  temporary_country: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Country is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  temporary_province: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  temporary_municipality: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Municipality is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  temporary_barangay: yup.string().when("permanent", {
    is: false,
    then: (schema) => schema.required("Permanent Barangay is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  temporary_zip_code: yup.string().when("permanent", {
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
export const jobseekerSchema = yup.object().shape({
  sex: yup.string().required("Please select your sex"),
  date_of_birth: yup.string().required("Date of birth is required"),
  place_of_birth: yup.string().required("Place of birth is required"),
  civil_status: yup.string().required("Please select your civil status"),
  height: yup.number().required("Height is required"),
  weight: yup.number().required("Weight is required"),
  employment_status: yup.string().required("Employment status is required"),
  disability: yup
    .object()
    .shape({
      visual: yup.boolean().nullable(),
      hearing: yup.boolean().nullable(),
      speech: yup.boolean().nullable(),
      physical: yup.boolean().nullable(),
    })
    .nullable()
    .notRequired(),
  // other_disabilities: yup.string().nullable().notRequired(),
  landline_number: yup.string().nullable().notRequired(),
  religion: yup.string().required("Religion is required"),
  //--------------------------------------------
  tin: yup.string().required("TIN is required"),
  sss_gsis_number: yup.string().required("SSS/GSIS number is required"),
  pag_ibig_number: yup.string().required("Pag-IBIG number is required"),
  phil_health_no: yup.string().required("PhilHealth number is required"),
  //--------------------------------------------
  is_looking_for_work: yup.string().required("Answer is required"),
  since_when_looking_for_work: yup.string().when("is_looking_for_work", {
    is: "YES",
    then: (schema) =>
      schema.required("Please specify since when you are looking for work"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // OFW Section
  is_ofw: yup.string().required("Answer is required"),
  ofw_country: yup.string().when("is_ofw", {
    is: "YES",
    then: (schema) =>
      schema.required(
        "Please specify the country where you are working as an OFW"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Former OFW Section
  is_former_ofw: yup.string().required("Answer is required"),
  former_ofw_country: yup.string().when("is_former_ofw", {
    is: "YES",
    then: (schema) =>
      schema.required(
        "Please specify the country where you previously worked as an OFW"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  former_ofw_country_date_return: yup.string().when("is_former_ofw", {
    is: "YES",
    then: (schema) => schema.required("Please specify the date of your return"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // 4Ps Beneficiary Section
  is_4ps_beneficiary: yup.string().required("Answer is required"),
  _4ps_household_id_no: yup.string().when("is_4ps_beneficiary", {
    is: "YES",
    then: (schema) => schema.required("Please provide your household ID"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
// Employer-Specific Schema
export const employerSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Company / Agency Affiliation is required"),
  company_workforce: yup.string().required("Company Workforce is required"),
  company_industry: yup.string().required("Company Industry is required"),
  company_classification: yup
    .string()
    .required("Company Classification is required"),
  company_type: yup.string().required("Company Type is required"),
});
// Academe-Specific Schema
export const academeSchema = yup.object().shape({
  institution_name: yup.string().required("Institution Name is required"),
  institution_type: yup.string().required("Institution Type is required"),
});
// Academe Employer Schema Same
export const employerAcademeSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Company Email is required"),
  employer_position: yup.string().required("Employer Position is required"),
  employer_id_number: yup.string().required("Employer ID Number is required"),
});
export const jobPreferenceSchema = yup.object().shape({
  industry: yup.string().required("Industry is required"),
  preferred_occupation: yup
    .string()
    .required("Preferred Occupation is required"),
  salary_from: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Salary must be greater than zero")
    .required("Expected salary (from) is required"),
  salary_to: yup
    .number()
    .typeError("Must be a number")
    .min(yup.ref("salary_from"), "Must be greater than 'From' salary")
    .required("Expected salary (to) is required"),
  country: yup.string().required("Province is required"),
  province: yup.string().when("country", {
    is: "Philippines",
    then: (jobPreferenceSchema) =>
      jobPreferenceSchema.required("Province is required"),
    otherwise: (jobPreferenceSchema) => jobPreferenceSchema.notRequired(),
  }),
  municipality: yup.string().when("country", {
    is: "Philippines",
    then: (jobPreferenceSchema) =>
      jobPreferenceSchema.required("Municipality is required"),
    otherwise: (jobPreferenceSchema) => jobPreferenceSchema.notRequired(),
  }),
});
export const professionalEligibilitySchema = yup.object().shape({
  professional_license: yup
    .array()
    .of(
      yup.object().shape({
        type: yup.string().required("Eligibility Type is required"),
        name: yup.string().required("Name is required"),
        date: yup
          .date()
          .typeError("Date must be a valid date")
          .required("Date is required"),
        rating: yup
          .number()
          .typeError("Rating must be a number")
          .when("name", {
            is: (name) => name === "Civil Service Eligibility",
            then: (schema) =>
              schema.required(
                "Rating is required for Civil Service Eligibility"
              ),
            otherwise: (schema) => schema.nullable(),
          }),
        valid_until: yup
          .date()
          .nullable()
          .typeError("Valid Until must be a valid date")
          .when("name", {
            is: (name) => name === "PRC Professional License",
            then: (schema) =>
              schema.required(
                "Valid Until is required for PRC Professional License"
              ),
            otherwise: (schema) => schema.nullable(),
          })
          .test(
            "valid-until-greater",
            "Valid Until must be greater than Date",
            function (validUntil) {
              const { date } = this.parent; // Get the `date` field
              return !validUntil || !date || validUntil > date; // Pass if `validUntil` is greater than `date`
            }
          ),
      })
    )
    .required("At least one professional license is required"),
});

// Updated validation schema to match form fields
export const educationalBackgroundSchema = yup.object().shape({
  educationHistory: yup.array().of(
    yup.object().shape({
      school_name: yup
        .string()
        .min(3, "School Name should be at least 3 characters long")
        .required("School name is required"),
      degree_or_qualification: yup
        .string()
        .required("Degree qualification is required"),
      date_from: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      date_to: yup
        .date()
        .nullable() // ✅ Allows null values
        .notRequired() // ✅ Ensures it's not required in validation
        .when("date_from", (date_from, schema) =>
          date_from
            ? schema
                .test(
                  "end-date-after-start",
                  "End date must be after start date",
                  (date_to) =>
                    !date_to ||
                    (date_from && new Date(date_to) > new Date(date_from))
                )
                .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      is_current: yup.boolean().default(false),
      field_of_study: yup
        .string()
        .nullable() // ✅ Made optional (no required rule)
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ), // Optional and handles empty strings
      major: yup.string().nullable(),
      program_duration: yup
        .number()
        .typeError("Program duration must be a number")
        .positive("Must be a positive number")
        .integer("Must be an integer"),
    })
  ),
});
export const languageProficiencySchema = yup.object().shape({
  language_proficiency: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          language: yup.string().required("Language is required"),
          can_read: yup.boolean().default(false),
          can_write: yup.boolean().default(false),
          can_speak: yup.boolean().default(false),
          can_understand: yup.boolean().default(false),
        })
        .test(
          "at-least-one-skill",
          "At least one skill (Read, Write, Speak, Understand) must be selected",
          (value) => {
            if (!value) return false;
            return (
              value.can_read ||
              value.can_write ||
              value.can_speak ||
              value.can_understand
            );
          }
        )
    )
    .min(1, "At least one language is required")
    .required(),
});
export const otherSkillsSchema = yup.object().shape({
  skills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill must be selected"),
  other_skills: yup
    .array()
    .of(
      yup.object().shape({
        skills: yup.string().required(),
      })
    )
    .max(50, "Maximum 50 additional skills allowed"),
});

export const otherTrainingsSchema = yup.object().shape({
  other_training: yup.array().of(
    yup.object().shape({
      course_name: yup.string().required("Course Name is required"),
      start_date: yup
        .date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future"),
      end_date: yup
        .date()
        .nullable() // ✅ Allows null values
        .notRequired() // ✅ Ensures it's not required in validation
        .when("start_date", (start_date, schema) =>
          start_date
            ? schema
                .min(yup.ref("start_date"), "End date must be after start date")
                .max(new Date(), "End date cannot be in the future")
            : schema
        )
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      training_institution: yup
        .string()
        .required("Training Institution is required"),
      certificates_received: yup.string(),
      hours_of_training: yup
        .number()
        .required("Hours of Training is required")
        .positive("Hours must be a positive number")
        .integer("Hours must be a whole number"),
      skills_acquired: yup.string().nullable(),
      credential_id: yup.string(),
      credential_url: yup.string().url("Must be a valid URL").nullable(),
    })
  ),
});
export const workExperienceSchema = yup.object().shape({
  work_experience: yup
    .array()
    .of(
      yup.object().shape({
        company_name: yup.string().required("Company Name is required"),
        company_address: yup.string().required("Company Address is required"),
        position: yup.string().required("Position is required"),
        employment_status: yup
          .string()
          .required("Employment Status is required"),
        date_start: yup
          .date()
          .required("Start date is required")
          .max(new Date(), "Start date cannot be in the future"),
        date_end: yup
          .date()
          .required("End date is required")
          .when("date_start", (date_start, schema) =>
            date_start
              ? schema
                  .test(
                    "end-date-after-start",
                    "End date must be after start date",
                    (date_end) =>
                      !date_end ||
                      (date_start && new Date(date_end) > new Date(date_start))
                  )
                  .max(new Date(), "End date cannot be in the future")
              : schema
          )
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          ),
      })
    )
    .min(1, "At least one work experience entry is required")
    .required("Work Experience is required"),
});
