import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Paper,
    Divider,
    Chip,
    Stack,
    Container,
    CircularProgress,
    Alert
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const FileUploadItem = ({ label, file, setFile }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                    p: 1.5,
                    borderColor: file ? 'primary.main' : 'grey.400',
                    borderStyle: 'dashed',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(0, 162, 237, 0.04)'
                    }
                }}
            >
                {label}
                <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </Button>
            {file && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <DescriptionIcon fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {file.name}
                    </Typography>
                </Stack>
            )}
        </Box>
    );
};

const ManageEmployer = () => {
    // State variables
    const [company, setCompany] = useState({ name: '' });
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [totalWorkforce, setTotalWorkforce] = useState('');
    const [letterOfIntent, setLetterOfIntent] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [businessPermit, setBusinessPermit] = useState(null);
    const [birForms, setBirForms] = useState(null);
    const [poeaFiles, setPoeaFiles] = useState(null);
    const [philnetRegCert, setPhilnetRegCert] = useState(null);
    const [doleCert, setDoleCert] = useState(null);
    const [adminRem, setAdminRem] = useState('');

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [internationalAddress, setInternationalAddress] = useState('');
    const [zippostalcode, setZipPostalCode] = useState('');
    const [houseno, setHouseNo] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [badgeStatus, setBadgeStatus] = useState('');

    useEffect(() => {
        const loadJsonData = async () => {
            if (selectedCountry === 'Philippines') {
                setLoading(true);
                setError(null);
                try {
                    const regionsData = await import('../../../../../../User   ApplicationForm/json/refregion.json');
                    const provincesData = await import('../../../../../../User   ApplicationForm/json/refprovince.json');
                    const municipalitiesData = await import('../../../../../../User   ApplicationForm/json/refcitymun.json');
                    const barangaysData = await import('../../../../../../User   ApplicationForm/json/refbrgy.json');

                    setRegions(regionsData.RECORDS || []);
                    setProvinces(provincesData.RECORDS || []);
                    setMunicipalities(municipalitiesData.RECORDS || []);
                    setBarangays(barangaysData.RECORDS || []);
                } catch (error) {
                    console.error('Error loading JSON data:', error);
                    setError('Failed to load location data');
                } finally {
                    setLoading(false);
                }
            } else {
                setRegions([]);
                setProvinces([]);
                setMunicipalities([]);
                setBarangays([]);
            }
        };

        loadJsonData();
    }, [selectedCountry]);

    const getProvincesByRegion = (regionCode) => {
        return provinces.filter(province => province.regCode === regionCode);
    };

    const getMunicipalitiesByProvince = (provinceCode) => {
        return municipalities.filter(municipality => municipality.provCode === provinceCode);
    };

    const getBarangaysByMunicipality = (municipalityCode) => {
        return barangays.filter(barangay => barangay.citymunCode === municipalityCode);
    };

    const handleSubmit = () => {
        const requestApprovalData = {
            companyName: company.name,
            email,
            website,
            industry,
            companyType,
            totalWorkforce,
            address: {
                country: selectedCountry,
                region: selectedRegion,
                province: selectedProvince,
                municipality: selectedMunicipality,
                barangay: selectedBarangay,
                internationalAddress,
                zipPostalCode: zippostalcode,
                houseNo: houseno,
            },
            documents: {
                logoImage,
                businessPermit,
                birForms,
                poeaFiles,
                philnetRegCert,
                doleCert,
            },
            adminRemarks: adminRem,
        };

        console.log("Request for Approval submitted", requestApprovalData);
        
        toast.success("Request for Approval Submitted Successfully");
        setBadgeStatus('Pending');
        resetFormFields();
    };

    const resetFormFields = () => {
        setCompany({ name: '' });
        setEmail('');
        setWebsite('');
        setIndustry('');
        setCompanyType('');
        setTotalWorkforce('');
        setSelectedCountry('');
        setSelectedRegion('');
        setSelectedProvince('');
        setSelectedMunicipality('');
        setSelectedBarangay('');
        setInternationalAddress('');
        setZipPostalCode('');
        setHouseNo('');
        setLogoImage(null);
        setBusinessPermit(null);
        setBirForms(null);
        setPoeaFiles(null);
        setPhilnetRegCert(null);
        setDoleCert(null);
        setAdminRem('');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Company Approval
                    </Typography>
                    {badgeStatus && (
                        <Chip
                            label={badgeStatus}
                            color="primary"
                            variant="outlined"
                            sx={{ 
                                borderRadius: 1,
                                px: 1,
                                fontWeight: 500
                            }}
                        />
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Company Information Section */}
                <Box sx={{ mb: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(0, 162, 237, 0.04)',
                            borderRadius: 2
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <BusinessIcon color="primary" />
                            <Typography variant="h6">Company Information</Typography>
                        </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Company Name"
                                value={company.name}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                variant="outlined"
                                type="email"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                fullWidth
                                variant="outlined"
                                placeholder="https://example.com"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Company Type</InputLabel>
                                <Select
                                    value={companyType}
                                    onChange={(e) => setCompanyType(e.target.value)}
                                    label="Company Type"
                                >
                                    <MenuItem value="Private">Private</MenuItem>
                                    <MenuItem value="Public">Public</MenuItem>
                                    <MenuItem value="Government">Government</MenuItem>
                                    <MenuItem value="Non-Profit">Non-Profit</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Total Workforce"
                                value={totalWorkforce}
                                onChange={(e) => setTotalWorkforce(e.target.value)}
                                fullWidth
                                variant="outlined"
                                type="number"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Address Details Section */}
                <Box sx={{ mb: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(0, 162, 237, 0.04)',
                            borderRadius: 2
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <LocationOnIcon color="primary" />
                            <Typography variant="h6">Address Details</Typography>
                        </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Country</InputLabel>
                                <Select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    label="Country"
                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {loading && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        Loading location data...
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                        
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}

                        {selectedCountry === 'Philippines' ? (
                            <>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Region</InputLabel>
                                        <Select
                                            value={selectedRegion}
                                            onChange={(e) => {
                                                setSelectedRegion(e.target.value);
                                                setSelectedProvince('');
                                                setSelectedMunicipality('');
                                                setSelectedBarangay('');
                                            }}
                                            label="Region"
                                        >
                                            {regions.map((region) => (
                                                <MenuItem key={region.regCode} value={region.regCode}>
                                                    {region.regDesc}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Province</InputLabel>
                                        <Select
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                setSelectedProvince(e.target.value);
                                                setSelectedMunicipality('');
                                                setSelectedBarangay('');
                                            }}
                                            label="Province"
                                            disabled={!selectedRegion}
                                        >
                                            {getProvincesByRegion(selectedRegion).map((province) => (
                                                <MenuItem key={province.provCode} value={province.provCode}>
                                                    {province.provDesc}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Municipality</InputLabel>
                                        <Select
                                            value={selectedMunicipality}
                                            onChange={(e) => {
                                                setSelectedMunicipality(e.target.value);
                                                setSelectedBarangay('');
                                            }}
                                            label="Municipality"
                                            disabled={!selectedProvince}
                                        >
                                            {getMunicipalitiesByProvince(selectedProvince).map((municipality) => (
                                                <MenuItem key={municipality.citymunCode} value={municipality.citymunCode}>
                                                    {municipality.citymunDesc}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Barangay</InputLabel>
                                        <Select
                                            value={selectedBarangay}
                                            onChange={(e) => setSelectedBarangay(e.target.value)}
                                            label="Barangay"
                                            disabled={!selectedMunicipality}
                                        >
                                            {getBarangaysByMunicipality(selectedMunicipality).map((barangay) => (
                                                <MenuItem key={barangay.brgyCode} value={barangay.brgyCode}>
                                                    {barangay.brgyDesc}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <TextField
                                    label="Full Address"
                                    value={internationalAddress}
                                    onChange={(e) => setInternationalAddress(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="House No. / Street / Building"
                                value={houseno}
                                onChange={(e) => setHouseNo(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Zip Code / Postal Code"
                                value={zippostalcode}
                                onChange={(e) => setZipPostalCode(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Required Documents Section */}
                <Box sx={{ mb: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(0, 162, 237, 0.04)',
                            borderRadius: 2
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <DescriptionIcon color="primary" />
                            <Typography variant="h6">Required Documents</Typography>
                        </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload Logo Image"
                                file={logoImage}
                                setFile={setLogoImage}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload Business Permit"
                                file={businessPermit}
                                setFile={setBusinessPermit}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload BIR Forms"
                                file={birForms}
                                setFile={setBirForms}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload POEA Files"
                                file={poeaFiles}
                                setFile={setPoeaFiles}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload PHILNET Reg Cert"
                                file={philnetRegCert}
                                setFile={setPhilnetRegCert}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FileUploadItem
                                label="Upload DOLE Cert"
                                file={doleCert}
                                setFile={setDoleCert}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Admin Remarks (Optional)"
                                value={adminRem}
                                onChange={(e) => setAdminRem(e.target.value)}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                placeholder="Any additional information or special requirements..."
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            px: 4,
                            py: 1.5,
                            backgroundColor: '#00a2ed',
                            fontWeight: 500,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: '#0088cc'
                            }
                        }}
                    >
                        Submit Approval Request
                    </Button>
                </Box>
            </Paper>
            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default ManageEmployer;