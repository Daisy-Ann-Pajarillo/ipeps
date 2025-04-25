import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Grid,
    InputLabel,
    TextField,
    IconButton
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostedScholarship from './PostedScholarship';
import { CloudUpload, Close as CloseIcon } from '@mui/icons-material';
//Backend
import axios from '../../../../../../axios';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import { useNavigate } from "react-router-dom";

const scholarshipSchema = yup.object().shape({
    scholarship_title: yup.string().required("Scholarship Title is required"),
    scholarship_description: yup.string().required("Scholarship Description is required"),
    expiration_date: yup.date().required("Expiration Date is required"),
    slots: yup.number().required("Number of slots is required").positive().integer()
});

const maxImages = 5;

const ScholarshipPosting = () => {
    const [createScholarshipOpen, setCreateScholarshipOpen] = useState(false);
    const [companyStatus, setCompanyStatus] = useState("");

    console.log("ScholarshipPosting - Form setup with resolver only");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(scholarshipSchema),
    });

    const watchedSlots = watch("slots");

    useEffect(() => {
        console.log("ScholarshipPosting - Current slots value:", watchedSlots);
    }, [watchedSlots]);

    const [images, setImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (images.length + files.length > maxImages) {
            toast.error(`You can upload a maximum of ${maxImages} images.`);
            return;
        }
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    // setup auth, retrieving the token from local storage
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    // Load authentication state
    useEffect(() => {
        dispatch(actions.getAuthStorage());
    }, [dispatch]);


    const onSubmit = async (data) => {
        console.log("ScholarshipPosting - Form data on submit:", data);
        console.log("ScholarshipPosting - Slots value on submit:", data.slots);

        const ScholarshipData = {
            scholarship_title: data.scholarship_title,
            scholarship_description: data.scholarship_description,
            expiration_date: data.expiration_date instanceof Date ? data.expiration_date.toISOString().split('T')[0] : data.expiration_date,
            slots: data.slots
        };

        console.log("ScholarshipPosting - Formatted data being sent:", ScholarshipData);

        try {
            const response = await axios.post('/api/scholarship-posting', ScholarshipData, {
                auth: { username: auth.token },
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                toast.success('Scholarship posted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                toast.error('Failed to post scholarship!');
            }
        } catch (error) {
            toast.error('Error posting scholarship!');
        }
    };

    useEffect(() => {
        axios.get('/api/get-company-information', {
            auth: { username: auth.token }
        })
            .then((response) => {
                setCompanyStatus(response.data.company_information.status)
            })
            .catch((error) => {
                console.error('Error data:', error);

            });
    }, []);

    const navigate = useNavigate();

    // Function to handle button click
    const handleButtonClick = () => {
        if (companyStatus === "pending") {
            // Optionally, show a modal or alert instead of immediate redirection
            alert("Your company status is pending. Please complete your company details before posting a scholarship.");
            navigate("/dashboard/manage-employers")
        } else if (companyStatus === "accept") {
            setCreateScholarshipOpen(!createScholarshipOpen);
        }
        else if (companyStatus === "reject") {
            alert("Your company status is rejected. Please contact support for more information.");
            navigate("/dashboard/manage-employers")
        } else {
            alert("Error. Please check your company status.");
            navigate("/dashboard/manage-employers")
        }
    };


    return (
        <Box className="flex flex-col w-full h-full">
            <Grid container className="h-full">
                <Grid item xs={12}>
                    <Button
                        onClick={handleButtonClick}
                        className="flex items-center justify-center w-full"
                        sx={{
                            backgroundColor: createScholarshipOpen ? "#f44336" : "#1976d2",
                            "&:hover": {
                                backgroundColor: createScholarshipOpen ? "#d32f2f" : "#115293",
                            },
                            color: "white",
                            py: 1,
                            transition: "background-color 0.3s ease", // Smooth hover effect
                        }}
                        aria-label={companyStatus === "pending" ? "Complete company details" : createScholarshipOpen ? "Cancel Scholarship posting" : "Create Scholarship posting"}
                    >
                        <Typography
                            variant="h5"
                            className="w-full text-center font-bold py-5"
                            sx={{ color: "white" }}
                        >
                            {companyStatus !== "accept" ? (
                                companyStatus === "" ? (
                                    <>
                                        Finish Company Details
                                        <br />
                                        <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                                            You can't post scholarship without completing company details.
                                        </span>
                                    </>
                                ) : companyStatus === "pending" ? (
                                    <>
                                        Wait for Admin Verification
                                        <br />
                                        <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                                            You can't post scholarship without admin validation.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Admin rejected your company
                                        <br />
                                        <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                                            You can't post scholarship without admin validation.
                                        </span>
                                    </>
                                )
                            ) : createScholarshipOpen ? (
                                "Cancel Scholarship Posting"
                            ) : (
                                "Create Scholarship Posting"
                            )}
                        </Typography>

                    </Button>
                </Grid>

                <Grid container className="flex-grow h-[calc(100%-64px)]">
                    {createScholarshipOpen ? (
                        <Grid item xs={12} className="h-full overflow-y-auto">
                            <Box className="px-8 pb-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Scholarship Name</Typography>
                                            <TextField
                                                placeholder="Enter Scholarship Name"
                                                {...register("scholarship_title")}
                                                fullWidth
                                                error={!!errors.scholarship_title}
                                                helperText={errors.scholarship_title?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Description</Typography>
                                            <TextField
                                                placeholder="Enter Scholarship Description"
                                                {...register("scholarship_description")}
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                error={!!errors.scholarship_description}
                                                helperText={errors.scholarship_description?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Scholarship Expiration</InputLabel>
                                            <TextField
                                                type="date"
                                                {...register("expiration_date")}
                                                fullWidth
                                                error={!!errors.expiration_date}
                                                helperText={errors.expiration_date?.message}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Slots</InputLabel>
                                            <TextField
                                                type="number"
                                                {...register("slots")}
                                                fullWidth
                                                placeholder='Number of slots'
                                                error={!!errors.slots}
                                                helperText={errors.slots?.message}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Upload Images (Max {maxImages})</Typography>
                                            <input accept="image/*" type="file" multiple onChange={handleImageUpload} hidden id="image-upload" />
                                            <label htmlFor="image-upload">
                                                <Button variant="outlined" component="span" startIcon={<CloudUpload />} disabled={images.length >= maxImages}>
                                                    Upload Images
                                                </Button>
                                            </label>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                                                {images.map((image, index) => (
                                                    <Box key={index} sx={{ position: 'relative', width: 100, height: 100 }}>
                                                        <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}>
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 2 }} />
                                    <Button type="submit" variant="contained" fullWidth className="mt-5 bg-blue-600 text-white">
                                        Create Scholarship Post
                                    </Button>
                                </form>
                            </Box>
                        </Grid>
                    ) : (
                        <Grid item xs={12} className="h-full">
                            <PostedScholarship createScholarshipOpen={createScholarshipOpen} />
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
};

export default ScholarshipPosting;