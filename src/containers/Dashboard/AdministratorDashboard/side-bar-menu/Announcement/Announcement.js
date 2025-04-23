import { useState } from 'react';

export default function Announcement() {
    const [showForm, setShowForm] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetAudience: [],
        expiryDate: '',
        createdDate: ''
    });

    const [previewMode, setPreviewMode] = useState(false);

    const audienceOptions = ['Jobseeker', 'Student', 'Employer', 'Academe'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAudienceToggle = (audience) => {
        // If "All" is selected
        if (audience === 'All') {
            // If all options are already selected, clear them
            if (formData.targetAudience.length === audienceOptions.length) {
                setFormData({ ...formData, targetAudience: [] });
            } else {
                // Otherwise select all options
                setFormData({ ...formData, targetAudience: [...audienceOptions] });
            }
            return;
        }

        // Handle individual audience option toggle
        setFormData(prev => {
            if (prev.targetAudience.includes(audience)) {
                return { ...prev, targetAudience: prev.targetAudience.filter(a => a !== audience) };
            } else {
                return { ...prev, targetAudience: [...prev.targetAudience, audience] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add current date to the announcement
        const newAnnouncement = {
            ...formData,
            createdDate: new Date().toISOString().split('T')[0],
            id: Date.now() // Add a unique ID
        };

        // Add the new announcement to the list
        setAnnouncements([...announcements, newAnnouncement]);

        // Reset the form data
        setFormData({
            title: '',
            content: '',
            targetAudience: [],
            expiryDate: ''
        });

        // Close the form
        setShowForm(false);

        console.log("Announcement created:", newAnnouncement);
    };

    // Check if all audience options are selected
    const allSelected = formData.targetAudience.length === audienceOptions.length;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        Create Announcement
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700">Announcement Details</h2>
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            {previewMode ? 'Edit Mode' : 'Preview Mode'}
                        </button>
                    </div>

                    {!previewMode ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter announcement details"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                <div className="flex flex-wrap gap-2">
                                    {/* All option */}
                                    <button
                                        type="button"
                                        onClick={() => handleAudienceToggle('All')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${allSelected
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>

                                    {/* Individual audience options */}
                                    {audienceOptions.map((audience) => (
                                        <button
                                            type="button"
                                            key={audience}
                                            onClick={() => handleAudienceToggle(audience)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.targetAudience.includes(audience)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {audience}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                >
                                    Submit Announcement
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {formData.title || "Announcement Title Preview"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {formData.content || "Announcement content preview will appear here."}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.targetAudience.length > 0 ? (
                                    formData.targetAudience.map(audience => (
                                        <span key={audience} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {audience}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm">No audience selected</span>
                                )}
                            </div>
                            {formData.expiryDate && (
                                <p className="text-sm text-gray-500">
                                    Expires on: {new Date(formData.expiryDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Announcements Cards Section */}
            {announcements.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Published Announcements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {announcements.map(announcement => (
                            <div key={announcement.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{announcement.content}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {announcement.targetAudience.map(audience => (
                                            <span key={audience} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {audience}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Created: {announcement.createdDate}</span>
                                        {announcement.expiryDate && (
                                            <span>Expires: {announcement.expiryDate}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}