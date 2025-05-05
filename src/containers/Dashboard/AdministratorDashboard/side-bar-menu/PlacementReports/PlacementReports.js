import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import SearchData from "../../../components/layout/Search";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

// Axios & Redux
import axios from "../../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";

function Placement_Reports() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState("");
  const [agencyCompany, setAgencyCompany] = useState(""); // Renamed from companyName
  const [jobPost, setJobPost] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/placement-reports', {
          auth: { username: auth.token }
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(item => ({
            id: item.applicant_firstname + item.applicant_lastname, // fallback ID
            first_name: item.applicant_firstname || "",
            last_name: item.applicant_lastname || "",
            position_hired: item.position_hired || "", // Use position_hired directly
            agency_company: item.company_name || "", // Renamed to agency_company
            deployment_country: item.job_country || "",
            deployment_region: item.deployment_country || "",
            salary: item.salary ? `$${item.salary}` : "",
            contract_period: item.contract_period || "N/A",
            source: item.source || "",
            local_overseas: item.local_overseas || "",
            remarks: item.remarks || "",
            date_added: new Date().toISOString() // Fallback since it's not in API
          }));
          setReports(mappedData);
        } else {
          setReports([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching placement reports:", err);
        setError("Failed to load placement reports.");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchReports();
    }
  }, [auth.token]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter Reports
  const filteredReports = reports.filter((report) =>
    `${report.first_name} ${report.last_name}`
      .toLowerCase()
      .includes(query.toLowerCase())
  ).filter(report => agencyCompany ? report.agency_company === agencyCompany : true)
    .filter(report => jobPost ? report.position_hired === jobPost : true);

  // Paginate
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();

  // Export CSV
  const exportToCSV = () => {
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Position Hired",
      "Agency/Company",
      "Deployment Country",
      "Deployment Region",
      "Salary",
      "Contract Period",
      "Source",
      "Local/Overseas",
      "Remarks",
      "Date Added"
    ];
    const csvRows = filteredReports.map(report => [
      report.first_name,
      report.last_name,
      report.position_hired,
      report.agency_company,
      report.deployment_country,
      report.deployment_region,
      report.salary,
      report.contract_period,
      report.source,
      report.local_overseas,
      report.remarks,
      formatDate(report.date_added)
    ]);
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.join(","))
      .join("\n");

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

  // Format date
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
            disabled={filteredReports.length === 0}
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
                title: "Agency/Company",
                options: ["", ...new Set(reports.map((report) => report.agency_company))]
              },
              {
                title: "Position Hired",
                options: ["", ...new Set(reports.map((report) => report.position_hired))]
              }
            ]}
            onComponentChange={(index, value) => {
              if (index === 0) setAgencyCompany(value); // Renamed to agencyCompany
              if (index === 1) setJobPost(value);
            }}
          />
        </Paper>
      </Grid>

      {/* Loading State */}
      {loading && (
        <Grid item xs={12} textAlign="center" mt={4}>
          <Typography>Loading reports...</Typography>
        </Grid>
      )}

      {/* Empty/Error State */}
      {!loading && (!reports || reports.length === 0) && (
        <Grid item xs={12} textAlign="center" mt={4}>
          <Typography>No reports found.</Typography>
        </Grid>
      )}

      {/* Table Section */}
      {!loading && reports.length > 0 && (
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: '600' }}>First Name</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Last Name</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Position Hired</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Agency/Company</TableCell> {/* Updated */}
                    <TableCell sx={{ fontWeight: '600' }}>Deployment Country</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Deployment Region</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Salary</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Contract Period</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Local/Overseas</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>Date Added</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          {report.first_name}
                        </Box>
                      </TableCell>
                      <TableCell>{report.last_name}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <WorkIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          {report.position_hired}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <BusinessIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          {report.agency_company} {/* Updated */}
                        </Box>
                      </TableCell>
                      <TableCell>{report.deployment_country}</TableCell>
                      <TableCell>{report.deployment_region}</TableCell>
                      <TableCell>{report.salary}</TableCell>
                      <TableCell>{report.contract_period}</TableCell>
                      <TableCell>{report.source}</TableCell>
                      <TableCell>{report.local_overseas}</TableCell>
                      <TableCell>{report.remarks}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          {formatDate(report.date_added)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2, mt: 2 }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredReports.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

export default Placement_Reports;