import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Typography,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import axios from "../../../../../axios";
import { jwtDecode } from "jwt-decode";
import FacebookIcon from "@mui/icons-material/Facebook";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';

// Simple Carousel Component
const SimpleCarousel = ({ title, children }) => {
  const carouselRef = useRef(null);
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  return (
    <div className="mb-12 w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-5xl px-6 mb-4">
        <Typography variant="h5" className="font-semibold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div className="flex gap-2">
          <IconButton
            onClick={scrollLeft}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            size="small"
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={scrollRight}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            size="small"
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-6 snap-x scrollbar-hide w-full max-w-5xl px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
};

// Slideshow for Portal Benefits
const portalSlides = [
  {
    title: "Connect with Iloilo's top employers and training providers",
    image: "https://iloilo.gov.ph/sites/default/files/inline-images/2024%20July%20Job%20Fair%20FB%20Poster_0.png",
  },
  {
    title: "Apply to jobs and programs instantly, anytime, anywhere",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdz6hFSqykmXhveoUNhuldsHMNk1kTtYZm3A&s",
  },
  {
    title: "Access exclusive scholarships and grants for Ilonggos",
    image: "https://dailyguardian.com.ph/wp-content/uploads/2024/10/Iloilo-PESO-Hosts-Fair-w.jpg",
  },
  {
    title: "Get career advice and resources from local experts",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "All-in-one, modern, easy-to-use platform for Iloilo",
    image: "https://www.websitetemplatesonline.com/wp-content/uploads/2022/09/all-in-one-website-service.png",
  },
];

// Add this helper function at the top level
const getRelativeTimeString = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
};

