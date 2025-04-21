import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Search,
    FilterList,
    ArrowBackIos,
    ArrowForwardIos,
    Visibility,
    Person,
    BusinessCenter,
    CalendarToday,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";

const Applicants = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);

    useEffect(() => {
        fetchApplicants();
    }, [auth.token]);

    const fetchApplicants = () => {
        setIsLoading(true);
        axios
            .get("http://127.0.0.1:5000/api/approved-applicants", {
                auth: { username: auth.token },
            })
            .then((res) => {
                // Combine jobs, scholarships, and trainings into a single list
                const combinedApplicants = [
                    ...res.data.approved_applicants.jobs.map(app => ({ ...app, type: "job" })),
                    ...res.data.approved_applicants.scholarships.map(app => ({ ...app, type: "scholarship" })),
                    ...res.data.approved_applicants.trainings.map(app => ({ ...app, type: "training" }))
                ];
                setApplicants(combinedApplicants);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching applicants:", err);
                toast.error("Failed to load applicants");
                setIsLoading(false);
            });
    };

    const handleSort = (field) => {
        const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(newDirection);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSelectedApplicant(null);
    };

    const viewApplicantDetails = (applicant) => {
        setSelectedApplicant(applicant);
    };

    const backToList = () => {
        setSelectedApplicant(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredApplicants = applicants.filter((applicant) => {
        const matchesQuery =
            query === "" ||
            applicant.user_details.personal_information.first_name?.toLowerCase().includes(query.toLowerCase()) ||
            applicant.user_details.email?.toLowerCase().includes(query.toLowerCase());
        const matchesStatus =
            status === "" ||
            applicant.application_status?.toLowerCase() === status.toLowerCase();
        return matchesQuery && matchesStatus;
    });

    // Sort applicants
    const sortedApplicants = [...filteredApplicants].sort((a, b) => {
        let valueA = a[sortField] || "";
        let valueB = b[sortField] || "";
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedApplicants.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedApplicants.length / itemsPerPage);

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedApplicant ? "Applicant Details" : "Approved Applicants"}
                </h1>
                {!selectedApplicant && (
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search applicants..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FilterList className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {!selectedApplicant && isFilterOpen && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {[...new Set(applicants.map((app) => app.application_status))]
                                    .filter(Boolean)
                                    .map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sort By
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="user_details.personal_information.first_name">Name</option>
                                <option value="user_details.email">Email</option>
                                <option value="applied_at">Applied Date</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {selectedApplicant ? (
                <div className="space-y-6">
                    <button
                        onClick={backToList}
                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowBackIos className="h-3 w-3 mr-2" />
                        Back to Applicants
                    </button>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Applicant Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Person className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {selectedApplicant.user_details.personal_information.first_name} {selectedApplicant.user_details.personal_information.last_name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedApplicant.type}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <div className="mt-1 flex items-center">
                                        <Email className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                        <p className="text-gray-900 dark:text-white">{selectedApplicant.user_details.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                                    <div className="mt-1 flex items-center">
                                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                        <p className="text-gray-900 dark:text-white">{selectedApplicant.user_details.personal_information.cellphone_number || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                                    <div className="mt-1">
                                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {selectedApplicant.application_status?.toUpperCase() || 'APPROVED'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Date</h3>
                                    <div className="mt-1 flex items-center">
                                        <CalendarToday className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                        <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedApplicant.applied_at)}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                                    <div className="mt-1 flex items-center">
                                        <BusinessCenter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                        <p className="text-gray-700 dark:text-gray-300">{selectedApplicant.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Additional Information */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Additional Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(selectedApplicant.user_details).map(([key, value]) => {
                                    if (typeof value === 'object' && value !== null) {
                                        return (
                                            <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="text-md font-medium text-gray-800 dark:text-white capitalize mb-3">
                                                    {key.replace(/_/g, ' ')}
                                                </h3>
                                                <div className="space-y-2">
                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                        <div key={`${key}-${subKey}`} className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                                {subKey.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {typeof subValue === 'object'
                                                                    ? JSON.stringify(subValue)
                                                                    : String(subValue || 'N/A')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {String(value || 'N/A')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading applicants...</p>
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                <Person className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
                            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search filters or check back later.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('user_details.personal_information.first_name')}
                                            >
                                                <div className="flex items-center">
                                                    Name {getSortIcon('user_details.personal_information.first_name')}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('user_details.email')}
                                            >
                                                <div className="flex items-center">
                                                    Email {getSortIcon('user_details.email')}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('applied_at')}
                                            >
                                                <div className="flex items-center">
                                                    Applied Date {getSortIcon('applied_at')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {currentItems.map((applicant) => (
                                            <tr key={applicant.application_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                            <Person className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {applicant.user_details.personal_information.first_name} {applicant.user_details.personal_information.last_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {applicant.application_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <Email className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                        <div className="text-sm text-gray-900 dark:text-white">{applicant.user_details.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <CalendarToday className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(applicant.applied_at)}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => viewApplicantDetails(applicant)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                                    >
                                                        <Visibility className="h-4 w-4 mr-1" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                                    Showing{" "}
                                    <span className="font-medium">{sortedApplicants.length > 0 ? indexOfFirstItem + 1 : 0}</span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastItem, sortedApplicants.length)}
                                    </span>{" "}
                                    of <span className="font-medium">{sortedApplicants.length}</span> applicants
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === 1
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <ArrowBackIos className="mr-1 h-3 w-3" />
                                        Previous
                                    </button>
                                    <div className="hidden sm:flex space-x-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`px-3 py-2 rounded-md text-sm font-medium ${pageNum === currentPage
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        Next
                                        <ArrowForwardIos className="ml-1 h-3 w-3" />
                                    </button>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(parseInt(e.target.value, 10));
                                            setCurrentPage(1);
                                        }}
                                        className="ml-1 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[5, 10, 25, 50].map((val) => (
                                            <option key={val} value={val}>
                                                {val} per page
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Applicants;