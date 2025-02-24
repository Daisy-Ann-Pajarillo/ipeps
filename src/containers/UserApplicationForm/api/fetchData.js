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
      personal_info: [
        {
          cellphone_number: "097326648432",
          email: "ejlindayao@gmail.com",
          employer_id_number: "48324729",
          employer_position: "sample position",
          first_name: "Edjay",
          institution_name: "Sample",
          institution_type: "Public Universities",
          landline_number: "5543535",
          last_name: "Lindayao",
          middle_name: "Cantero",
          permanent_barangay: "Permanent Barangay",
          permanent_country: "Philippines",
          permanent_house_no_street_village: null,
          permanent_municipality: "Bangued",
          permanent_province: "Abra",
          permanent_zip_code: null,
          prefix: "Mr.",
          suffix: "Jr",
          temporary_barangay: null,
          temporary_country: null,
          temporary_house_no_street_village: null,
          temporary_municipality: null,
          temporary_province: null,
          temporary_zip_code: null,
          valid_id_url: null,
        },
      ],
    };
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
