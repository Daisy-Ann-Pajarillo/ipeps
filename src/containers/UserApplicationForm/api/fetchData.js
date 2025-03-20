const formatDate = (dateString) => {
  // Convert the string into a Date object
  const date = new Date(dateString);

  // Format the date as 'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const convertDatesInObject = (data) => {
  // Loop through the data and convert any dates found to the desired format
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // If the value is an array, loop through the array
      data[key].forEach((item) => {
        // Check if the item is an object and iterate through its properties
        if (typeof item === "object") {
          convertDatesInObject(item); // Recursive call for nested objects
        } else if (typeof item === "string" && Date.parse(item)) {
          // Check if the string is a valid date
          item = formatDate(item); // Convert date
        }
      });
    } else if (typeof data[key] === "object") {
      // If it's an object, recursively process it
      convertDatesInObject(data[key]);
    } else if (typeof data[key] === "string" && Date.parse(data[key])) {
      // If it's a string and a valid date, convert it
      data[key] = formatDate(data[key]);
    }
  }
};

// const domain = "http://127.0.0.1:5000/";

// const fetchData = async (url, method = "GET", body = null, headers = {}) => {
//   try {
//     const options = {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers, // Allow custom headers
//       },
//     };

//     if (body) {
//       options.body = JSON.stringify(body); // Convert body to JSON if provided
//     }

//     const response = await fetch(domain + url, options);

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log(`[${method}] ${url} Response:`, data);

//     return data;
//   } catch (error) {
//     console.error(`API Request Failed: [${method}] ${url}`, error);
//     throw error;
//   }
// };

// export default fetchData;

///////////
///////////
/////////// uncomment
//---------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/////////// mock
/////////// mock
/////////// mock
const fetchData = async (url, method = "GET", body = null, headers = {}) => {
  try {
    // Simulating the response as if it's coming from a real API
    const dummyData = {
      "educational_background": [
        {
          "date_from": "Mon, 10 Feb 2025 00:00:00 GMT",
          "date_to": "Tue, 15 Feb 2025 00:00:00 GMT",
          "degree_or_qualification": "Bachelor",
          "field_of_study": "BUSINESS ADMINISTRATION",
          "program_duration": 4,
          "school_name": "ISATU"
        },
        {
          "date_from": "Mon, 10 Feb 2025 00:00:00 GMT",
          "date_to": "Tue, 11 Feb 2025 00:00:00 GMT",
          "degree_or_qualification": "Elementary",
          "field_of_study": "ARCHITECTURE",
          "program_duration": 4,
          "school_name": "TIONCO"
        }
      ],
      "job_preference": [
        {
          "country": "Philippines",
          "industry": "[A] Agriculture, forestry and fishing",
          "municipality": "Buenavista",
          "preferred_occupation": "Software Engineer",
          "province": "Agusan del Norte",
          "salary_from": 30000.0,
          "salary_to": 50000.0
        }
      ],
      "language_proficiency": [
        {
          "can_read": true,
          "can_speak": true,
          "can_understand": false,
          "can_write": true,
          "language": "Filipino"
        },
        {
          "can_read": true,
          "can_speak": true,
          "can_understand": true,
          "can_write": true,
          "language": "English"
        }
      ],
      "other_skills": [
        {
          "skills": "beautician"
        },
        {
          "skills": "carpentry"
        },
        {
          "skills": "embroidery"
        },
        {
          "skills": "Sample skill"
        },
        {
          "skills": "auto mechanic"
        },
        {
          "skills": "gardening"
        },
        {
          "skills": "Sample"
        }
      ],
      "other_training": [
        {
          "certificates_received": "Sample 1 Cert",
          "course_name": "Sample 1",
          "credential_id": "kflksng 1",
          "credential_url": "https://www.facebook.com/",
          "end_date": "Tue, 11 Feb 2025 00:00:00 GMT",
          "hours_of_training": 3,
          "skills_acquired": "Sample 1 Skill ",
          "start_date": "Mon, 03 Feb 2025 00:00:00 GMT",
          "training_institution": "Sample 1 Institution"
        },
        {
          "certificates_received": "Sample 2 Cert ",
          "course_name": "Sample 2",
          "credential_id": "2342342",
          "credential_url": "https://www.facebook.com/",
          "end_date": "Mon, 10 Feb 2025 00:00:00 GMT",
          "hours_of_training": 2,
          "skills_acquired": "Sample 2 Skills",
          "start_date": "Sat, 01 Feb 2025 00:00:00 GMT",
          "training_institution": "Sample 2"
        }
      ],
      "personal_info": [
        {
          "_4ps_household_id_no": "98538475",
          "cellphone_number": "099843208",
          "civil_status": "Single",
          "date_of_birth": "Sun, 02 Feb 2025 00:00:00 GMT",
          "disability": "visual, hearing",
          "employment_status": "Employed",
          "first_name": "Edjay",
          "former_ofw_country": "United Arab Emirates",
          "former_ofw_country_date_return": "Fri, 28 Feb 2025 00:00:00 GMT",
          "height": 172.0,
          "is_4ps_beneficiary": true,
          "is_former_ofw": true,
          "is_looking_for_work": true,
          "is_ofw": true,
          "is_willing_to_work_immediately": true,
          "landline_number": null,
          "last_name": "Lindayao",
          "middle_name": "Cantero",
          "ofw_country": "Philippines",
          "pag_ibig_number": "43242211",
          "permanent_barangay": null,
          "permanent_country": "Philippines",
          "permanent_house_no_street_village": null,
          "permanent_municipality": null,
          "permanent_province": "Iloilo",
          "permanent_zip_code": "5000",
          "phil_health_no": "87463823",
          "place_of_birth": "Antique",
          "religion": "Aglipay",
          "sex": "Male",
          "since_when_looking_for_work": "Sat, 01 Feb 2025 00:00:00 GMT",
          "sss_gsis_number": "5435353",
          "suffix": "Jr",
          "temporary_barangay": "Tabuc Suba",
          "temporary_country": "Philippines",
          "temporary_house_no_street_village": "Ilaya",
          "temporary_municipality": "Bangued",
          "temporary_province": "Abra",
          "temporary_zip_code": "5000",
          "tin": "43242344",
          "valid_id_url": null,
          "weight": 55.0
        }
      ],
      "professional_license": [
        {
          "date": "Wed, 12 Feb 2025 00:00:00 GMT",
          "license": "Civil Service Eligibility",
          "name": "Sampleee121241",
          "rating": 1,
          "valid_until": null
        }
      ],
      "work_experience": [
        {
          "company_address": "Sample 1",
          "company_name": "Sample 1",
          "date_end": "Tue, 11 Feb 2025 00:00:00 GMT",
          "date_start": "Sun, 09 Feb 2025 00:00:00 GMT",
          "employment_status": "Full-Time",
          "position": "Sample 1"
        },
        {
          "company_address": "Sample 2",
          "company_name": "Sample 2",
          "date_end": "Tue, 11 Feb 2025 00:00:00 GMT",
          "date_start": "Mon, 10 Feb 2025 00:00:00 GMT",
          "employment_status": "Full-Time",
          "position": "Sample 2"
        }
      ]
    }
    convertDatesInObject(dummyData);

    // Simulate a network delay for testing (optional)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

    console.log(`Mock data returned:`, dummyData);
    return dummyData;
  } catch (error) {
    console.error("Mock API Request Failed:", error);
    throw error;
  }
};

export default fetchData;
