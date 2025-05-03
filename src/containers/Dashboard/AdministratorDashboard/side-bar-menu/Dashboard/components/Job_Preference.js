// JobPreference.js
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dummy Data
const dummyData = {
  occupationBySex: [
    { preferred_occupation: "Engineer", sex: "Male", count: 45 },
    { preferred_occupation: "Engineer", sex: "Female", count: 25 },
    { preferred_occupation: "Doctor", sex: "Male", count: 30 },
    { preferred_occupation: "Doctor", sex: "Female", count: 35 },
    { preferred_occupation: "Teacher", sex: "Male", count: 20 },
    { preferred_occupation: "Teacher", sex: "Female", count: 40 }
  ],
  occupationByField: [
    { preferred_occupation: "Engineer", field_of_study: "STEM", count: 60 },
    { preferred_occupation: "Engineer", field_of_study: "Business", count: 15 },
    { preferred_occupation: "Doctor", field_of_study: "Healthcare", count: 50 },
    { preferred_occupation: "Teacher", field_of_study: "Education", count: 45 }
  ],
  locationBySex: [
    { location: "Urban", sex: "Male", count: 65 },
    { location: "Urban", sex: "Female", count: 70 },
    { location: "Suburban", sex: "Male", count: 40 },
    { location: "Suburban", sex: "Female", count: 45 },
    { location: "Rural", sex: "Male", count: 25 },
    { location: "Rural", sex: "Female", count: 30 }
  ],
  locationByAge: [
    { location: "Urban", age_bracket: "Under 20", count: 15 },
    { location: "Urban", age_bracket: "20-29", count: 50 },
    { location: "Urban", age_bracket: "30-39", count: 60 },
    { location: "Urban", age_bracket: "40-49", count: 45 },
    { location: "Urban", age_bracket: "50+", count: 35 },
    { location: "Suburban", age_bracket: "Under 20", count: 10 },
    { location: "Suburban", age_bracket: "20-29", count: 30 },
    { location: "Suburban", age_bracket: "30-39", count: 40 },
    { location: "Suburban", age_bracket: "40-49", count: 35 },
    { location: "Suburban", age_bracket: "50+", count: 30 },
    { location: "Rural", age_bracket: "Under 20", count: 5 },
    { location: "Rural", age_bracket: "20-29", count: 15 },
    { location: "Rural", age_bracket: "30-39", count: 20 },
    { location: "Rural", age_bracket: "40-49", count: 18 },
    { location: "Rural", age_bracket: "50+", count: 12 }
  ]
};

const JobPreference = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [chartData, setChartData] = useState({
    occupationBySex: { labels: [], datasets: [] },
    occupationByField: { labels: [], datasets: [] },
    locationBySex: { labels: [], datasets: [] },
    locationByAge: { labels: [], datasets: [], lineData: {} }
  });

  // SVG Icons
  const Icons = {
    Occupation: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12H15M12 9V15M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Location: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    Age: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 16H16M8 8H8.01M16 8H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Education: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14L3 9L12 4L21 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9V15L12 20L21 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  const tabs = [
    { id: '1', name: 'Occupation by Sex', icon: Icons.Occupation },
    { id: '2', name: 'Occupation by Field', icon: Icons.Occupation },
    { id: '3', name: 'Location by Sex', icon: Icons.Location },
    { id: '4', name: 'Location by Age', icon: Icons.Age }
  ];

  // Data Processing Functions
  const processOccupationBySexData = (data) => {
    const occupations = [...new Set(data.map(item => item.preferred_occupation))];
    const maleData = occupations.map(occ =>
      data.find(item => item.preferred_occupation === occ && item.sex === 'Male')?.count || 0
    );
    const femaleData = occupations.map(occ =>
      data.find(item => item.preferred_occupation === occ && item.sex === 'Female')?.count || 0
    );

    return {
      labels: occupations,
      datasets: [
        {
          label: 'Male',
          data: maleData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Female',
          data: femaleData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }
      ]
    };
  };

  const processOccupationByFieldData = (data) => {
    const fields = [...new Set(data.map(item => item.field_of_study))];
    const occupations = [...new Set(data.map(item => item.preferred_occupation))];

    const datasets = fields.map((field, index) => ({
      label: field,
      data: occupations.map(occ =>
        data.find(item => item.preferred_occupation === occ && item.field_of_study === field)?.count || 0
      ),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
    }));

    return {
      labels: occupations,
      datasets
    };
  };

  const processLocationBySexData = (data) => {
    const locations = [...new Set(data.map(item => item.location))];
    const maleData = locations.map(loc =>
      data.find(item => item.location === loc && item.sex === 'Male')?.count || 0
    );
    const femaleData = locations.map(loc =>
      data.find(item => item.location === loc && item.sex === 'Female')?.count || 0
    );

    return {
      labels: locations,
      datasets: [
        {
          label: 'Male',
          data: maleData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Female',
          data: femaleData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }
      ]
    };
  };

  const processLocationByAgeData = (data) => {
    const locations = [...new Set(data.map(item => item.location))];
    const ageBrackets = ["Under 20", "20-29", "30-39", "40-49", "50+"];

    const groupedData = ageBrackets.map((bracket, index) => ({
      label: bracket,
      data: locations.map(loc =>
        data.find(item => item.location === loc && item.age_bracket === bracket)?.count || 0
      ),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
    }));

    // Process data for line chart
    const lineData = {
      labels: ageBrackets,
      datasets: locations.map((loc, index) => ({
        label: loc,
        data: ageBrackets.map(bracket =>
          data.find(item => item.location === loc && item.age_bracket === bracket)?.count || 0
        ),
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        backgroundColor: 'transparent',
        tension: 0.3
      }))
    };

    return {
      labels: locations,
      datasets: groupedData,
      lineData
    };
  };

  useEffect(() => {
    setChartData({
      occupationBySex: processOccupationBySexData(dummyData.occupationBySex),
      occupationByField: processOccupationByFieldData(dummyData.occupationByField),
      locationBySex: processLocationBySexData(dummyData.locationBySex),
      locationByAge: processLocationByAgeData(dummyData.locationByAge)
    });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case '1':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Preferred Occupation Segmented by Sex</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                {chartData.occupationBySex.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.occupationBySex}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: false },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Stacked Bar Chart</h3>
                {chartData.occupationBySex.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.occupationBySex}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: true },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case '2':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Preferred Occupation Segmented by Field of Study</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                {chartData.occupationByField.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.occupationByField}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: false },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Stacked Bar Chart</h3>
                {chartData.occupationByField.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.occupationByField}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: true },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case '3':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Preferred Job Location Segmented by Sex</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                {chartData.locationBySex.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.locationBySex}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: false },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Stacked Bar Chart</h3>
                {chartData.locationBySex.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.locationBySex}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: true },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case '4':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Preferred Job Location Segmented by Age Brackets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                {chartData.locationByAge.labels.length > 0 && (
                  <div className="h-80">
                    <Bar
                      data={chartData.locationByAge}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { stacked: false },
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Line Chart</h3>
                {chartData.locationByAge.lineData.labels && chartData.locationByAge.lineData.labels.length > 0 && (
                  <div className="h-80">
                    <Line
                      data={chartData.locationByAge.lineData}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { title: { display: true, text: 'Age Bracket' } },
                          y: { beginAtZero: true, title: { display: true, text: 'Preferences' } }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-800">Job Market Visualizations Dashboard</h1>
          <p className="text-gray-600 mt-2">Analysis of job preferences, education, and demographics</p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-50'
                }`}
            >
              <tab.icon />
              <span className="ml-2">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default JobPreference;