import React, { useEffect, useState } from "react";
import axios from "../../../axios";

const ReviewApplication = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/get-jobseeker-student-all-data");
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
      }
    };
    fetchData();
  }, []);

  const renderValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === undefined) {
      return "N/A";
    }
    return value.toString();
  };

  const renderSkillItem = (item) => {
    if (typeof item === "object" && item !== null) {
      return item.skills || "N/A";
    }
    return item;
  };

  const renderSection = (sectionData, sectionKey) => {
    if (Array.isArray(sectionData)) {
      return (
        <div className="space-y-4">
          {sectionData.map((item, index) => (
            <div key={index} className="border p-4 rounded">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <span className="font-bold">
                    {key.replace(/_/g, " ").toUpperCase()}:{" "}
                  </span>
                  {sectionKey === "other_skills"
                    ? renderSkillItem(value)
                    : renderValue(value)}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(sectionData).map(([key, value]) => (
          <div key={key}>
            <span className="font-bold">
              {key.replace(/_/g, " ").toUpperCase()}:{" "}
            </span>
            {renderValue(value)}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No data available</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Application Review</h1>
      {Object.entries(data).map(([section, sectionData]) => (
        <div key={section} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {section.replace(/_/g, " ").toUpperCase()}
          </h2>
          {renderSection(sectionData, section)}
        </div>
      ))}
    </div>
  );
};

export default ReviewApplication;
