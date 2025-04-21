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
  import { useSelector, useDispatch } from "react-redux";
  import * as actions from "../../../../../store/actions/index";
  import axios from "../../../../../axios";

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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" className="font-medium">
            {title}
          </Typography>
          <div className="flex gap-2">
            <IconButton
              onClick={scrollLeft}
              className="bg-white shadow-md"
              size="small"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={scrollRight}
              className="bg-white shadow-md"
              size="small"
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      </div>
    );
  };

  // Main Dashboard Component
  const Dashboard = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [recommendedTrainings, setRecommendedTrainings] = useState([]);
    const [recommendedScholarships, setRecommendedScholarships] = useState([]);
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

    // Determine user type from auth token
    const getUserType = () => {
      if (!auth.token) return null;
      // Assuming the token structure includes user role information
      // This would need to be adapted to your actual token structure
      try {
        // Check if token contains user type information
        // Example: if token is a JWT, you could decode it
        // Or check against a pattern that indicates user type

        // For this example, we'll assume token has a prefix or pattern indicating user type
        if (auth.token.includes('jobseeker')) {
          return 'jobseeker';
        } else {
          return 'student';
        }

        // Alternative approach: token value itself might represent the user type
        // or you might need to check against stored values
      } catch (error) {
        console.error("Error determining user type:", error);
        return 'student'; // Default to student if there's an error
      }
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

    // Fetch all recommendations when auth token is available
    useEffect(() => {
      if (auth.token) {
        fetchJobRecommendations();
        fetchTrainingRecommendations();
        fetchScholarshipRecommendations();
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
      <div className="min-w-72 w-[500px] flex flex-col justify-between snap-start bg-white rounded-lg border border-gray-200 p-4 h-full transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:bg-gray-50">
        <div className="max-h-[500px] overflow-auto">
          {/* Job Header */}
          <div className="flex break-normal justify-between mb-4">
            <div className="flex gap-3 items-start">
              <Avatar variant="rounded" className="w-12 h-12 bg-blue-600">
                {job.employer?.company_name?.[0] || "J"}
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold break-normal flex items-center">
                  {job.job_title}
                  {job.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-blue-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-600 break-normal">
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
          <Typography variant="body2" className="text-gray-700 mb-4 line-clamp-3">
            {job.job_description || "No description available."}
          </Typography>
          {/* Job Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <LocationOnIcon fontSize="small" className="mr-1 text-gray-500" />
              {job.city_municipality || "Remote"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <PaymentIcon fontSize="small" className="mr-1 text-gray-500" />
              {`${job.estimated_salary_from || 0} - ${job.estimated_salary_to || 0}`}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <AccessTimeIcon fontSize="small" className="mr-1 text-gray-500" />
              {job.experience_level || "Entry"}
            </span>
          </div>
          {/* Skills */}
          <div className="mb-4 min-h-16">
            {job.other_skills &&
              job.other_skills
                .split(",")
                .slice(0, 3)
                .map((skill) => skill.trim())
                .map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-5 border-t-2  border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Vacancies: {job.no_of_vacancies || 1}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(job.job_id, "job")}
            className="bg-blue-600 hover:bg-blue-700 normal-case"
          >
            Apply Now
          </Button>
        </div>
      </div>
    );

    // Render Training Card
    const renderTrainingCard = (training) => (
      <div className="min-w-72 w-[500px] flex flex-col justify-between snap-start bg-white rounded-lg border border-gray-200 p-4 h-full transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:bg-gray-50">
        <div className="max-h-[500px] overflow-auto">
          {/* Training Header */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-3 items-start">
              <Avatar variant="rounded" className="w-12 h-12 bg-purple-600">
                <MenuBookIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold break-normal flex items-center">
                  {training.training_title || "Training Program"}
                  {training.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-purple-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-600 break-normal">
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
          <Typography variant="body2" className="text-gray-700 mb-4 line-clamp-3">
            {training.training_description || "No description available."}
          </Typography>
          {/* Training Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <LocationOnIcon fontSize="small" className="mr-1 text-gray-500" />
              {training.training_location || "null  "}
            </span>
          </div>
          {/* Skills */}
          <div className="mb-4 min-h-16">
            {training.skills &&
              training.skills.split(",").slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-block bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-5 border-t-2  border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Enrolled: {training.slots || 0}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(training.id, "training")}
            className="bg-purple-600 hover:bg-purple-700 normal-case"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    );

    // Render Scholarship Card
    const renderScholarshipCard = (scholarship) => (
      <div className="min-w-72 w-[500px] flex flex-col justify-between snap-start bg-white rounded-lg border border-gray-200 p-4 h-full transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:bg-gray-50">
        <div className="max-h-[500px] overflow-auto">
          {/* Scholarship Header */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-3 items-start">
              <Avatar variant="rounded" className="w-12 h-12 bg-teal-600">
                <SchoolIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1" className="font-bold break-normal flex items-center">
                  {scholarship.scholarship_title || "Scholarship Program"}
                  {scholarship.status === "active" && (
                    <VerifiedUserIcon className="ml-1 text-teal-600" fontSize="small" />
                  )}
                </Typography>
                <Typography variant="body2" className="text-gray-600 break-normal">
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
          <Typography variant="body2" className="text-gray-700 mb-4 line-clamp-3">
            {scholarship.scholarship_description || "No description available."}
          </Typography>
          {/* Scholarship Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <PaymentIcon fontSize="small" className="mr-1 text-gray-500" />
              {scholarship.funding_amount || "Full funding"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <AccessTimeIcon fontSize="small" className="mr-1 text-gray-500" />
              {`Deadline: ${scholarship.deadline || "Open"}`}
            </span>
          </div>
          {/* Requirements */}
          <div className="mb-4 min-h-16">
            {scholarship.requirements &&
              scholarship.requirements.split(",").slice(0, 3).map((req) => (
                <span
                  key={req}
                  className="inline-block bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                >
                  {req.trim()}
                </span>
              ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-5 border-t-2  border-gray-200">
          <Typography variant="body2" className="text-teal-600 font-medium">
            Eligibility: {scholarship.eligibility_criteria || "For Students"}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleApply(scholarship.id, "scholarship")}
            className="bg-teal-600 hover:bg-teal-700 normal-case"
          >
            Apply Now
          </Button>
        </div>
      </div>
    );

    // Get user type from auth token
    const userType = getUserType();

    // Show a loading spinner while all data is being fetched
    if (loading.jobs && loading.trainings && loading.scholarships) {
      return (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg flex flex-col">
        {/* Main Title */}
        <div className="mb-10 text-center">
          <Typography
            variant="h3"
            component="h1"
            className="font-bold text-gray-800 mb-2"
          >
            Start your Journey
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className="font-normal text-gray-600"
          >
            {userType === "jobseeker" ? "Find Work and Train" : "Work, Train and Learn"}
          </Typography>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Jobs Section */}
        {!loading.jobs && (
          <>
            <h1 className="text-3xl mt-5">Job Recommendation</h1>
            <div className="flex overflow-x-scroll gap-3">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job, index) => (
                  <div key={job.job_id || index}>{renderJobCard(job)}</div>
                ))
              ) : (
                <div className="min-w-72 w-72 ">
                  {renderJobCard({
                    job_id: "placeholder1",
                    job_title: "No Jobs Available",
                    employer: { company_name: "Please try again later" },
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Trainings Section */}
        {!loading.trainings && (
          <>
            <h1 className="text-3xl mt-5">Training Recommendation</h1>
            <div className="flex overflow-x-scroll gap-3">
              {recommendedTrainings.length > 0 ? (
                recommendedTrainings.map((training, index) => (
                  <div key={training.id || index}>{renderTrainingCard(training)}</div>
                ))
              ) : (
                <div className="min-w-72 w-72">
                  {renderTrainingCard({
                    id: "placeholder1",
                    title: "No Training Programs Available",
                    provider: "Please try again later",
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Scholarships Section - Only show for students */}
        {!loading.scholarships && userType !== "jobseeker" && (
          <>
            <h1 className="text-3xl mt-5">Scholarship Recommendation</h1>
            <div className="flex overflow-x-scroll gap-3">
              {recommendedScholarships.length > 0 ? (
                recommendedScholarships.map((scholarship, index) => (
                  <div key={scholarship.id || index}>{renderScholarshipCard(scholarship)}</div>
                ))
              ) : (
                <div className="min-w-72 w-72">
                  {renderScholarshipCard({
                    id: "placeholder1",
                    title: "No Scholarships Available",
                    provider: "Please try again later",
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  export default Dashboard;