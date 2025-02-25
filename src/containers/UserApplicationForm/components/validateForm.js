const validateForm = async (schema, formData, setIsValid, setFormErrors) => {
    try {
      // Validate the formData based on schema
      await schema.validate(formData, { abortEarly: false });
      setIsValid(true); // If validation passes, set isValid to true
      setFormErrors({}); // Clear previous errors
    } catch (error) {
      setIsValid(false); // If validation fails, set isValid to false
  
      // Handling errors when formData is an array (e.g., educationHistory)
      const errorMessages = error.inner.reduce((acc, currError) => {
        // Get the path (e.g., educationHistory[1].date_to) from the error
        const path = currError.path;
  
        // Match the array index and field name from the path
        const match = path.match(/\[(\d+)\]\.(\w+)/);
  
        if (match) {
          // Extract the index and field name from the matched path
          const index = parseInt(match[1], 10);
          const fieldName = match[2];
  
          // Initialize the array object for the index if not exists
          if (!acc[index]) acc[index] = {};
  
          // Set the error message for the specific index and field
          acc[index][fieldName] = currError.message;
        } else {
          // For non-array fields, store the error as is
          acc[path] = currError.message;
        }
  
        return acc;
      }, {});
  
      setFormErrors(errorMessages); // Store errors in formErrors state
    }
  };
  
  export default validateForm;
  

  


// const validateForm = async (schema, formData, setIsValid, setFormErrors) => {
//     try {
//         // Validate the formData based on schema
//         await schema.validate(formData, { abortEarly: false });
//         setIsValid(true); // If validation passes, set isValid to true
//         setFormErrors({}); // Clear previous errors
//     } catch (error) {
//         setIsValid(false); // If validation fails, set isValid to false
//         const errorMessages = error.inner.reduce((acc, currError) => {
//             acc[currError.path] = currError.message;
//             return acc;
//         }, {});
//         setFormErrors(errorMessages); // Store errors in formErrors state
//     }
// };
// export default validateForm;