import React, { useState, useEffect } from 'react';
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
import axios from '../../../../../../axios';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../../store/actions/index';

// Lucide Icons
import {
  BarChart2,
  Users,
  GraduationCap,
  MapPin,
  Settings,
  Star,
  Download,
  ArrowLeft,
  Eye,
  TrendingUp,
} from 'lucide-react';

// Excel/CSV export
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const JobSeeker = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [apiData, setApiData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: ''
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Fetch auth storage
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch analytics data
  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/jobseeker-statistics${params ? `?${params}` : ''}`, {
        auth: { username: auth.token },
      });
      setApiData(res.data);
      console.log('Fetched API Data:', res.data);
    } catch (error) {
      console.error('Error fetching jobseeker statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial load without any date filters
  }, [auth.token]);

  // Extract relevant data from API response
  const jobPreferences =
    apiData.job_seekers?.course?.distribution || [];

  const demographicsAge =
    apiData.jobseeker_demographics?.age_distribution?.detailed_data || [];

  const demographicsGender =
    apiData.jobseeker_demographics?.gender_distribution?.detailed_data || [];

  const hiredPerMonth =
    apiData.job_seekers?.job?.workers_trend || [];

  const skillsMonthly =
    apiData.jobseeker_skills_per_municipality?.municipality_summary?.[0]?.top_skills || [];

  const totalJobPreferences = jobPreferences.reduce((sum, item) => sum + item.count, 0);
  const totalHired = hiredPerMonth.reduce((sum, item) => sum + item.hired, 0);

  // Card configurations with date support where applicable
  const cardConfigs = [
    {
      id: 'preferences',
      title: "Job Seekers Course Preferences",
      subtitle: "Most sought-after courses",
      icon: <BarChart2 className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      total: totalJobPreferences,
      change: '+12.5%',
      hasDateFilter: true
    },
    {
      id: 'hired',
      title: 'Job Seekers Hired Per Month',
      subtitle: 'Successful placements by month',
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      total: totalHired,
      change: '+8.3%',
      hasDateFilter: true
    },
    {
      id: 'demographics-age',
      title: 'Jobseekers Demographics (Age)',
      subtitle: 'Age breakdown of job seekers',
      icon: <GraduationCap className="w-6 h-6" />,
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      total: demographicsAge.reduce((sum, d) => sum + d.count, 0),
      change: '+6.2%'
    },
    {
      id: 'demographics-gender',
      title: 'Jobseekers Gender Distribution',
      subtitle: 'Male vs Female distribution',
      icon: <GraduationCap className="w-6 h-6" />,
      gradient: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      total: demographicsGender.reduce((sum, d) => sum + d.count, 0),
      change: '+6.2%'
    },
    {
      id: 'skills',
      title: 'In-Demand Skills',
      subtitle: 'Top skills by job seekers',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-teal-500 to-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      total: skillsMonthly.length,
      change: '+9.8%',
      hasDateFilter: true
    },
    {
      id: 'top10',
      title: 'Top In-Demand Jobs',
      subtitle: 'Highest demand positions',
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      total: jobPreferences.length,
      change: '+4.1%',
      hasDateFilter: true
    }
  ];

  // Chart options
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 6,
        cornerRadius: 8
      },
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'end',
        color: '#374151',
        font: { weight: 'bold', size: 11 },
        formatter: (value) => value.toLocaleString()
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 },
          color: '#6B7280'
        },
        grid: { display: false },
        barThickness: 4
      },
      y: {
        ticks: { display: false },
        grid: { display: false }
      }
    },
    backgroundColor: 'white'
  };

  const lineChartOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      datalabels: { display: false }
    },
    scales: {
      x: {
        ticks: { font: { size: 11 }, color: '#6B7280' },
        grid: { display: true, color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: { display: true, font: { size: 11 }, color: '#6B7280' },
        grid: { display: true, color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 11 },
          color: '#374151',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 1,
        cornerRadius: 8
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: { weight: 'bold', size: 10 },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          return `${((value / total) * 100).toFixed(1)}%`;
        }
      }
    }
  };

  const renderChart = () => {
    if (!selectedCard || loading)
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );

    const chartConfig = {
      preferences: {
        component: Bar,
        options: baseOptions,
        data: {
          labels: jobPreferences.map(p => p.course),
          datasets: [{
            label: 'Number of Job Seekers',
            data: jobPreferences.map(p => p.count),
            backgroundColor: 'rgba(14, 165, 233, 0.8)', // Sky Blue
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1
          }]
        }
      },
      hired: {
        component: Line,
        options: lineChartOptions,
        data: {
          labels: hiredPerMonth.map(h => h.month),
          datasets: [{
            label: 'Hired Job Seekers',
            data: hiredPerMonth.map(h => h.hired),
            borderColor: 'rgba(16, 185, 129, 1)',       // Emerald Green
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            fill: true,
            tension: 0.4
          }]
        }
      },
      'demographics-age': {
        component: Doughnut,
        options: doughnutChartOptions,
        data: {
          labels: demographicsAge.map(d => d.age_range),
          datasets: [{
            label: 'Demographics',
            data: demographicsAge.map(d => d.count),
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',   // Red
              'rgba(249, 115, 22, 0.8)',  // Orange
              'rgba(245, 158, 11, 0.8)',  // Amber
              'rgba(34, 197, 94, 0.8)',   // Emerald
              'rgba(59, 130, 246, 0.8)',  // Blue
              'rgba(139, 92, 246, 0.8)',  // Violet
              'rgba(217, 119, 252, 0.8)'  // Pink
            ],
            borderColor: '#fff',
            borderWidth: 3
          }]
        }
      },
      'demographics-gender': {
        component: Doughnut,
        options: doughnutChartOptions,
        data: {
          labels: demographicsGender.map(d => d.gender),
          datasets: [{
            label: 'Gender Distribution',
            data: demographicsGender.map(d => d.count),
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(244, 63, 94, 0.8)'],
            borderColor: '#fff',
            borderWidth: 3
          }]
        }
      },
      skills: {
        component: Bar,
        options: baseOptions,
        data: {
          labels: skillsMonthly.map(s => s.skill),
          datasets: [{
            label: 'Skills',
            data: skillsMonthly.map(s => s.count),
            backgroundColor: 'rgba(20, 184, 166, 0.8)', // Teal
            borderColor: 'rgba(20, 184, 166, 1)',
            borderWidth: 2
          }]
        }
      },
      top10: {
        component: Bar,
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: {
              ticks: { display: true, font: { size: 11 }, color: '#6B7280' },
              grid: { display: true, color: 'rgba(156, 163, 175, 0.1)' }
            },
            y: {
              ticks: { font: { size: 11 }, color: '#6B7280' },
              grid: { display: false }
            }
          }
        },
        data: {
          labels: jobPreferences.slice(0, 10).map(p => p.course),
          datasets: [{
            label: 'Top 10 Courses',
            data: jobPreferences.slice(0, 10).map(p => p.count),
            backgroundColor: 'rgba(245, 149, 96, 0.8)', // Warm Amber
            borderColor: 'rgba(245, 149, 96, 1)',
            borderWidth: 2
          }]
        }
      }
    };

    const config = chartConfig[selectedCard.id];
    if (!config) return null;

    const ChartComponent = config.component;
    const chartData = config.data;

    const hasData =
      chartData.labels && chartData.labels.length > 0 &&
      chartData.datasets.some(ds => ds.data.length > 0);

    return (
      <div className="h-96 exportable-chart" data-chartid={selectedCard.id}>
        {hasData ? (
          <ChartComponent options={config.options} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            No data available
          </div>
        )}
      </div>
    );
  };

  const Data_Export_as_excel = (format) => {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Course Preferences
    const courseTable = apiData.job_seekers?.course?.distribution || [];
    const courseSheet = XLSX.utils.json_to_sheet(courseTable);
    XLSX.utils.book_append_sheet(workbook, courseSheet, 'Course Preferences');

    // Sheet 2: Age Demographics
    const ageTable = apiData.jobseeker_demographics?.age_distribution?.detailed_data || [];
    const ageSheet = XLSX.utils.json_to_sheet(ageTable);
    XLSX.utils.book_append_sheet(workbook, ageSheet, 'Demographics - Age');

    // Sheet 3: Gender Demographics
    const genderTable = apiData.jobseeker_demographics?.gender_distribution?.detailed_data || [];
    const genderSheet = XLSX.utils.json_to_sheet(genderTable);
    XLSX.utils.book_append_sheet(workbook, genderSheet, 'Demographics - Gender');

    // Sheet 4: Job Skills
    const skillTable = apiData.jobseeker_skills_per_municipality?.skills_detailed || [];
    const skillSheet = XLSX.utils.json_to_sheet(skillTable);
    XLSX.utils.book_append_sheet(workbook, skillSheet, 'Skills');

    // Sheet 5: Summary Stats
    const summaryTable = [
      { Metric: "Total Job Seekers", Value: apiData.jobseeker_demographics?.total_jobseekers || 0 },
      { Metric: "Last Updated", Value: new Date(apiData.meta?.generated_at).toLocaleString() }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryTable);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Write and Save
    const excelBuffer = XLSX.write(workbook, { bookType: format, type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: format === 'xlsx' ? 'application/octet-stream' : 'text/csv'
    });
    FileSaver.saveAs(blob, `JobSeeker_Analytics_${new Date().toISOString().slice(0, 10)}.${format}`);
    setIsModalOpen(false);
  };

  const handleChartExport = () => {
    const chartEl = document.querySelector(`.exportable-chart`);
    if (!chartEl) return;
    import('html2canvas').then(html2canvas => {
      html2canvas.default(chartEl).then(canvas => {
        const link = document.createElement('a');
        link.download = `${selectedCard.id}_chart.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  const applyDateFilter = () => {
    fetchData(dateFilter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <button
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-slate-300 hidden sm:block" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              JobSeeker Analytics
            </h1>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <Download className="text-sm" />
              <span>Export Data</span>
            </button>
            {selectedCard && (
              <button
                onClick={handleChartExport}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Download className="text-sm" />
                <span>Export Chart</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-lg text-slate-600">Loading analytics data...</p>
          </div>
        ) : selectedCard ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedCard(null)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Dashboard</span>
            </button>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className={`bg-gradient-to-r ${selectedCard.gradient} p-4 sm:p-8`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`${selectedCard.iconBg} ${selectedCard.iconColor} p-3 sm:p-4 rounded-2xl backdrop-blur-sm`}>
                      {selectedCard.icon}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">{selectedCard.title}</h2>
                      <p className="text-white/80 text-sm">{selectedCard.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold">{selectedCard.total?.toLocaleString()}</div>
                    <div className="text-white/80 text-sm">Total Records</div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                {renderChart()}
                {selectedCard.hasDateFilter && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Registration Date</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="date"
                        value={dateFilter.from}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            from: e.target.value
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="date"
                        value={dateFilter.to}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            to: e.target.value
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={applyDateFilter}
                        disabled={!dateFilter.from || !dateFilter.to}
                        className={`ml-2 px-4 py-2 rounded-md text-white text-sm ${dateFilter.from && dateFilter.to
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-300 cursor-not-allowed'
                          }`}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Records', value: selectedCard.total?.toLocaleString(), color: 'blue' },
                { label: 'This Month', value: Math.floor(selectedCard.total * 0.15).toLocaleString(), color: 'emerald' },
                { label: 'Growth Rate', value: selectedCard.change, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl`}>
                      {stat.color === 'blue' && <BarChart2 />}
                      {stat.color === 'emerald' && <TrendingUp />}
                      {stat.color === 'purple' && <TrendingUp />}
                      {stat.color === 'orange' && <Eye />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {cardConfigs.map(card => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/80"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className={`${card.iconBg} ${card.iconColor} p-3 sm:p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {card.change}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                        {card.title}
                      </h3>
                      <p className="text-slate-500 text-sm">{card.subtitle}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100 gap-2 sm:gap-0">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{card.total?.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Total Records</div>
                      </div>
                      <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                        <span className="mr-2">View Details</span>
                        <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-sm text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} JobSeeker Analytics Dashboard — All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0 justify-center md:justify-end">
              <span className="text-slate-400 text-xs">Powered by</span>
              <span className="font-medium">Advanced Analytics</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h3 className="text-xl font-bold text-white">Export Analytics Data</h3>
              <p className="text-blue-100 text-sm mt-1">Choose your preferred format</p>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => Data_Export_as_excel('xlsx')}
                className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-800 rounded-2xl hover:bg-emerald-100 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg"><Download className="text-emerald-600" /></div>
                  <div className="text-left">
                    <div className="font-semibold">Excel Format</div>
                    <div className="text-xs text-emerald-600">Spreadsheet (.xlsx)</div>
                  </div>
                </div>
                <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform duration-200 text-emerald-600" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
              <h3 className="text-xl font-bold text-white">Export Charts</h3>
              <p className="text-indigo-100 text-sm mt-1">Select one or more charts to export as images</p>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Select All Checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCharts.length === cardConfigs.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCharts(cardConfigs.map(c => c.id));
                    } else {
                      setSelectedCharts([]);
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Select All Charts</span>
              </label>
              {/* Individual Chart Checkboxes */}
              {cardConfigs.map((chart) => (
                <label key={chart.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCharts.includes(chart.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCharts([...selectedCharts, chart.id]);
                      } else {
                        setSelectedCharts(selectedCharts.filter(id => id !== chart.id));
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{chart.title}</span>
                </label>
              ))}
            </div>
            <div className="px-6 pb-6 pt-2 flex justify-between gap-3">
              <button
                onClick={() => setExportModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleChartExport}
                disabled={selectedCharts.length === 0}
                className={`flex-1 px-4 py-2 rounded-xl text-white transition-all duration-200 ${selectedCharts.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-300 cursor-not-allowed'
                  }`}
              >
                Download Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeeker;