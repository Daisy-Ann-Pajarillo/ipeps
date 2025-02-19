const validateForm = async (schema, formData, setIsValid, setFormErrors) => {
    try {
        // Validate the formData based on schema
        await schema.validate(formData, { abortEarly: false });
        setIsValid(true); // If validation passes, set isValid to true
        setFormErrors({}); // Clear previous errors
    } catch (error) {
        setIsValid(false); // If validation fails, set isValid to false
        const errorMessages = error.inner.reduce((acc, currError) => {
            acc[currError.path] = currError.message;
            return acc;
        }, {});
        setFormErrors(errorMessages); // Store errors in formErrors state
    }
};
export default validateForm;