// Main Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const jobsRef = useRef(null); // Moved here with other hooks
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedTrainings, setRecommendedTrainings] = useState([]);
  const [recommendedScholarships, setRecommendedScholarships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookmarkedItems, setBookmarkedItems] = useState({
    jobs: [],
    trainings: [],
    scholarships: [],
  });
  const [loading, setLoading] = useState({
    jobs: true,
    trainings: true,
    scholarships: true,
  });

  // Slideshow state for Portal Info
  const [slideIdx, setSlideIdx] = useState(0);
  const slideCount = portalSlides.length;
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideIdx((prev) => (prev + 1) % slideCount);
    }, 3500);
    return () => clearTimeout(timer);
  }, [slideIdx, slideCount]);

  // Announcement modal state
  const [openAnnouncement, setOpenAnnouncement] = useState(null);

  // Determine user type from auth token
  const getUserType = () => {
    if (!auth.token) return null;
    return jwtDecode(auth.token).user_type
  };

  // Fetch authentication data on component mount
  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);




  // Function to fetch job recommendations
  const fetchJobRecommendations = async () => {
    if (!auth.token) return;
    setLoading((prev) => ({ ...prev, jobs: true }));
    try {
      const response = await axios.get("/api/recommend/job-posting", {
        auth: { username: auth.token },
      });
      console.log("Fetched job data:", response.data);
      const recommendations = response.data.recommendations.map((item) => ({
        ...item.job_posting,
        match_score: item.match_score,
        novelty_factors: item.novelty_factors,
      }));
      setRecommendedJobs(recommendations.slice(0, 10));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading((prev) => ({ ...prev, jobs: false }));
    }
  };

  // Function to fetch training recommendations
  const fetchTrainingRecommendations = async () => {
    if (!auth.token) return;
    setLoading((prev) => ({ ...prev, trainings: true }));
    try {
      const response = await axios.get("/api/recommend/training-posting", {
        auth: { username: auth.token },
      });
      console.log("Fetched training data:", response.data);
      const recommendations = response.data.recommendations.map((item) => ({
        ...item.training_posting,
        match_score: item.match_score,
        novelty_factors: item.novelty_factors,
      }));
      setRecommendedTrainings(recommendations.slice(0, 10));
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } finally {
      setLoading((prev) => ({ ...prev, trainings: false }));
    }
  };

  // Function to fetch scholarship recommendations - only for students
  const fetchScholarshipRecommendations = async () => {
    if (!auth.token) return;

    // Skip scholarship fetch for jobseekers
    const user_type = getUserType();
    if (user_type === 'jobseeker') {
      setLoading((prev) => ({ ...prev, scholarships: false }));
      return;
    }

    setLoading((prev) => ({ ...prev, scholarships: true }));
    try {
      const response = await axios.get("/api/recommend/scholarship-posting", {
        auth: { username: auth.token },
      });
      console.log("Fetched scholarship data:", response.data);
      const recommendations = response.data.recommendations.map((item) => ({
        ...item.scholarship_posting,
        match_score: item.match_score,
        novelty_factors: item.novelty_factors,
      }));
      setRecommendedScholarships(recommendations.slice(0, 10));
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading((prev) => ({ ...prev, scholarships: false }));
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("/api/get-announcements", {
        auth: { username: auth.token },
      });
      console.log("Fetched announcements:", response.data.announcements);
      setNotifications(response.data.announcements);
      //setUnreadCount(response.data.announcements.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading((prev) => ({ ...prev, scholarships: false }));
    }
  };


  // Fetch all recommendations when auth token is available
  useEffect(() => {
    if (auth.token) {
      fetchJobRecommendations();
      fetchTrainingRecommendations();
      fetchScholarshipRecommendations();
      fetchAnnouncements();
    }
  }, [auth.token]);

  // Handle application/enrollment logic
  const handleApply = useCallback((id, type) => {
    console.log(`Applied to ${type} with ID: ${id}`);
    // Add your application logic here
  }, []);

  // Handle bookmark toggling
  const handleBookmark = useCallback((id, type) => {
    setBookmarkedItems((prev) => {
      const currentList = prev[type];
      if (currentList.includes(id)) {
        return { ...prev, [type]: currentList.filter((itemId) => itemId !== id) };
      } else {
        return { ...prev, [type]: [...currentList, id] };
      }
    });
  }, []);

  // Render Job Card
  const renderJobCard = (job) => (
    <div className="w-full sm:w-[350px] min-w-0 flex flex-col justify-between snap-start bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 shadow-xl transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1">
      {/* Card Container */}
      <div className="p-6 flex flex-col h-full">
        <div className="max-h-[400px] overflow-auto flex-1">
          {/* Job Header */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-3 items-center">
              <Avatar variant="rounded" className="w-14 h-14 bg-blue-600 text-white text-xl font-bold shadow">
                {job.employer?.company_name?.[0] || "J"}
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold flex items-center text-lg text-gray-900 dark:text-white">
                  {job.job_title}
                  {job.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-blue-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
                  {job.employer?.company_name || "Company"}
                </Typography>
              </div>
            </div>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(job.job_id, "jobs");
              }}
              aria-label={`Bookmark ${job.job_title}`}
            >
              {bookmarkedItems.jobs.includes(job.job_id) ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </div>
          {/* Job Description */}
          <Typography variant="body2" className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">
            {job.job_description || "No description available."}
          </Typography>
          {/* Job Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
              <LocationOnIcon fontSize="small" className="mr-1" />
              {job.city_municipality || "Remote"}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200">
              <PaymentIcon fontSize="small" className="mr-1" />
              {`${job.estimated_salary_from || 0} - ${job.estimated_salary_to || 0}`}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <AccessTimeIcon fontSize="small" className="mr-1" />
              {job.experience_level || "Entry"}
            </span>
          </div>
          {/* Skills */}
          <div className="mb-4 min-h-10">
            {job.other_skills &&
              job.other_skills
                .split(",")
                .slice(0, 3)
                .map((skill) => skill.trim())
                .map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
            Vacancies: {job.no_of_vacancies || 1}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(job.job_id, "job")}
            className="bg-blue-600 hover:bg-blue-700 normal-case rounded-full px-6 py-2 font-semibold shadow"
          >
            Apply Now
          </Button>
        </div>
      </div>
      {/* Card Border Highlight */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-b-2xl" />
    </div>
  );

  // Render Training Card
  const renderTrainingCard = (training) => (
    <div className="w-full sm:w-[350px] min-w-0 flex flex-col justify-between snap-start bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 shadow-xl transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 flex flex-col h-full">
        <div className="max-h-[400px] overflow-auto flex-1">
          {/* Training Header */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-3 items-center">
              <Avatar variant="rounded" className="w-14 h-14 bg-purple-600 text-white text-xl font-bold shadow">
                <MenuBookIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold flex items-center text-lg text-gray-900 dark:text-white">
                  {training.training_title || "Training Program"}
                  {training.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-purple-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
                  {training.provider || "Training Provider"}
                </Typography>
              </div>
            </div>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(training.id, "trainings");
              }}
              aria-label={`Bookmark ${training.title}`}
            >
              {bookmarkedItems.trainings.includes(training.id) ? (
                <BookmarkIcon className="text-purple-600" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </div>
          {/* Training Description */}
          <Typography variant="body2" className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">
            {training.training_description || "No description available."}
          </Typography>
          {/* Training Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200">
              <LocationOnIcon fontSize="small" className="mr-1" />
              {training.training_location || "Online"}
            </span>
          </div>
          {/* Skills */}
          <div className="mb-4 min-h-10">
            {training.skills &&
              training.skills.split(",").slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-block bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
            Enrolled: {training.slots || 0}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(training.id, "training")}
            className="bg-purple-600 hover:bg-purple-700 normal-case rounded-full px-6 py-2 font-semibold shadow"
          >
            Enroll Now
          </Button>
        </div>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-b-2xl" />
    </div>
  );

  // Render Scholarship Card
  const renderScholarshipCard = (scholarship) => (
    <div className="w-full sm:w-[350px] min-w-0 flex flex-col justify-between snap-start bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 shadow-xl transition-all duration-300 hover:border-teal-500 hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 flex flex-col h-full">
        <div className="max-h-[400px] overflow-auto flex-1">
          {/* Scholarship Header */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-3 items-center">
              <Avatar variant="rounded" className="w-14 h-14 bg-teal-600 text-white text-xl font-bold shadow">
                <SchoolIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold flex items-center text-lg text-gray-900 dark:text-white">
                  {scholarship.scholarship_title || "Scholarship Program"}
                  {scholarship.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-teal-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-500 dark:text-gray-300">
                  {scholarship.provider || "Scholarship Provider"}
                </Typography>
              </div>
            </div>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(scholarship.id, "scholarships");
              }}
              aria-label={`Bookmark ${scholarship.title}`}
            >
              {bookmarkedItems.scholarships.includes(scholarship.id) ? (
                <BookmarkIcon className="text-teal-600" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </div>
          {/* Scholarship Description */}
          <Typography variant="body2" className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">
            {scholarship.scholarship_description || "No description available."}
          </Typography>
          {/* Scholarship Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-200">
              <PaymentIcon fontSize="small" className="mr-1" />
              {scholarship.funding_amount || "Full funding"}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <AccessTimeIcon fontSize="small" className="mr-1" />
              {`Deadline: ${scholarship.deadline || "Open"}`}
            </span>
          </div>
          {/* Requirements */}
          <div className="mb-4 min-h-10">
            {scholarship.requirements &&
              scholarship.requirements.split(",").slice(0, 3).map((req) => (
                <span
                  key={req}
                  className="inline-block bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {req.trim()}
                </span>
              ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
          <Typography variant="body2" className="text-teal-600 dark:text-teal-200 font-medium">
            Eligibility: {scholarship.eligibility_criteria || "For Students"}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(scholarship.id, "scholarship")}
            className="bg-teal-600 hover:bg-teal-700 normal-case rounded-full px-6 py-2 font-semibold shadow"
          >
            Apply Now
          </Button>
        </div>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-b-2xl" />
    </div>
  );


  // Get user type from auth token
  const userType = getUserType();
  console.log("user typeeeee", userType)
  // Show a loading spinner while all data is being fetched
  if (loading.jobs && loading.trainings && loading.scholarships) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Update scroll handler to target recommendations section
  const scrollToRecommendations = () => {
    const section = document.getElementById('recommendations-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Navigation handlers
  const handleViewAllJobs = () => {
    navigate('/dashboard/job-search');
  };

  const handleViewAllTrainings = () => {
    navigate('/dashboard/training-search');
  };

  const handleViewAllScholarships = () => {
    navigate('/dashboard/scholarship-search');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] dark:from-gray-900 dark:to-gray-800 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 py-24 px-4 shadow-lg relative overflow-hidden">
        <div className="max-w-6xl w-full flex flex-col items-center text-center z-10">
          <Typography
            variant="h2"
            className="font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg tracking-tight"
          >
            Iloilo Province Employment Portal Services
          </Typography>
          <Typography
            variant="h5"
            className="text-2xl md:text-3xl text-blue-100 mb-10 font-medium"
          >
            Discover, Connect, and Grow your career in Iloilo.
          </Typography>
          <div className="flex flex-wrap gap-6 mt-4 justify-center">
            <Button
              variant="contained"
              color="primary"
              className="bg-white text-blue-700 font-bold px-10 py-4 rounded-2xl shadow hover:bg-blue-50 transition text-xl"
              onClick={scrollToRecommendations}
            >
              Explore Opportunities
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              className="border-white text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 hover:text-white transition text-xl flex items-center gap-2"
              style={{ borderWidth: 2 }}
              component="a"
              href="https://www.facebook.com/peso.ilo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon fontSize="large" />
              <span className="hidden md:inline">Facebook</span>
            </Button>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-30 rounded-full -z-1 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 opacity-20 rounded-full -z-1 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 opacity-10 rounded-full -z-1 blur-3xl" style={{ transform: "translate(-50%, -50%)" }} />
        {/* Add scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <KeyboardArrowDownIcon 
            className="text-white/70 w-10 h-10"
            onClick={scrollToRecommendations}
          />
        </div>
      </section>

      {/* Updated Notifications Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-8 py-3 sm:py-5 flex items-center justify-end w-full pointer-events-none">
        <div className="pointer-events-auto">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200"
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#e41e3f',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            >
              <NotificationsIcon className="text-gray-600 dark:text-gray-300" fontSize="small" />
            </Badge>
          </IconButton>
        </div>

        {/* Responsive Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            className: "mt-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-xs",
            style: { width: "100%", minWidth: 0, maxWidth: 320 }
          }}
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <Typography variant="h6" className="font-semibold">
              Notifications
            </Typography>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.id}
                  onClick={() => {
                    setOpenAnnouncement(notif);
                    setAnchorEl(null);
                  }}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${!notif.read ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <NotificationsIcon 
                        className={!notif.read ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'} 
                        fontSize="small" 
                      />
                    </div>
                    <div>
                      <Typography variant="body2" className="text-gray-900 dark:text-gray-100">
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block mt-0.5">
                        {getRelativeTimeString(notif.created_at)}
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
              ))
            ) : (
              <div className="py-8 text-center">
                <Typography variant="body2" className="text-gray-500">
                  No new notifications
                </Typography>
              </div>
            )}
          </div>
        </Menu>
      </header>

      {/* Simplified Notification Modal */}
      {openAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-lg mx-2 ml-20 sm:ml-16">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Typography variant="subtitle1" className="font-semibold">
                {openAnnouncement.title}
              </Typography>
              <IconButton onClick={() => setOpenAnnouncement(null)} size="small">
                <span className="text-xl text-gray-500">&times;</span>
              </IconButton>
            </div>
            <div className="p-6">
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                {openAnnouncement.details}
              </Typography>
              <Typography variant="caption" className="text-gray-400 mt-4 block">
                {new Date(openAnnouncement.created_at).toLocaleString()}
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div className="w-full max-w-7xl flex flex-col gap-10 items-center pt-10 pb-10">
        {/* Portal Info Section - Slideshow */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900 p-12 mt-[-60px] z-10">
          <div className="flex-1 flex flex-col items-start justify-center">
            <Typography variant="h4" className="font-bold text-3xl text-blue-700 mb-4">
              Why Use the Iloilo Province Employment Portal?
            </Typography>
            <div className="w-full flex flex-col items-start">
              <div className="flex items-center gap-3 mb-6">
                <button
                  className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-lg font-bold shadow hover:bg-blue-200 transition"
                  onClick={() => setSlideIdx((slideIdx - 1 + slideCount) % slideCount)}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-200">
                  {portalSlides[slideIdx].title}
                </span>
                <button
                  className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-lg font-bold shadow hover:bg-blue-200 transition"
                  onClick={() => setSlideIdx((slideIdx + 1) % slideCount)}
                  aria-label="Next"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {portalSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-3 h-3 rounded-full transition-all duration-300 ${slideIdx === idx ? "bg-blue-600" : "bg-blue-200"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src={portalSlides[slideIdx].image}
              alt={portalSlides[slideIdx].title}
              className="rounded-2xl shadow-xl w-[420px] h-72 object-cover border-4 border-blue-200 transition-all duration-500"
              style={{ minWidth: 280, minHeight: 180 }}
            />
          </div>
        </section>

        {/* Recommendations Container */}
        <section id="recommendations-section" className="w-full max-w-7xl">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 px-8 py-6">
              <Typography variant="h4" className="text-white font-bold mb-2">
                Recommended For You
              </Typography>
              <Typography variant="subtitle1" className="text-blue-100">
                Based on your profile and preferences, here are your personalized recommendations
              </Typography>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Jobs Section */}
              {!loading.jobs && (
                <div className="mb-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <div>
                      <Typography variant="h5" className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <span className="text-2xl">Jobs</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({recommendedJobs.length} recommendations)</span>
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                        Opportunities matching your skills and experience
                      </Typography>
                    </div>
                    <Button
                      className="text-blue-600 hover:text-blue-700 w-full sm:w-auto mt-2 sm:mt-0"
                      onClick={handleViewAllJobs}
                    >
                      View all jobs →
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedJobs.length > 0 ? (
                      recommendedJobs.map((job, index) => (
                      <div key={job.job_id || index} className="flex">
                        {renderJobCard(job)}
                      </div>
                      ))
                    ) : (
                      <div className="flex">
                      {renderJobCard({
                        job_id: "placeholder1", 
                        job_title: "No jobs available",
                        employer: { company_name: "Please try again later" },
                      })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Divider className="my-8" />

              {/* Trainings Section */}
              {!loading.trainings && (
                <div className="mb-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <div>
                      <Typography variant="h5" className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <span className="text-2xl">Trainings</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({recommendedTrainings.length} recommendations)</span>
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                        Programs to enhance your professional skills
                      </Typography>
                    </div>
                    <Button
                      className="text-purple-600 hover:text-purple-700 w-full sm:w-auto mt-2 sm:mt-0"
                      onClick={handleViewAllTrainings}
                    >
                      View all trainings →
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedTrainings.length > 0 ? (
                      recommendedTrainings.map((training, index) => (
                        <div key={training.id || index} className="flex">
                          {renderTrainingCard(training)}
                        </div>
                      ))
                    ) : (
                      <div className="flex">
                        {renderTrainingCard({
                          id: "placeholder1",
                          title: "No Training Programs Available",
                          provider: "Please try again later",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Divider className="my-8" />

              {/* Scholarships Section */}
              {!loading.scholarships && userType !== "JOBSEEKER" && (
                <div className="mb-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <div>
                      <Typography variant="h5" className="font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-2">
                        <span className="text-2xl">Scholarships</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({recommendedScholarships.length} recommendations)</span>
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                        Financial aid opportunities suited to your profile
                      </Typography>
                    </div>
                    <Button
                      className="text-teal-600 hover:text-teal-700 w-full sm:w-auto mt-2 sm:mt-0"
                      onClick={handleViewAllScholarships}
                    >
                      View all scholarships →
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedScholarships.length > 0 ? (
                      recommendedScholarships.map((scholarship, index) => (
                        <div key={scholarship.id || index} className="flex">
                          {renderScholarshipCard(scholarship)}
                        </div>
                      ))
                    ) : (
                      <div className="flex">
                        {renderScholarshipCard({
                          id: "placeholder1",
                          title: "No Scholarships Available",
                          provider: "Please try again later",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} PESO ILOILO. All rights reserved.
              </Typography>
              <Typography variant="caption" className="text-gray-500 dark:text-gray-500 mt-1 block">
                A project of the Provincial Government of Iloilo
              </Typography>
              <Typography variant="caption" className="text-gray-400 dark:text-gray-600 mt-1 block">
                peso@iloilo.gov.ph
              </Typography>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;