/**
 * Recursively processes an object and converts all date strings to JavaScript Date objects
 * Specifically designed for React state management with date fields
 *
 * @param {Object} obj - The object containing potential date strings
 * @returns {Object} - New object with date strings converted to Date objects
 */
const convertDatesToDateObjects = (obj) => {
  // If null or undefined, return as is
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's not an object or array, check if it's a date string
  if (typeof obj !== "object") {
    // Check if it matches common date string format from your example
    if (
      typeof obj === "string" &&
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s\d{1,2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT$/.test(
        obj
      )
    ) {
      return new Date(obj);
    }
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToDateObjects(item));
  }

  // Handle objects - create a new object to avoid mutating the original
  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Check if the property name suggests it's a date
      const value = obj[key];

      if (
        key.includes("date") ||
        key.includes("birth") ||
        key.includes("when")
      ) {
        // If it's a string that looks like a date, convert it
        if (typeof value === "string") {
          try {
            const dateObj = new Date(value);
            // Verify it's a valid date
            if (!isNaN(dateObj.getTime())) {
              result[key] = dateObj;
              continue;
            }
          } catch (e) {
            // If date parsing fails, keep the original value
          }
        }
      }

      // Recursively process nested objects
      result[key] = convertDatesToDateObjects(value);
    }
  }

  return result;
};
