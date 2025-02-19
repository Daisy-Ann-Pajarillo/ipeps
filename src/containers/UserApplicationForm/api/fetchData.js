const domain = "http://127.0.0.1:5000/";

const fetchData = async (url, method = "GET", body = null, headers = {}) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers, // Allow custom headers
      },
    };

    if (body) {
      options.body = JSON.stringify(body); // Convert body to JSON if provided
    }

    const response = await fetch(domain + url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[${method}] ${url} Response:`, data);

    return data;
  } catch (error) {
    console.error(`API Request Failed: [${method}] ${url}`, error);
    throw error;
  }
};

export default fetchData;
