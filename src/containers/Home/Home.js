import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid2 as Grid 
} from '@mui/material';

// Import images
import logoImg from './images/logonav.png';
import bannerBg from './images/banner-bg.png';

// Import components
import Registration from './Registration';

// Header Component
const Header = () => (
  <div className='w-full bg-cyan-800/10'>
    <Container className='flex justify-between py-3 gap-3 items-center'>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logoImg}
            alt="IPEPS Logo"
            style={{ width: '50px', height: '50px' }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
              color: '#191a20',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '24px',
              marginTop: '10px',
            }}
          >
            IPEPS
          </Typography>
        </Box>
      </Box>

      {/* Header Text */}
      <Box className='flex flex-col justify-center items-end'>
        <Typography
          className='text-right text-balance text-[12px] md:[15px] font-bold leading-1 opacity-70 sm:opacity-100 sm:leading-none sm:mb-2 sm:text-lg'
        >
          Iloilo Province Employment
          Portal and Services
        </Typography>

        <Typography
          className='text-right text-balance text-[10px] md:text-[13px] leading-none max-w-[250px] sm:max-w-fit opacity-50 hidden sm:block'
        >
          Build career resumes. Explore jobs. Find employment match.
        </Typography>
      </Box>
    </Container>
  </div>
);

// Main Banner Component
const MainBanner = () => (
  <Box
    className="min-h-full max-h-fit flex justify-center items-center md:justify-start"
    sx={{
      backgroundImage: `url(${bannerBg})`,
      backgroundPosition: "right center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <Registration />
  </Box>
);

// Footer Component
const Footer = () => (
  <div className='bg-cyan-800'>
    <Box className='py-8 mt-17'>
      <Grid className="flex flex-col justify-center items-center gap-2 mx-0">
        {/* Footer Title */}
        <Typography className='text-lg font-regular text-white mt-10 mb-3'>
          More About <span className='text-cyan-100 font-bold'>IPEPS</span>
        </Typography>

        {/* Footer Description */}
        <Typography className="text-sm flex flex-col gap-5 text-neutral-200 text-balance max-w-[600px]">
          <span className="flex flex-col sm:flex-row gap-5">
            <span>
              This is a job matching portal managed by the Public Employment
              Service Office (PESO) for jobseekers and employers in the
              Province of Iloilo. IPEPS features jobseeker and employer
              profiling and database, job matching, employment referral
              generation, and labor market analytics promoting online
              employment facilitation and protection and decent employment
              for all.
            </span>
            <span>
              IPEPS is the product of a collaboration between the
              Iloilo Provincial PESO and Iloilo Science and Technology
              University (ISATU) under Good Governance through Data Science
              and Decision Support System (GODDESS) with funding from the
              Department of Science and Technology (DOST) and Philippine
              Council for Industry, Energy and Emerging Technology Research
              and Development (PCIEERD).
            </span>
          </span>
          <span>
            If you need to contact us directly, you may email us at
            support@ipeps.work or at our Facebook page.
          </span>
        </Typography>

        {/* Social Media Link */}
        <Box>
          <a
            href="https://www.facebook.com/peso.ilo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center border border-white rounded-full text-white hover:bg-white hover:text-cyan-800 transition-all duration-300"
          >
            f
          </a>
        </Box>
      </Grid>

      {/* Copyright */}
      <Box sx={{ paddingTop: '60px', textAlign: 'center' }}>
        <Typography className='flex flex-col text-white text-sm'>
          <span>
            Copyright &copy; 2024 IPEPS
            Office (PESO)
          </span>
          <span className="opacity-70 text-xs">
            by Public Employment Service
          </span>
        </Typography>
      </Box>
    </Box>
  </div>
);

// Main Home Component
const Home = () => {
  return (
    <div className='min-h-dvh max-h-fit w-full flex flex-col'>
      <Header />
      <MainBanner />
      <Footer />
    </div>
  );
};

export default Home;