import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import Box from '@mui/material/Box';

const DataCard = ({ title, data = [] }) => {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0] || {});

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-blue-100 mb-4 py-5 text-center sticky top-0 bg-blue-700 rounded-md">
        {title}
      </h2>

      <div className="grid gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            {keys.map((key) => (
              <div
                key={key}
                className="flex flex-col md:flex-row items-center justify-between hover:bg-neutral-200 py-3 px-4 rounded-md transition-all duration-200 even:bg-neutral-100"
              >
                <span className="font-normal text-gray-700 w-40 text-center md:text-left">
                  {key.replace(/_/g, " ").toUpperCase()}:
                </span>
                <span className="text-gray-600 font-bold">
                  {item[key] === true
                    ? "Yes"
                    : item[key] === false
                    ? "No"
                    : item[key] || "-"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewApplication = ({ user_type }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user_type === "JOBSEEKER" || user_type === "STUDENT") {
          const response = await axios.get(
            "/api/get-jobseeker-student-all-data"
          );
          setData(response.data);
        } else if (user_type === "ACADEME") {
          console.log("user type ACADEME");

          const response = await axios.get(
            "/api/get-academe-personal-information"
          );
          console.log(response.data);
          setData(response.data);
        } else if (user_type === "EMPLOYER") {
          console.log("user type EMPLOYER");

          const response = await axios.get(
            "/api/get-employer-personal-information"
          );
          console.log(response.data);
          setData(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          No data available
        </div>
      </div>
    );
  }

  const baseSections = [
    { title: "Personal Information", key: "personal_information" },
  ];

  const secondSection = [
    { title: "Job Preference", key: "job_preference" },
    { title: "Language Proficiency", key: "language_proficiency" },
    { title: "Educational Background", key: "educational_background" },
    { title: "Other Training", key: "other_training" },
    { title: "Professional License", key: "professional_license" },
    { title: "Work Experience", key: "work_experience" },
    { title: "Other Skills", key: "other_skills" },
  ];
  const sections =
    user_type === "JOBSEEKER" || user_type === "STUDENT"
      ? [...baseSections, ...secondSection]
      : baseSections;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <div className="p-6 max-w-6xl mx-auto">
          {sections.map(({ title, key }) => (
            <DataCard key={key} title={title} data={data[key] || []} />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default ReviewApplication;
