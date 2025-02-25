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
  Box
} from '@mui/material';
import SearchData from "../../../components/layout/Search"; // Import SearchData

// Dummy Data for Placement Reports
const dummyReports = [
  { id: 1, name: "Q1 Placement Report", company: "Tech Solutions", date: "2024-01-10", status: "Completed" },
  { id: 2, name: "Q2 Hiring Report", company: "Innovatech", date: "2024-04-15", status: "Pending" },
  { id: 3, name: "Annual Hiring Summary", company: "Creative Labs", date: "2023-12-31", status: "Completed" },
  { id: 4, name: "Freelance Hiring Report", company: "Remote Work Inc.", date: "2024-02-20", status: "Pending" },
  { id: 5, name: "Corporate Placement Analysis", company: "Enterprise Corp", date: "2023-11-05", status: "Completed" },
  { id: 6, name: "Tech Hiring Trends", company: "FutureTech", date: "2024-03-12", status: "Completed" }
];

function Placement_Reports() {
  const [reports, setReports] = useState(dummyReports);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [company, setCompany] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // **Filter & Paginate Reports**
  const filteredReports = reports
    .filter((report) => report.name.toLowerCase().includes(query.toLowerCase()))
    .filter((report) => (status ? report.status === status : true))
    .filter((report) => (company ? report.company === company : true))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={3}>
      {/* Search & Filter Section */}
      <Grid item xs={12}>
        <SearchData
          placeholder="Search reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
          componentData={[
            { title: "Company", options: ["", ...new Set(reports.map((report) => report.company))] },
            { title: "Status", options: ["", "Completed", "Pending"] }
          ]}
          onComponentChange={(index, value) => {
            if (index === 0) setCompany(value);
            if (index === 1) setStatus(value);
          }}
        />
      </Grid>

      {/* Reports Table Section */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Placement Reports</Typography>
            <Button variant="contained" color="primary">Export Report</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Report Name</strong></TableCell>
                  <TableCell><strong>Company</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.company}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No matching reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Section */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Placement_Reports;
