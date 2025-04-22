import React, { useState, useEffect } from "react";
import axios from "../../../../../../axios";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";

import { Box, Typography, Paper, Avatar, Button, Slide, IconButton, Grid, Divider, TextField, InputLabel, Card, CardMedia } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { CloudUpload } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to map status to MUI color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'closed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const scholarshipSchema = yup.object().shape({
  scholarship_title: yup.string().required("Scholarship Title is required"),
  scholarship_description: yup.string().required("Scholarship Description is required"),
  expiration_date: yup.date().required("Expiration Date is required"),
});

const PostedScholarship = ({ createScholarshipOpen }) => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [images, setImages] = useState([]);
  const maxImages = 5;
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [scholarshipApplicants, setScholarshipApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  // setup auth, retrieving the token from local storage
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Load authentication state
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  // Initialize form with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scholarshipSchema),
  });

  useEffect(() => {
    // Fetch scholarship postings from the API
    const fetchScholarships = async () => {
      try {
        const response = await axios.get('/api/get-scholarship-postings', {
          auth: { username: auth.token }
        });

        if (response.status === 200) {
          const responseData = response.data;
          const data = Array.isArray(responseData.scholarship_postings)
            ? responseData.scholarship_postings
            : [];

          setScholarships(data);
        } else {
          console.error('Failed to fetch scholarship postings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching scholarship postings:', error);
      }
    };

    fetchScholarships();
  }, [auth.token]);

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailsPanelOpen(true);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };

  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
    setApplicantsOpen(false);
    setShowApplicantDetails(false);
  };

  const handleViewApplicants = async (scholarshipId) => {
    try {
      const dummyApplicants = [
        {
          id: 1,
          first_name: "Sarah",
          last_name: "Lee",
          email: "sarah.lee@example.com",
          phone_number: "+6391234567",
          city: "Manila, Philippines",
          school: "National University",
          achievement: "Dean's Lister, Grade 10 - Present",
          personal_statement: "I am passionate about education and want to pursue my studies in...",
          application_date: "2023-06-10",
          documents: [
            { name: "Transcript", url: "#" },
            { name: "Certificate", url: "#" }
          ],
          profile_pic: "",
          status: "pending"
        },
        {
          id: 2,
          first_name: "Michael",
          last_name: "Garcia",
          email: "michael.garcia@example.com",
          phone_number: "+6398765432",
          city: "Quezon City, Philippines",
          school: "Manila Science High School",
          achievement: "Science Fair Winner, Math Olympiad Finalist",
          personal_statement: "Science has always been my passion...",
          application_date: "2023-06-09",
          documents: [
            { name: "Transcript", url: "#" }
          ],
          profile_pic: "",
          status: "pending"
        },
        {
          id: 3,
          first_name: "Ana",
          last_name: "Santos",
          email: "ana.santos@example.com",
          phone_number: "+6395551234",
          city: "Cebu, Philippines",
          school: "Cebu Institute of Technology",
          achievement: "Student Council President, Community Service Award",
          personal_statement: "As a community leader, I've learned the importance of education...",
          application_date: "2023-06-08",
          documents: [
            { name: "Transcript", url: "#" },
            { name: "Recommendation Letter", url: "#" }
          ],
          profile_pic: "",
          status: "approved"
        }
      ];

      setScholarshipApplicants(dummyApplicants);
      setApplicantsOpen(true);
    } catch (error) {
      console.error('Error fetching scholarship applicants:', error);
      toast.error('Error loading applicants');
    }
  };

  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleApproveApplicant = async (applicantId) => {
    try {
      setScholarshipApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'approved' } : app
        )
      );

      setSelectedApplicant(prev => ({ ...prev, status: 'approved' }));
      toast.success('Applicant approved successfully!');
    } catch (error) {
      console.error('Error approving applicant:', error);
      toast.error('Error processing request');
    }
  };

  const handleRejectApplicant = async (applicantId) => {
    try {
      setScholarshipApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicantId ? { ...app, status: 'rejected' } : app
        )
      );

      setSelectedApplicant(prev => ({ ...prev, status: 'rejected' }));
      toast.success('Applicant rejected');
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      toast.error('Error processing request');
    }
  };

  const getSlotValue = (scholarship) => {
    return scholarship.slots;
  };

  return (
    <Box sx={{ height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: "100%", position: "relative", display: "flex" }}>
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            p: 3,
            width: detailsPanelOpen ? "calc(100% - 400px)" : "100%",
            transition: "width 0.3s ease-in-out"
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Scholarship Posted
            </Typography>
          </Box>

          <Box
            className={`p-6 grid gap-3 grid-cols-3`}
          >
            {scholarships.map((scholarship) => (
              <Paper
                key={scholarship.id}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  cursor: "pointer",
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                  height: "100%"
                }}
                onClick={() => handleViewDetails(scholarship)}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={scholarship.logo}
                    alt={scholarship.company || "Company"}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {scholarship.scholarship_title || scholarship.scholarship_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{scholarship.company || "Company"}</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {scholarship.scholarship_description || scholarship.description || "No description provided"}
                </Typography>

                <Box sx={{ mt: "auto" }}>
                  <Typography variant="body2" color="text.secondary">
                    Slots: {getSlotValue(scholarship)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {scholarship.expiration_date || scholarship.expiration || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    Status:
                    <Button
                      variant="contained"
                      color={getStatusColor(scholarship.status)}
                      sx={{
                        borderRadius: "4px",
                        padding: "2px 8px",
                        marginLeft: "8px",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        lineHeight: "1.5",
                        minWidth: "auto",
                        height: "24px",
                      }}
                    >
                      {scholarship.status}
                    </Button>
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Details Panel with slide animation */}
        <Slide direction="left" in={detailsPanelOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "400px",
              height: "100%",
              bgcolor: "background.paper",
              boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
              p: 3,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {selectedScholarship && (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                    {applicantsOpen ?
                      (showApplicantDetails ? "Applicant Details" : "Scholarship Applicants") :
                      selectedScholarship.scholarship_title || selectedScholarship.scholarship_name}
                  </Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {!applicantsOpen && !showApplicantDetails && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={selectedScholarship.logo}
                        alt={selectedScholarship.company}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{selectedScholarship.company}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Button
                        variant="contained"
                        color={getStatusColor(selectedScholarship.status)}
                        sx={{
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "0.875rem",
                          textTransform: "capitalize",
                          lineHeight: "1.5",
                          minWidth: "auto",
                        }}
                      >
                        {selectedScholarship.status}
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Slots Available</Typography>
                      <Typography variant="body1">{getSlotValue(selectedScholarship)}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Expiration</Typography>
                      <Typography variant="body1">
                        {selectedScholarship.expiration_date || selectedScholarship.expiration || "Not specified"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedScholarship.scholarship_description || selectedScholarship.description || "No description provided"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PersonIcon />}
                        onClick={() => handleViewApplicants(selectedScholarship.id)}
                      >
                        View Applicants
                      </Button>
                    </Grid>
                  </Grid>
                )}

                {applicantsOpen && !showApplicantDetails && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">
                        Applicants ({scholarshipApplicants.length})
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setApplicantsOpen(false)}
                      >
                        Back to Details
                      </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {scholarshipApplicants.length === 0 ? (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                        No applicants yet
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {scholarshipApplicants.map((applicant) => (
                          <Paper
                            key={applicant.id}
                            sx={{
                              p: 2,
                              mb: 2,
                              cursor: 'pointer',
                              '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => handleViewApplicantDetails(applicant)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={applicant.profile_pic}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              >
                                {applicant.first_name?.[0] || 'A'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {applicant.first_name} {applicant.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Applied: {new Date(applicant.application_date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  Status:
                                  <Button
                                    size="small"
                                    color={
                                      applicant.status === 'approved' ? 'success' :
                                        applicant.status === 'rejected' ? 'error' : 'primary'
                                    }
                                    sx={{ ml: 1, textTransform: 'capitalize', pointerEvents: 'none' }}
                                  >
                                    {applicant.status || 'Pending'}
                                  </Button>
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    )}
                  </>
                )}

                {showApplicantDetails && selectedApplicant && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">
                        Application Review
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowApplicantDetails(false)}
                      >
                        Back to Applicants
                      </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar
                        src={selectedApplicant.profile_pic}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      >
                        {selectedApplicant.first_name?.[0] || 'A'}
                      </Avatar>
                      <Typography variant="h6">
                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedApplicant.email}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{selectedApplicant.phone_number || 'Not provided'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                        <Typography variant="body1">{selectedApplicant.city || 'Not provided'}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">School</Typography>
                        <Typography variant="body1">{selectedApplicant.school || 'Not provided'}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Achievement</Typography>
                        <Typography variant="body1">{selectedApplicant.achievement || 'Not provided'}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Personal Statement</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedApplicant.personal_statement || 'No statement provided'}
                        </Typography>
                      </Grid>

                      {selectedApplicant.documents && selectedApplicant.documents.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Documents</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedApplicant.documents.map((doc, index) => (
                              <Button
                                key={index}
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {doc.name || `Document ${index + 1}`}
                              </Button>
                            ))}
                          </Box>
                        </Grid>
                      )}

                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Application Status</Typography>

                        {selectedApplicant.status !== 'approved' && selectedApplicant.status !== 'rejected' ? (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={() => handleApproveApplicant(selectedApplicant.id)}
                            >
                              Approve Scholarship
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              onClick={() => handleRejectApplicant(selectedApplicant.id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: 'center',
                              color: selectedApplicant.status === 'approved' ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            This applicant has been {selectedApplicant.status}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Box>
        </Slide>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default PostedScholarship;