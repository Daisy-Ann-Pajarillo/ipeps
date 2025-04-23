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
  { id: 1, applicantName: "John Smith", companyName: "Tech Solutions", jobPost: "Frontend Developer", dateHired: "2024-01-10" },
  { id: 2, applicantName: "Emily Johnson", companyName: "Innovatech", jobPost: "Data Analyst", dateHired: "2024-04-15" },
  { id: 3, applicantName: "Michael Chen", companyName: "Creative Labs", jobPost: "UX Designer", dateHired: "2023-12-31" },
  { id: 4, applicantName: "Sarah Wilson", companyName: "Remote Work Inc.", jobPost: "Project Manager", dateHired: "2024-02-20" },
  { id: 5, applicantName: "David Rodriguez", companyName: "Enterprise Corp", jobPost: "Software Engineer", dateHired: "2023-11-05" },
  { id: 6, applicantName: "Jessica Lee", companyName: "FutureTech", jobPost: "DevOps Engineer", dateHired: "2024-03-12" }
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
    .filter((report) => report.applicantName.toLowerCase().includes(query.toLowerCase()))
    .filter((report) => (companyName ? report.companyName === companyName : true))
    .filter((report) => (jobPost ? report.jobPost === jobPost : true));

  // Paginated reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();

  // Function to export filtered data as CSV
  const exportToCSV = () => {
    const csvHeaders = ["Applicant Name", "Company Name", "Job Post", "Date Hired"];
    const csvRows = filteredReports.map((report) => [
      report.applicantName,
      report.companyName,
      report.jobPost,
      report.dateHired,
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
              { title: "Company Name", options: ["", ...new Set(reports.map((report) => report.companyName))] },
              { title: "Job Post", options: ["", ...new Set(reports.map((report) => report.jobPost))] }
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
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Applicant Name</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Company Name</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Job Post</TableCell>
                  <TableCell sx={{ fontWeight: '600', py: 2 }}>Date Hired</TableCell>
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
                          {report.applicantName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <BusinessIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {report.companyName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <WorkIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {report.jobPost}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1, opacity: 0.7 }} />
                          {formatDate(report.dateHired)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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