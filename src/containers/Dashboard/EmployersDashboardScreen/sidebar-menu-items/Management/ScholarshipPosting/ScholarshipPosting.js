import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Grid 
} from '@mui/material';
import axios from '../../../../../../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostedScholarship from './PostedScholarship';

const ScholarshipPosting = () => { 
    const [scholarshipname, setScholarshipName] = useState('');
    const [scholarshipdescription, setScholarshipDescription] = useState('');

    // Send the Data into the Database
const handleSubmit = async () => { 
  const scholarshipdata = {
      scholarship_name: scholarshipname, 
      scholarship_description: scholarshipdescription
  };

  console.log("Scholarship Data:", scholarshipdata); 

  try {
      const response = await axios.post('/api/scholarship-posting', scholarshipdata);
      
      if (response.status === 201) {
          console.log('Scholarship posted successfully!', scholarshipdata);
          
          // Show success toast notification
          toast.success('Scholarship posted successfully!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => window.location.reload(),
          });
          
          // Clear input fields after success
          setScholarshipName('');
          setScholarshipDescription('');
          
      } else {
          console.error('Failed to post scholarship:', response.statusText);
          
          // Show error toast notification
          toast.error('Failed to post scholarship!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
          });
      }
  } catch (error) {
      console.error('Error posting scholarship:', error);
      
      // Show error toast notification for exception
      toast.error('Error posting scholarship!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
      });
  }
};

    return (
        <Box display="flex">
            
            {/* Scholarship Posting Form Panel */}
            <Box sx={{ width: '60%' }}>
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Create Scholarship Post
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Scholarship Name
                        </Typography>
                        <input
                            type="text"
                            placeholder="Enter Scholarship Name"
                            value={scholarshipname}
                            onChange={(e) => setScholarshipName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Description
                        </Typography>
                        <textarea
                            placeholder="Enter Scholarship Description"
                            value={scholarshipdescription}
                            onChange={(e) => setScholarshipDescription(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        />
                    </Grid>
                </Grid>

                <Divider />

                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        sx={{ ml: 'auto', mt: 2, backgroundColor: 'blue' }}
                    >
                        Create Scholarship Post
                    </Button>
                </Box>
            </Box>
            
            {/* Posted Scholarship Panel */}
            <Box 
                sx={{ 
                    width: '40%',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                }}
            >
                <PostedScholarship />  
            </Box>

            {/* Toast Container */}
            <ToastContainer />

        </Box>
    );
};

export default ScholarshipPosting;
