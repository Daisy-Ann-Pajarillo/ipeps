// Trend.js
import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';
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
    Legend
} from 'chart.js';

// Register Chart.js components
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

const Trend = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [chartData, setChartData] = useState({
        gender: [],
        educationJobs: { labels: [], datasets: [] },
        fieldJobs: { labels: [], datasets: [] },
        municipalityTrend: { labels: [], datasets: [] },
        demand: { horizontal: [], grouped: [], scatter: [] }
    });

    // Custom SVG Icons
    const Icons = {
        Gender: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        Education: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9V15L12 20L21 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        Field: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9H21M9 3V21M15 3V21" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        Location: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        Trend: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18L9 12L13 16L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    };

    // Dummy Data
    const dummyData = {
        gender: [
            { sex: 'Male', count: 45 },
            { sex: 'Female', count: 55 }
        ],
        educationJobs: {
            labels: ["HS", "Diploma", "Bachelor's", "Master's", "PhD"],
            datasets: [
                { label: "Engineering", data: [12, 15, 20, 25, 30], color: 'bg-blue-500' },
                { label: "Healthcare", data: [8, 10, 15, 18, 22], color: 'bg-green-500' },
                { label: "Education", data: [10, 12, 18, 20, 25], color: 'bg-yellow-500' }
            ]
        },
        fieldJobs: {
            labels: ["STEM", "Business", "Health", "Arts", "IT"],
            datasets: [
                { label: "Engineering", data: [25, 15, 10, 5, 20], color: 'bg-blue-500' },
                { label: "Medicine", data: [10, 8, 30, 5, 15], color: 'bg-green-500' },
                { label: "Teaching", data: [15, 10, 20, 25, 12], color: 'bg-yellow-500' }
            ]
        },
        municipalityTrend: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [
                { label: "Metro Manila", data: [120, 150, 130, 170, 190], color: 'bg-blue-500' },
                { label: "Cebu", data: [80, 90, 110, 120, 140], color: 'bg-green-500' },
                { label: "Davao", data: [60, 70, 90, 100, 120], color: 'bg-red-500' }
            ]
        },
        demand: {
            horizontal: [
                { job: "Software Engineer", count: 245 },
                { job: "Nurse", count: 198 },
                { job: "Accountant", count: 187 },
                { job: "Teacher", count: 175 },
                { job: "Engineer", count: 165 }
            ],
            grouped: [
                { job: "Developer", apps: 150, prefs: 130 },
                { job: "Doctor", apps: 120, prefs: 140 },
                { job: "Designer", apps: 100, prefs: 90 }
            ],
            scatter: [
                { job: "A", x: 50, y: 60 },
                { job: "B", x: 70, y: 80 },
                { job: "C", x: 90, y: 70 },
                { job: "D", x: 60, y: 50 },
                { job: "E", x: 80, y: 90 }
            ]
        }
    };

    // Tab Navigation
    const tabs = [
        { id: '1', name: 'Gender Distribution', icon: Icons.Gender },
        { id: '2', name: 'Educational Attainment', icon: Icons.Education },
        { id: '3', name: 'Field of Study', icon: Icons.Field },
        { id: '4', name: 'Municipality Trends', icon: Icons.Location },
        { id: '5', name: 'In-Demand Jobs', icon: Icons.Trend }
    ];

    // Process data for charts
    useEffect(() => {
        setChartData({
            gender: dummyData.gender,
            educationJobs: {
                labels: dummyData.educationJobs.labels,
                datasets: dummyData.educationJobs.datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 0.7)'),
                    borderColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 1)')
                }))
            },
            fieldJobs: {
                labels: dummyData.fieldJobs.labels,
                datasets: dummyData.fieldJobs.datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 0.7)'),
                    borderColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 1)')
                }))
            },
            municipalityTrend: {
                labels: dummyData.municipalityTrend.labels,
                datasets: dummyData.municipalityTrend.datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 1)'),
                    backgroundColor: dataset.color.replace('bg-', 'rgba(').replace('-500', ', 0.2)')
                }))
            },
            demand: {
                horizontal: dummyData.demand.horizontal,
                grouped: dummyData.demand.grouped,
                scatter: dummyData.demand.scatter
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-indigo-800">Job Trend Visualizations Dashboard</h1>
                    <p className="text-gray-600 mt-2">Interactive insights into job seeker data and job market trends</p>
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
                    {/* Section 1: Gender Distribution */}
                    {activeTab === '1' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">Registered Job Seekers by Sex</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Gender Distribution</h3>
                                    {chartData.gender.length > 0 && (
                                        <div className="h-80">
                                            <Doughnut
                                                data={{
                                                    labels: chartData.gender.map(item => item.sex),
                                                    datasets: [{
                                                        data: chartData.gender.map(item => item.count),
                                                        backgroundColor: ['#4e73df', '#e74a3b'],
                                                        borderColor: 'white',
                                                        borderWidth: 2
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: { position: 'bottom' },
                                                        title: { display: true, text: 'Distribution by Gender' }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Bar Chart */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Job Seekers by Gender</h3>
                                    {chartData.gender.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: chartData.gender.map(item => item.sex),
                                                    datasets: [{
                                                        label: 'Number of Job Seekers',
                                                        data: chartData.gender.map(item => item.count),
                                                        backgroundColor: ['#4e73df', '#e74a3b'],
                                                        borderColor: ['#4e73df', '#e74a3b'],
                                                        borderWidth: 1
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            title: { display: true, text: 'Number of Job Seekers' }
                                                        }
                                                    },
                                                    plugins: {
                                                        title: { display: true, text: 'Job Seekers by Gender' }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Educational Attainment */}
                    {activeTab === '2' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">Top Jobs by Educational Attainment</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                                    {chartData.educationJobs.labels.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={chartData.educationJobs}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        y: { beginAtZero: true, title: { display: true, text: 'Number of Applications' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Stacked Bar Chart</h3>
                                    {chartData.educationJobs.labels.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={chartData.educationJobs}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        x: { title: { display: true, text: 'Educational Attainment' } },
                                                        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Number of Applications' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Field of Study */}
                    {activeTab === '3' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">Job Distribution by Field of Study</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Horizontal Bar Chart</h3>
                                    {chartData.fieldJobs.labels.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: chartData.fieldJobs.labels,
                                                    datasets: chartData.fieldJobs.datasets
                                                }}
                                                options={{
                                                    indexAxis: 'y',
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: {
                                                        x: { beginAtZero: true, title: { display: true, text: 'Number of Applications' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Grouped Bar Chart</h3>
                                    {chartData.fieldJobs.labels.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: chartData.fieldJobs.labels,
                                                    datasets: chartData.fieldJobs.datasets
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        y: { beginAtZero: true, title: { display: true, text: 'Number of Applications' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Municipality Trends */}
                    {activeTab === '4' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">Job Trends by Municipality</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Line Chart (Over Time)</h3>
                                    {chartData.municipalityTrend.labels.length > 0 && (
                                        <div className="h-80">
                                            <Line
                                                data={chartData.municipalityTrend}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        y: { beginAtZero: true, title: { display: true, text: 'Number of Applications' } },
                                                        x: { title: { display: true, text: 'Time Period' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Stacked Bar Chart</h3>
                                    {chartData.municipalityTrend.labels.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={chartData.municipalityTrend}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        x: { title: { display: true, text: 'Municipality' } },
                                                        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Number of Applications' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 5: In-Demand Jobs */}
                    {activeTab === '5' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold mb-6">In-Demand Jobs Analysis</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Horizontal Bar Chart */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Total Interest</h3>
                                    {chartData.demand.horizontal.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: chartData.demand.horizontal.map(item => item.job),
                                                    datasets: [{
                                                        label: 'Total Interest',
                                                        data: chartData.demand.horizontal.map(item => item.count),
                                                        backgroundColor: '#4e73df'
                                                    }]
                                                }}
                                                options={{
                                                    indexAxis: 'y',
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: {
                                                        x: { beginAtZero: true, title: { display: true, text: 'Total Interest' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Grouped Bar Chart */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Applications vs. Preferences</h3>
                                    {chartData.demand.grouped.length > 0 && (
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: chartData.demand.grouped.map(item => item.job),
                                                    datasets: [
                                                        {
                                                            label: 'Applications',
                                                            data: chartData.demand.grouped.map(item => item.apps),
                                                            backgroundColor: '#4e73df'
                                                        },
                                                        {
                                                            label: 'Preferences',
                                                            data: chartData.demand.grouped.map(item => item.prefs),
                                                            backgroundColor: '#1cc88a'
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { position: 'bottom' } },
                                                    scales: {
                                                        y: { beginAtZero: true, title: { display: true, text: 'Count' } }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Scatter Chart */}
                                <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                                    <h3 className="text-lg font-medium mb-2">Correlation: Applications vs. Preferences</h3>
                                    {chartData.demand.scatter.length > 0 && (
                                        <div className="h-80">
                                            <Scatter
                                                data={{
                                                    datasets: [{
                                                        label: 'Jobs',
                                                        data: chartData.demand.scatter.map(item => ({
                                                            x: item.x,
                                                            y: item.y
                                                        })),
                                                        backgroundColor: '#4e73df',
                                                        borderColor: '#4e73df',
                                                        pointRadius: 5
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        title: { display: true, text: 'Correlation: Applications vs. Preferences' },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (context) {
                                                                    const pointIndex = context.dataIndex;
                                                                    return `Job ${pointIndex + 1}: Apps(${context.parsed.x}), Prefs(${context.parsed.y})`;
                                                                }
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        x: {
                                                            type: 'linear',
                                                            title: { display: true, text: 'Number of Applications' },
                                                            beginAtZero: true
                                                        },
                                                        y: {
                                                            type: 'linear',
                                                            title: { display: true, text: 'Number of Preferences' },
                                                            beginAtZero: true
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trend;