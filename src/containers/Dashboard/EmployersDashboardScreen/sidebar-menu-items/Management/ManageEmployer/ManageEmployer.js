import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    Button,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Tooltip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

import {
    CheckCircle,
    Cancel,
    AccessTime,
    HourglassEmpty,
    AddCircleOutline,
    Info,
} from '@mui/icons-material';

import CompanyDetailsModal from './CompanyDetailsModal';
import ApplyCompany from './ApplyCompany';
import SearchData from '../../../../components/layout/Search';

const ManageEmployer = () => {
    // States for filtering and modals
    const [query, setQuery] = useState("");
    const [filterByStatus, setFilterByStatus] = useState("");
    const [sortedCompanies, setSortedCompanies] = useState([]);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openApplyModal, setOpenApplyModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // Sample Companies Data
    const companies = [
        { id: 1, logo: "MS", name: "Microsoft Corporation", status: "Approved", image: "https://logo.clearbit.com/microsoft.com", rating: 4.5, openPositions: 10 },
        { id: 2, logo: "GO", name: "Google LLC", status: "Pending", image: "https://logo.clearbit.com/google.com", rating: 4.8, openPositions: 5 },
        { id: 3, logo: "AP", name: "Apple Inc.", status: "Rejected", image: "https://logo.clearbit.com/apple.com", rating: 4.7, openPositions: 8 },
        { id: 4, logo: "FB", name: "Meta Platforms", status: "Expired", image: "https://logo.clearbit.com/meta.com", rating: 4.6, openPositions: 6 },
    ];

    // Status filter options
    const statusOptions = ["", "Approved", "Rejected", "Pending", "Expired"];

    // Filter and sort companies dynamically
    useEffect(() => {
        const filterAndSortCompanies = () => {
            return companies
                .filter(({ name, status }) => {
                    const matchesQuery =
                        query.trim() === "" ||
                        name.toLowerCase().includes(query.toLowerCase());

                    const matchesStatus =
                        filterByStatus === "" || status.toLowerCase() === filterByStatus.toLowerCase();

                    return matchesQuery && matchesStatus;
                })
                .sort((a, b) => (b.rating - a.rating) || (b.openPositions - a.openPositions));
        };

        setSortedCompanies(filterAndSortCompanies());
    }, [query, filterByStatus]);

    // Get status chip based on company status
    const getStatusChip = (status) => {
        const statusConfigs = {
            Approved: { icon: <CheckCircle />, color: 'success', label: 'Approved' },
            Rejected: { icon: <Cancel />, color: 'error', label: 'Rejected' },
            Pending: { icon: <AccessTime />, color: 'warning', label: 'Pending' },
            Expired: { icon: <HourglassEmpty />, color: 'default', label: 'Expired' },
        };
        const config = statusConfigs[status];
        return config ? (
            <Chip icon={config.icon} label={config.label} color={config.color} size="small" sx={{ textTransform: 'capitalize' }} />
        ) : null;
    };

    // Handle opening the company details modal
    const handleOpenDetailsModal = (company) => {
        setSelectedCompany(company);
        setOpenDetailsModal(true);
    };

    // Handle closing modals
    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedCompany(null);
    };

    const handleOpenApplyModal = () => setOpenApplyModal(true);
    const handleCloseApplyModal = () => setOpenApplyModal(false);

    return (
        <Box>
            {/* Search & Filters */}
            <SearchData
                placeholder="Find a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
                components={1}
                componentData={[{ title: "Status", options: statusOptions }]}
                onComponentChange={(index, value) => {
                    if (index === 0) setFilterByStatus(value);
                }}
            />

            {/* Table Container */}
            <TableContainer component={Paper} elevation={0} className='mt-5'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button
                        startIcon={<AddCircleOutline />}
                        variant="contained"
                        onClick={handleOpenApplyModal}
                        className='flex items-center justify-center m-auto'
                    >
                        Apply New Company
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCompanies.map((company) => (
                            <TableRow key={company.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={company.image} alt={company.name} sx={{ width: 40, height: 40 }}>
                                            {company.logo}
                                        </Avatar>
                                        <Typography variant="body1">{company.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{getStatusChip(company.status)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Company Details">
                                        <IconButton color="primary" onClick={() => handleOpenDetailsModal(company)}>
                                            <Info />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Company Details Modal */}
            {selectedCompany && (
                <CompanyDetailsModal
                    open={openDetailsModal}
                    onClose={handleCloseDetailsModal}
                    company={selectedCompany}
                />
            )}

            {/* Apply Company Modal */}
            <ApplyCompany
                open={openApplyModal}
                onClose={handleCloseApplyModal}
            />
        </Box>
    );
};

export default ManageEmployer;
