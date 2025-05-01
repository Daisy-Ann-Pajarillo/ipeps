import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../../store/actions/index';
import axios from '../../../../../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Options for target audience selection
const audienceOptions = ['Jobseeker', 'Student', 'Employer', 'Academe'];

// API: Add Announcement
const Add_Announcement = async (announcement, authToken) => {
    try {
        const response = await axios.post('/api/add-announcement', announcement, {
            auth: { username: authToken },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding announcement:', error);
        throw error;
    }
};

// API: Get Announcements
const Get_Announcement = async (authToken) => {
    try {
        const response = await axios.get('/api/get-announcements', {
            auth: { username: authToken },
        });

        // Extract announcements from nested structure
        if (response?.data?.success && Array.isArray(response.data.announcements)) {
            return response.data.announcements;
        }

        console.warn('Invalid or empty announcements data:', response.data);
        return [];

    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
    }
};

export default function Announcement() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetAudience: [],
        expiryDate: '',
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // Filtering and search state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAudience, setSelectedAudience] = useState('All');

    // Fetch announcements from API
    const fetchAnnouncements = async () => {
        if (!auth?.token) return;

        try {
            const data = await Get_Announcement(auth.token);

            // Map API response to frontend structure
            const safeData = data.map((a) => ({
                id: a.announcement_id,
                title: a.title || 'Untitled Announcement',
                content: a.details || '',
                expiryDate: a.expiration_date || null,
                createdAt: a.created_at || null,
                status: a.status || 'active',
                targetAudience: Array.isArray(a.target_audience) ? a.target_audience : [],
            }));

            setAnnouncements(safeData);
        } catch (error) {
            toast.error('Failed to load announcements.');
            console.error('Error in fetchAnnouncements:', error);
        }
    };

    // Load auth on mount
    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    // Fetch announcements when token changes
    useEffect(() => {
        if (auth?.token) {
            fetchAnnouncements();
        }
    }, [auth?.token]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Toggle audience selection
    const handleAudienceToggle = (audience) => {
        if (audience === 'All') {
            setFormData({
                ...formData,
                targetAudience:
                    formData.targetAudience.length === audienceOptions.length ? [] : [...audienceOptions],
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                targetAudience: prev.targetAudience.includes(audience)
                    ? prev.targetAudience.filter((a) => a !== audience)
                    : [...prev.targetAudience, audience],
            }));
        }
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAnnouncement = {
            title: formData.title,
            details: formData.content,
            target_audience: formData.targetAudience,
            expiration_date: formData.expiryDate,
        };

        try {
            if (!auth?.token) {
                toast.warning('Authentication token not found.');
                return;
            }

            // Add new announcement
            await Add_Announcement(newAnnouncement, auth.token);

            // Refresh list from API
            await fetchAnnouncements();

            // Notify user
            toast.success('Announcement posted successfully!');

            // Reset form
            setFormData({
                title: '',
                content: '',
                targetAudience: [],
                expiryDate: '',
            });
            setShowForm(false);
        } catch (error) {
            toast.error('Failed to post announcement.');
            console.error('Error submitting announcement:', error);
        }
    };

    // Filter and search announcements
    const filteredAnnouncements = announcements.filter(announcement => {
        // Filter by search term (title and content)
        const matchesSearch =
            searchTerm === '' ||
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by audience
        const matchesAudience =
            selectedAudience === 'All' ||
            announcement.targetAudience.includes(selectedAudience);

        return matchesSearch && matchesAudience;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle audience filter
    const handleAudienceFilter = (audience) => {
        setSelectedAudience(audience);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const allSelected = formData.targetAudience.length === audienceOptions.length;

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />

            <header className="mb-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Announcements</h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Announcement
                        </button>
                    )}
                </div>
                {!showForm && (
                    <p className="text-gray-600 mt-2">Manage and create announcements for your target audience.</p>
                )}
            </header>

            {/* Announcement Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-10 transition-all duration-300">
                    <div className="mb-8 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Announcement Details</h2>
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                            {previewMode ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit Mode
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Preview Mode
                                </>
                            )}
                        </button>
                    </div>

                    {!previewMode ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Announcement Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Announcement Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    placeholder="Enter announcement details"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Target Audience
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleAudienceToggle('All')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${allSelected
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {audienceOptions.map((audience) => (
                                        <button
                                            type="button"
                                            key={audience}
                                            onClick={() => handleAudienceToggle(audience)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${formData.targetAudience.includes(audience)
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {audience}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors duration-300"
                                >
                                    Submit Announcement
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mb-6 shadow-inner border border-indigo-100">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {formData.title || 'Announcement Title Preview'}
                                </h3>
                                <p className="text-gray-600 mb-6 whitespace-pre-line">
                                    {formData.content || 'Announcement content preview will appear here.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.targetAudience.length > 0 ? (
                                    formData.targetAudience.map((audience) => (
                                        <span
                                            key={audience}
                                            className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1.5 rounded-lg font-medium"
                                        >
                                            {audience}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm">No audience selected</span>
                                )}
                            </div>
                            {formData.expiryDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Expires on: {new Date(formData.expiryDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Search and Filter Bar */}
            {announcements.length > 0 && !showForm && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Search announcements..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>

                            {/* Audience Filter */}
                            <div className="flex-none md:w-auto">
                                <div className="relative inline-block text-left w-full md:w-auto">
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => handleAudienceFilter('All')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedAudience === 'All'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            All
                                        </button>
                                        {audienceOptions.map((audience) => (
                                            <button
                                                key={audience}
                                                type="button"
                                                onClick={() => handleAudienceFilter(audience)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedAudience === audience
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {audience}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Published Announcements */}
            {announcements.length > 0 ? (
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Published Announcements</h2>
                        <div className="text-sm text-gray-500">
                            Showing {currentAnnouncements.length} of {filteredAnnouncements.length} announcements
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentAnnouncements.length > 0 ? (
                            currentAnnouncements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-5 line-clamp-3">{announcement.content}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {Array.isArray(announcement.targetAudience) &&
                                                announcement.targetAudience.map((audience) => (
                                                    <span
                                                        key={audience}
                                                        className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1.5 rounded-lg font-medium"
                                                    >
                                                        {audience}
                                                    </span>
                                                ))}
                                        </div>
                                        {announcement.expiryDate && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-10 text-center">
                                <p className="text-gray-500">No matching announcements found.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredAnnouncements.length > itemsPerPage && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex space-x-1">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-4 py-2 rounded-md ${currentPage === index + 1
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-10 text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="max-w-md mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <p className="text-gray-600 text-xl font-medium mb-2">No announcements found</p>
                        <p className="text-gray-500 mb-6">Create your first announcement to keep everyone informed</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Announcement
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}