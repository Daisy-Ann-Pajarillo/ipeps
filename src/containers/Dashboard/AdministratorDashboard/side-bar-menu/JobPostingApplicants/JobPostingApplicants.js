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
  Box,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { Visibility, Delete, CheckCircle } from '@mui/icons-material';
import SearchData from "../../../components/layout/Search"; // Import SearchData

// Dummy Applicants Data
const dummyApplicants = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Shortlisted" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Interviewed" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", status: "Rejected" },
  { id: 4, name: "Diana Evans", email: "diana@example.com", status: "Shortlisted" },
  { id: 5, name: "Ethan White", email: "ethan@example.com", status: "Interviewed" },
  { id: 6, name: "Fiona Green", email: "fiona@example.com", status: "Rejected" },
  { id: 7, name: "George Martin", email: "george@example.com", status: "Shortlisted" },
  { id: 8, name: "Hannah Scott", email: "hannah@example.com", status: "Interviewed" },
];

function JobPostingApplicants() {
  const [applicants, setApplicants] = useState(dummyApplicants);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // **Filter & Paginate Applicants**
  const filteredApplicants = applicants
    .filter((applicant) => applicant.name.toLowerCase().includes(query.toLowerCase()))
    .filter((applicant) => (status ? applicant.status === status : true))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={3}>
      {/* Search & Filter Section */}
      <Grid item xs={12}>
        <SearchData
          placeholder="Search applicants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
          componentData={[
            { title: "Status", options: ["", "Shortlisted", "Interviewed", "Rejected"] }
          ]}
          onComponentChange={(index, value) => setStatus(value)}
        />
      </Grid>

      {/* Applicants Table Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <TableContainer className=''>
            {/* Pagination Section */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={applicants.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Applicant Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.status}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <Delete />
                        </IconButton>
                        <IconButton color="success" size="small">
                          <CheckCircle />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No matching applicants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default JobPostingApplicants;
