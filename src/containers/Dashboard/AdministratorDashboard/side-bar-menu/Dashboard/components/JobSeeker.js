// JobSeeker.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  FaRegCalendarAlt,
  FaUniversity,
  FaChartBar,
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(ChartDataLabels);

const JobSeeker = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('job');

  // State for date filter
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-05-31');

  // State for selected course
  const [selectedCourse, setSelectedCourse] = useState('');

  // Dummy data arrays
  const jobTitles = ['Software Engineer', 'Marketing Specialist', 'Accountant', 'Project Manager', 'Sales Executive'];
  const municipalities = ['Metro Manila', 'Cebu City', 'Davao City', 'Baguio City', 'Iloilo City'];
  const educationLevels = ['High School', 'Vocational', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree'];
  const ageBrackets = ['Under 20', '20-24', '25-29', '30-34', '35-39', '40+'];
  const courses = ['Computer Science', 'Business Administration', 'Engineering', 'Education', 'Arts & Sciences'];
  const genders = ['Male', 'Female'];
  const sectors = ['IT & Software', 'Healthcare', 'Manufacturing', 'Finance', 'Retail'];

  // Generate dummy data
  const generateRandomData = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 1000));
  };

  // Generate dates between start and end dates
  const getDatesBetween = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };
  const colorPalette = {
    job: [
      { bg: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)' },   // Teal
      { bg: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)' },   // Blue
      { bg: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)' }, // Purple
    ],
    sex: [
      { bg: 'rgba(255, 99, 132, 0.8)', border: 'rgba(255, 99, 132, 1)' },   // Rose
      { bg: 'rgba(255, 159, 64, 0.8)', border: 'rgba(255, 159, 64, 1)' },   // Orange
    ],
    municipality: [
      { bg: 'rgba(255, 205, 86, 0.8)', border: 'rgba(255, 205, 86, 1)' },   // Yellow
      { bg: 'rgba(100, 149, 237, 0.8)', border: 'rgba(100, 149, 237, 1)' }, // Cornflower Blue
      { bg: 'rgba(30, 144, 255, 0.8)', border: 'rgba(30, 144, 255, 1)' },   // Dodger Blue
    ],
    education: [
      { bg: 'rgba(144, 238, 144, 0.8)', border: 'rgba(144, 238, 144, 1)' }, // Light Green
      { bg: 'rgba(60, 179, 113, 0.8)', border: 'rgba(60, 179, 113, 1)' },   // Medium Sea Green
      { bg: 'rgba(46, 139, 87, 0.8)', border: 'rgba(46, 139, 87, 1)' },     // Sea Green
    ],
    age: [
      { bg: 'rgba(255, 105, 180, 0.8)', border: 'rgba(255, 105, 180, 1)' }, // Hot Pink
      { bg: 'rgba(218, 112, 214, 0.8)', border: 'rgba(218, 112, 214, 1)' }, // Orchid
      { bg: 'rgba(199, 21, 133, 0.8)', border: 'rgba(199, 21, 133, 1)' },   // Medium Violet Red
    ],
    course: [
      { bg: 'rgba(255, 165, 0, 0.8)', border: 'rgba(255, 165, 0, 1)' },     // Orange
      { bg: 'rgba(230, 161, 68, 0.8)', border: 'rgba(230, 161, 68, 1)' },   // Gold
      { bg: 'rgba(204, 85, 0, 0.8)', border: 'rgba(204, 85, 0, 1)' },       // Dark Orange
    ]
  };
  // Employment statistics data
  const employmentStats = {
    labor_force: 15000,
    employed: 12750,
    unemployed: 2250,
    employment_rate: 85.0,
    unemployment_rate: 15.0,
    jobs_created: 1250,
    top_sectors: [
      { Sector: 'IT & Software', HiringCount: 3500 },
      { Sector: 'Healthcare', HiringCount: 2800 },
      { Sector: 'Manufacturing', HiringCount: 2200 },
      { Sector: 'Finance', HiringCount: 1950 },
      { Sector: 'Retail', HiringCount: 1550 }
    ],
    previous_period: {
      employment_rate: 82.7,
      unemployment_rate: 17.3,
      jobs_created: 1125
    }
  };

  // Job data
  const jobData = {
    jobseekers_by_title: jobTitles.map(title => ({
      Title: title,
      NumJobSeekers: Math.floor(Math.random() * 1000)
    })),
    in_demand_jobs: jobTitles.map(title => ({
      Title: title,
      InDemandCount: Math.floor(Math.random() * 500)
    })),
    workers_by_title: getDatesBetween(startDate, endDate).flatMap(date =>
      jobTitles.map(title => ({
        Title: title,
        RecordDate: date,
        NumWorkers: Math.floor(Math.random() * 1000)
      }))
    )
  };

  // Sex data
  const sexData = {
    sex_distribution: genders.map(gender => ({
      Sex: gender,
      Count: Math.floor(Math.random() * 1000)
    })),
    job_preferences_by_sex: jobTitles.flatMap(title =>
      genders.map(gender => ({
        Title: title,
        Sex: gender,
        NumPreferences: Math.floor(Math.random() * 500)
      }))
    ),
    sex_by_municipality: municipalities.flatMap(muni =>
      genders.map(gender => ({
        Municipality: muni,
        Sex: gender,
        NumJobSeekers: Math.floor(Math.random() * 500)
      }))
    )
  };

  // Municipality data
  const municipalityData = {
    hired_by_municipality: municipalities.map(muni => ({
      Municipality: muni,
      District: `District ${Math.ceil(Math.random() * 5)}`,
      NumHired: Math.floor(Math.random() * 1000)
    })),
    hiring_status: municipalities.flatMap(muni =>
      ['Hired', 'Searching', 'Training'].map(status => ({
        Municipality: muni,
        HiringStatus: status,
        Count: Math.floor(Math.random() * 500)
      }))
    ),
    jobseeker_concentration: municipalities.map(muni => ({
      Municipality: muni,
      NumJobSeekers: Math.floor(Math.random() * 2000)
    }))
  };

  // Education data
  const educationData = {
    education_distribution: educationLevels.map(level => ({
      EducationalAttainment: level,
      Count: Math.floor(Math.random() * 1000)
    })),
    job_by_education: educationLevels.flatMap(level =>
      jobTitles.map(title => ({
        Title: title,
        EducationalAttainment: level,
        NumPreferences: Math.floor(Math.random() * 500)
      }))
    ),
    education_by_municipality: municipalities.flatMap(muni =>
      educationLevels.map(level => ({
        Municipality: muni,
        EducationalAttainment: level,
        NumJobSeekers: Math.floor(Math.random() * 500)
      }))
    )
  };

  // Age data
  const ageData = {
    age_distribution: ageBrackets.map(bracket => ({
      AgeBracket: bracket,
      Count: Math.floor(Math.random() * 1000)
    })),
    job_by_age: ageBrackets.flatMap(bracket =>
      jobTitles.map(title => ({
        Title: title,
        AgeBracket: bracket,
        NumPreferences: Math.floor(Math.random() * 500)
      }))
    ),
    age_by_municipality: municipalities.flatMap(muni =>
      ageBrackets.map(bracket => ({
        Municipality: muni,
        AgeBracket: bracket,
        NumJobSeekers: Math.floor(Math.random() * 500)
      }))
    )
  };

  // Course data
  const courseData = {
    course_distribution: courses.map(course => ({
      Course: course,
      Count: Math.floor(Math.random() * 1000)
    })),
    job_by_course: courses.flatMap(course =>
      jobTitles.slice(0, 3).map(title => ({
        Title: title,
        Course: course,
        NumPreferences: Math.floor(Math.random() * 500)
      }))
    ),
    skills_in_demand: ['Programming', 'Digital Marketing', 'Financial Analysis', 'Project Management', 'Customer Service']
      .map(skill => ({
        SkillName: skill,
        DemandCount: Math.floor(Math.random() * 500)
      }))
  };

  // Filtered data based on date range
  const filteredJobData = {
    ...jobData,
    workers_by_title: jobData.workers_by_title.filter(item =>
      item.RecordDate >= startDate && item.RecordDate <= endDate
    )
  };

  // Handler functions
  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const handleApplyFilter = () => {
    // In a real app, we would fetch data based on these dates
    // For now, we just regenerate random data
    console.log(`Applying filter from ${startDate} to ${endDate}`);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Create chart data
  const barColors = [
    { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },   // Teal
    { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },   // Rose
    { bg: 'rgba(255, 205, 86, 0.6)', border: 'rgba(255, 205, 86, 1)' },   // Yellow
    { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },   // Blue
    { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' }, // Purple
  ];

  const createBarChartData = (labels, data, label, colorIndex = 0) => {
    const color = barColors[colorIndex % barColors.length];
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: color.bg,
          borderColor: color.border,
          borderWidth: 1,
        },
      ],
    };
  };

  const doughnutColors = [
    { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
    { bg: 'rgba(255, 205, 86, 0.6)', border: 'rgba(255, 205, 86, 1)' },
    { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' }
  ];

  const createDoughnutChartData = (labels, data) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Distribution',
          data: data,
          backgroundColor: doughnutColors.slice(0, data.length).map(c => c.bg),
          borderColor: doughnutColors.slice(0, data.length).map(c => c.border),
          borderWidth: 1,
        },
      ],
    };
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        font: {
          weight: 'bold'
        },
        formatter: (value) => value.toLocaleString()
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Create job seekers by title chart data
  const jobSeekersByTitleData = createBarChartData(
    jobData.jobseekers_by_title.map(item => item.Title),
    jobData.jobseekers_by_title.map(item => item.NumJobSeekers),
    'Number of Job Seekers'
  );

  // Create in-demand jobs chart data
  const inDemandJobsData = createBarChartData(
    jobData.in_demand_jobs.map(item => item.Title),
    jobData.in_demand_jobs.map(item => item.InDemandCount),
    'Demand Score',
    1
  );

  // Prepare data for line chart
  const prepareLineChartData = () => {
    const titles = [...new Set(filteredJobData.workers_by_title.map(item => item.Title))];

    return {
      labels: [...new Set(filteredJobData.workers_by_title.map(item => item.RecordDate))],
      datasets: titles.map((title, index) => ({
        label: title,
        data: filteredJobData.workers_by_title
          .filter(item => item.Title === title)
          .map(item => item.NumWorkers),
        borderColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 1)`,
        backgroundColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 0.5)`,
        tension: 0.1,
      })),
    };
  };

  const workersTrendData = prepareLineChartData();

  // Create overall sex distribution chart data
  const sexDistributionData = createDoughnutChartData(
    sexData.sex_distribution.map(item => item.Sex),
    sexData.sex_distribution.map(item => item.Count)
  );

  // Create job preferences by sex chart data
  const createJobPreferencesBySexData = () => {
    const titles = [...new Set(sexData.job_preferences_by_sex.map(item => item.Title))];
    const genders = [...new Set(sexData.job_preferences_by_sex.map(item => item.Sex))];

    return {
      labels: titles,
      datasets: genders.map((gender, index) => ({
        label: gender,
        data: titles.map(title => {
          const match = sexData.job_preferences_by_sex.find(
            item => item.Title === title && item.Sex === gender
          );
          return match ? match.NumPreferences : 0;
        }),
        backgroundColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 0.6)`,
        borderColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 1)`,
        borderWidth: 1,
      })),
    };
  };

  const jobPreferencesBySexData = createJobPreferencesBySexData();

  // Create gender distribution by municipality chart data
  const createGenderByMunicipalityData = () => {
    const municipalities = [...new Set(sexData.sex_by_municipality.map(item => item.Municipality))];
    const genders = [...new Set(sexData.sex_by_municipality.map(item => item.Sex))];

    return {
      labels: municipalities,
      datasets: genders.map((gender, index) => ({
        label: gender,
        data: municipalities.map(muni => {
          const match = sexData.sex_by_municipality.find(
            item => item.Municipality === muni && item.Sex === gender
          );
          return match ? match.NumJobSeekers : 0;
        }),
        backgroundColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 0.6)`,
        borderColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 1)`,
        borderWidth: 1,
      })),
    };
  };

  const genderByMunicipalityData = createGenderByMunicipalityData();

  // Create hired job seekers by municipality chart data
  const hiredByMunicipalityData = createBarChartData(
    municipalityData.hired_by_municipality.map(item => `${item.Municipality} (${item.District})`),
    municipalityData.hired_by_municipality.map(item => item.NumHired),
    'Number of Hired Job Seekers',
    2
  );

  // Create hiring status by municipality chart data
  const createHiringStatusData = () => {
    const municipalities = [...new Set(municipalityData.hiring_status.map(item => item.Municipality))];
    const statuses = [...new Set(municipalityData.hiring_status.map(item => item.HiringStatus))];

    return {
      labels: municipalities,
      datasets: statuses.map((status, index) => ({
        label: status,
        data: municipalities.map(muni => {
          const match = municipalityData.hiring_status.find(
            item => item.Municipality === muni && item.HiringStatus === status
          );
          return match ? match.Count : 0;
        }),
        backgroundColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 0.6)`,
        borderColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 1)`,
        borderWidth: 1,
      })),
    };
  };

  const hiringStatusData = createHiringStatusData();

  // Create educational attainment distribution chart data
  const educationDistributionData = createBarChartData(
    educationData.education_distribution.map(item => item.EducationalAttainment),
    educationData.education_distribution.map(item => item.Count),
    'Number of Job Seekers',
    3
  );

  // Create job preferences by educational attainment chart data
  const jobByEducationData = createBarChartData(
    educationData.job_by_education.map(item => `${item.Title} (${item.EducationalAttainment})`),
    educationData.job_by_education.map(item => item.NumPreferences),
    'Number of Preferences',
    4
  );

  // Create educational attainment by municipality chart data
  const createEducationByMunicipalityData = () => {
    const municipalities = [...new Set(educationData.education_by_municipality.map(item => item.Municipality))];
    const levels = [...new Set(educationData.education_by_municipality.map(item => item.EducationalAttainment))];

    return {
      labels: municipalities,
      datasets: levels.map((level, index) => ({
        label: level,
        data: municipalities.map(muni => {
          const match = educationData.education_by_municipality.find(
            item => item.Municipality === muni && item.EducationalAttainment === level
          );
          return match ? match.NumJobSeekers : 0;
        }),
        backgroundColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 0.6)`,
        borderColor: `rgba(${index * 50 + 52}, ${index * 50 + 152}, ${index * 50 + 219}, 1)`,
        borderWidth: 1,
      })),
    };
  };

  const educationByMunicipalityData = createEducationByMunicipalityData();

  // Create age distribution chart data
  const ageDistributionData = createBarChartData(
    ageData.age_distribution.map(item => item.AgeBracket),
    ageData.age_distribution.map(item => item.Count),
    'Number of Job Seekers',
    5
  );

  // Create job preferences by age group chart data
  const jobByAgeData = createBarChartData(
    ageData.job_by_age.map(item => `${item.Title} (${item.AgeBracket})`),
    ageData.job_by_age.map(item => item.NumPreferences),
    'Number of Preferences',
    1
  );

  // Create course distribution chart data
  const courseDistributionData = createDoughnutChartData(
    courseData.course_distribution.map(item => item.Course),
    courseData.course_distribution.map(item => item.Count)
  );

  // Create job preferences by course chart data
  const jobByCourseData = createBarChartData(
    courseData.job_by_course.map(item => `${item.Title} (${item.Course})`),
    courseData.job_by_course.map(item => item.NumPreferences),
    'Number of Preferences',
    2
  );

  // Create skills in demand chart data
  const skillsInDemandData = createBarChartData(
    courseData.skills_in_demand.map(item => item.SkillName),
    courseData.skills_in_demand.map(item => item.DemandCount),
    'Demand Score',
    3
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 shadow-md relative">
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded shadow"
        >
          Back
        </button>
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Job Seeker Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'job', label: 'Filter by Job', icon: <FaChartBar /> },
            { id: 'sex', label: 'Filter by Sex', icon: <FaUsers /> },
            { id: 'municipality', label: 'Filter by Municipality', icon: <FaUniversity /> },
            { id: 'education', label: 'Filter by Education', icon: <FaChalkboardTeacher /> },
            { id: 'age', label: 'Filter by Age', icon: <FaUserGraduate /> },
            { id: 'course', label: 'Filter by Course', icon: <FaFilter /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeSection === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center">
            <label htmlFor="start-date" className="mr-2 font-medium">From:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="end-date" className="mr-2 font-medium">To:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleApplyFilter}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaRegCalendarAlt className="mr-1" />
            Apply Filter
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Job Section */}
          {activeSection === 'job' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Seekers Distribution */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Seeker Distribution by Job Title</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={jobSeekersByTitleData} />
                </div>
              </div>

              {/* Most In-Demand Jobs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Most In-Demand Job Titles</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={inDemandJobsData} />
                </div>
              </div>

              {/* Workers Trend */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Workers Trend by Job Title</h2>
                </div>
                <div className="p-4">
                  <Line options={{
                    ...options,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Date'
                        }
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Workers'
                        }
                      }
                    }
                  }} data={workersTrendData} />
                </div>
              </div>

              {/* Employment Dashboard - Custom Table-like View */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Employment Dashboard</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Metric</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Total Labor Force</td>
                        <td className="px-4 py-2">{employmentStats.labor_force.toLocaleString()}</td>
                        <td className="px-4 py-2">—</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Employed</td>
                        <td className="px-4 py-2">{employmentStats.employed.toLocaleString()}</td>
                        <td className="px-4 py-2">—</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Unemployed</td>
                        <td className="px-4 py-2">{employmentStats.unemployed.toLocaleString()}</td>
                        <td className="px-4 py-2">—</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Employment Rate</td>
                        <td className="px-4 py-2">{employmentStats.employment_rate.toFixed(1)}%</td>
                        <td className="px-4 py-2">
                          <span className={`${employmentStats.employment_rate - employmentStats.previous_period.employment_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {employmentStats.employment_rate - employmentStats.previous_period.employment_rate >= 0 ? '↑ ' : '↓ '}
                            {Math.abs(employmentStats.employment_rate - employmentStats.previous_period.employment_rate).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Unemployment Rate</td>
                        <td className="px-4 py-2">{employmentStats.unemployment_rate.toFixed(1)}%</td>
                        <td className="px-4 py-2">
                          <span className={`${employmentStats.unemployment_rate - employmentStats.previous_period.unemployment_rate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {employmentStats.unemployment_rate - employmentStats.previous_period.unemployment_rate <= 0 ? '↓ ' : '↑ '}
                            {Math.abs(employmentStats.unemployment_rate - employmentStats.previous_period.unemployment_rate).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Jobs Created</td>
                        <td className="px-4 py-2">{employmentStats.jobs_created.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span className={`${employmentStats.jobs_created - employmentStats.previous_period.jobs_created >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {employmentStats.jobs_created - employmentStats.previous_period.jobs_created >= 0 ? '↑ ' : '↓ '}
                            {Math.abs(employmentStats.jobs_created - employmentStats.previous_period.jobs_created).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Top Hiring Sectors</td>
                        <td className="px-4 py-2">
                          {employmentStats.top_sectors[0].Sector} ({employmentStats.top_sectors[0].HiringCount.toLocaleString()})
                        </td>
                        <td className="px-4 py-2">
                          {employmentStats.top_sectors.slice(1, 3).map((sector, idx) => (
                            <span key={idx}>
                              {sector.Sector} ({sector.HiringCount.toLocaleString()})
                              {idx < employmentStats.top_sectors.length - 2 && ', '}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sex Section */}
          {activeSection === 'sex' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Sex Distribution */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Overall Sex Distribution</h2>
                </div>
                <div className="p-4">
                  <Doughnut options={options} data={sexDistributionData} />
                </div>
              </div>

              {/* Job Preferences by Sex */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Preferences by Sex</h2>
                </div>
                <div className="p-4">
                  <Bar options={{
                    ...options,
                    scales: {
                      x: {
                        stacked: true
                      },
                      y: {
                        stacked: true
                      }
                    }
                  }} data={jobPreferencesBySexData} />
                </div>
              </div>

              {/* Gender Distribution by Municipality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Gender Distribution by Municipality</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={genderByMunicipalityData} />
                </div>
              </div>
            </div>
          )}

          {/* Municipality Section */}
          {activeSection === 'municipality' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hired Job Seekers by Municipality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Hired Job Seekers by Municipality</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={hiredByMunicipalityData} />
                </div>
              </div>

              {/* Hiring Status by Municipality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Hiring Status by Municipality</h2>
                </div>
                <div className="p-4">
                  <Bar options={{
                    ...options,
                    scales: {
                      x: {
                        stacked: true
                      },
                      y: {
                        stacked: true
                      }
                    }
                  }} data={hiringStatusData} />
                </div>
              </div>

              {/* Job Seeker Concentration Heatmap (Simplified) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Seeker Concentration by Municipality</h2>
                </div>
                <div className="p-4 flex flex-wrap gap-4">
                  {municipalityData.jobseeker_concentration.map((muni, index) => (
                    <div key={index} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                      <div className="relative pt-[100%] rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-blue-100">
                          <div className="text-sm font-medium text-center">{muni.Municipality}</div>
                          <div className="mt-2 text-lg font-bold">{muni.NumJobSeekers}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Educational Attainment Distribution */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Educational Attainment Distribution</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={educationDistributionData} />
                </div>
              </div>

              {/* Job Preferences by Educational Attainment */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Preferences by Educational Attainment</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={jobByEducationData} />
                </div>
              </div>

              {/* Educational Attainment by Municipality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Educational Attainment by Municipality</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={educationByMunicipalityData} />
                </div>
              </div>
            </div>
          )}

          {/* Age Section */}
          {activeSection === 'age' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution of Job Seekers */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Age Distribution of Job Seekers</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={ageDistributionData} />
                </div>
              </div>

              {/* Job Preferences by Age Group */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Preferences by Age Group</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={jobByAgeData} />
                </div>
              </div>

              {/* Age Distribution by Municipality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Age Distribution by Municipality</h2>
                </div>
                <div className="p-4 flex flex-wrap gap-4">
                  {ageData.age_by_municipality.map((item, index) => (
                    <div key={index} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 p-2">
                      <div className="relative pt-[100%] rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-yellow-100">
                          <div className="text-xs font-medium text-center">{item.Municipality}</div>
                          <div className="text-xs text-center mt-1">{item.AgeBracket}</div>
                          <div className="mt-2 text-lg font-bold">{item.NumJobSeekers}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Course Section */}
          {activeSection === 'course' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Selector */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Filter by Course</h2>
                </div>
                <div className="p-4">
                  <select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Distribution */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Course Distribution</h2>
                </div>
                <div className="p-4">
                  <Doughnut options={options} data={courseDistributionData} />
                </div>
              </div>

              {/* Job Preferences by Course */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Job Preferences by Course</h2>
                </div>
                <div className="p-4">
                  <Bar options={options} data={jobByCourseData} />
                </div>
              </div>

              {/* Skills in Demand */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                <div className="bg-teal-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Top 10 Skills in Demand</h2>
                </div>
                <div className="p-4">
                  {selectedCourse ? (
                    <Bar options={{
                      ...options,
                      indexAxis: 'y',
                      scales: {
                        x: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Demand Score'
                          }
                        },
                        y: {
                          ticks: {
                            padding: 10
                          }
                        }
                      }
                    }} data={skillsInDemandData} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <FaChartBar size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">Please select a course to view skills in demand</p>
                      <p className="text-sm mt-2">Use the dropdown above to choose a course</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Job Seeker Dashboard - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default JobSeeker;