const isEqual = (value1, value2) => {
  // Check if primitives or if both values are strictly equal
  if (value1 === value2) return true;

  // Check if either is null or not an object
  if (
    value1 === null ||
    value2 === null ||
    typeof value1 !== "object" ||
    typeof value2 !== "object"
  ) {
    return false;
  }

  // Get keys of both objects
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  // Check if same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check each key and value recursively
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(value1[key], value2[key])) return false;
  }

  return true;
};

// Function to determine which fields have changed
const determineChangedFields = (prevData, currentData) => {
  const changedFields = [];

  // Compare each field in the current data with the previous data
  Object.keys(currentData).forEach((fieldName) => {
    // If the field didn't exist before or has changed value
    if (
      !prevData.hasOwnProperty(fieldName) ||
      !isEqual(prevData[fieldName], currentData[fieldName])
    ) {
      changedFields.push(fieldName);
    }
  });

  return changedFields;
};

export default determineChangedFields;
