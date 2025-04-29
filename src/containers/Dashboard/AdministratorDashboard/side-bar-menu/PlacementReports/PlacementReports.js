import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Box,
  useTheme,
  Tooltip
} from '@mui/material';
import SearchData from "../../../components/layout/Search";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

// Dummy Data for Placement Reports - Modified for Applicants
const dummyReports = [
  {
    id: 1,
    first_name: "John",
    last_name: "Smith",
    position_hired: "Frontend Developer",
    company_hired: "Tech Solutions",
    deployment_country: "USA",
    deployment_region: "West Coast",
    salary: "$80,000",
    contract_period: "Full-time",
    agency: "RecruitPro",
    source: "Internal",
    local_overseas: "Local",
    remarks: "Good performance.",
    date_added: "2024-01-10"
  },
  {
    id: 2,
    first_name: "Emily",
    last_name: "Johnson",
    position_hired: "Data Analyst",
    company_hired: "Innovatech",
    deployment_country: "Canada",
    deployment_region: "Ontario",
    salary: "$75,000",
    contract_period: "Part-time",
    agency: "HireNow",
    source: "External",
    local_overseas: "Overseas",
    remarks: "Needs training.",
    date_added: "2024-04-15"
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Chen",
    position_hired: "UX Designer",
    company_hired: "Creative Labs",
    deployment_country: "India",
    deployment_region: "Bangalore",
    salary: "$60,000",
    contract_period: "Contract",
    agency: "GlobalTalent",
    source: "Internal",
    local_overseas: "Overseas",
    remarks: "Highly skilled.",
    date_added: "2023-12-31"
  },
  {
    id: 4,
    first_name: "Sarah",
    last_name: "Wilson",
    position_hired: "Project Manager",
    company_hired: "Remote Work Inc.",
    deployment_country: "UK",
    deployment_region: "London",
    salary: "$90,000",
    contract_period: "Full-time",
    agency: "StaffingPro",
    source: "External",
    local_overseas: "Overseas",
    remarks: "Excellent leadership.",
    date_added: "2024-02-20"
  },
  {
    id: 5,
    first_name: "David",
    last_name: "Rodriguez",
    position_hired: "Software Engineer",
    company_hired: "Enterprise Corp",
    deployment_country: "USA",
    deployment_region: "East Coast",
    salary: "$100,000",
    contract_period: "Full-time",
    agency: "RecruitPro",
    source: "Internal",
    local_overseas: "Local",
    remarks: "Strong coding skills.",
    date_added: "2023-11-05"
  },
  {
    id: 6,
    first_name: "Jessica",
    last_name: "Lee",
    position_hired: "DevOps Engineer",
    company_hired: "FutureTech",
    deployment_country: "Australia",
    deployment_region: "Sydney",
    salary: "$85,000",
    contract_period: "Full-time",
    agency: "HireNow",
    source: "External",
    local_overseas: "Overseas",
    remarks: "Expert in Kubernetes.",
    date_added: "2024-03-12"
  }
];

function Placement_Reports() {
  const [reports, setReports] = useState(dummyReports);
  const [query, setQuery] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobPost, setJobPost] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter & Paginate Reports
  const filteredReports = reports
    .filter((report) =>
      `${report.first_name} ${report.last_name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .filter((report) => (companyName ? report.company_hired === companyName : true))
    .filter((report) => (jobPost ? report.position_hired === jobPost : true));

  // Paginated reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();

  // Function to export filtered data as CSV
  const exportToCSV = () => {
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Position Hired",
      "Company Hired",
      "Deployment Country",
      "Deployment Region",
      "Salary",
      "Contract Period",
      "Agency",
      "Source",
      "Local/Overseas",
      "Remarks",
      "Date Added"
    ];
    const csvRows = filteredReports.map((report) => [
      report.first_name,
      report.last_name,
      report.position_hired,
      report.company_hired,
      report.deployment_country,
      report.deployment_region,
      report.salary,
      report.contract_period,
      report.agency,
      report.source,
      report.local_overseas,
      report.remarks,
      formatDate(report.date_added)
    ]);
    // Combine headers and rows into a single array
    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.join(","))
      .join("\n");
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "placement_reports.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Grid container spacing={3}>
      {/* Page Header */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h4" fontWeight="700" color="primary">
            Placement Reports
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToCSV}
            startIcon={<FileDownloadIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: '600',
              borderRadius: 2,
              boxShadow: 2,
              px: 3,
              py: 1,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Export Report
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          View and manage all placement reports from your organization
        </Typography>
      </Grid>
      {/* Search & Filter Section */}
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            padding: 3,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 3
          }}
        >
          <SearchData
            placeholder="Search by applicant name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
            componentData={[
              {
                title: "Company Hired",
                options: ["", ...new Set(reports.map((report) => report.company_hired))]
              },
              {
                title: "Position Hired",
                options: ["", ...new Set(reports.map((report) => report.position_hired))]
              }
            ]}
            onComponentChange={(index, value) => {
              if (index === 0) setCompanyName(value);
              if (index === 1) setJobPost(value);
            }}
          />
        </Paper>
      </Grid>
      {/* Reports Table Section */}
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            padding: 3,
            borderRadius: 3,
            position: 'relative',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}
        >
          <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Position Hired</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Company Hired</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Deployment Country</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Deployment Region</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Salary</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Contract Period</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Agency</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Local/Overseas</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Date Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <TableRow
                      key={report.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        transition: 'background-color 0.2s',
                        borderBottom: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <TableCell sx={{ fontWeight: '500' }}>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {report.first_name}
                        </Box>
                      </TableCell>
                      <TableCell>{report.last_name}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <WorkIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {report.position_hired}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <BusinessIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {report.company_hired}
                        </Box>
                      </TableCell>
                      <TableCell>{report.deployment_country}</TableCell>
                      <TableCell>{report.deployment_region}</TableCell>
                      <TableCell>{report.salary}</TableCell>
                      <TableCell>{report.contract_period}</TableCell>
                      <TableCell>{report.agency}</TableCell>
                      <TableCell>{report.source}</TableCell>
                      <TableCell>{report.local_overseas}</TableCell>
                      <TableCell>{report.remarks}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {formatDate(report.date_added)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          No matching reports found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search or filter criteria
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination Section */}
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2, mt: 2 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredReports.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '.MuiTablePagination-toolbar': {
                  flexWrap: 'wrap',
                },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  color: 'text.secondary',
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Placement_Reports;