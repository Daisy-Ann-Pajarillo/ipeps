import {
    HomeOutlined,
    TravelExploreOutlined,
    BookmarksOutlined,
    WorkOutlineOutlined,
    PageviewOutlined,
    SchoolOutlined,
    BusinessOutlined,
    SettingsOutlined,
    LogoutOutlined,
} from "@mui/icons-material";

const StudentMenuItems = [
    {
        title: "HOME",
        key: "home",
        items: [
            {
                title: "Home",
                to: "/dashboard/student",
                icon: <HomeOutlined />,
            },
        ],
    },
    {
        title: "JOBS",
        key: "jobs",
        items: [
            {
                title: "Job Search",
                to: "/dashboard/student/job-search",
                icon: <TravelExploreOutlined />,
            },
            {
                title: "Saved Jobs",
                to: "/dashboard/student/saved-jobs",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Job Applications",
                to: "/dashboard/student/job-applications",
                icon: <WorkOutlineOutlined />,
            },
        ],
    },
    {
        title: "TRAININGS",
        key: "trainings",
        items: [
            {
                title: "Training Search",
                to: "/dashboard/student/training-search",
                icon: <PageviewOutlined />,
            },
            {
                title: "Saved Trainings",
                to: "/dashboard/student/saved-trainings",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Training Applications",
                to: "/dashboard/student/training-applications",
                icon: <WorkOutlineOutlined />,
            },
        ],
    },
    {
        title: "SCHOLARSHIPS",
        key: "scholarships",
        items: [
            {
                title: "Scholarships Search",
                to: "/dashboard/student/scholarship-search",
                icon: <SchoolOutlined />,
            },
            {
                title: "Saved Scholarships",
                to: "/dashboard/student/saved-scholarships",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Scholarship Applications",
                to: "/dashboard/student/scholarship-applications",
                icon: <WorkOutlineOutlined />,
            },
        ],
    },
    {
        title: "COMPANIES",
        key: "companies",
        items: [
            {
                title: "Companies",
                to: "/dashboard/student/companies",
                icon: <BusinessOutlined />,
            },
        ],
    },
    {
        title: "SETTINGS",
        key: "settings",
        items: [
            {
                title: "Account Settings",
                to: "/dashboard/student/settings",
                icon: <SettingsOutlined />,
            },
            {
                title: "Logout",
                to: "/",
                icon: <LogoutOutlined />,
            },
        ],
    },
];
export default StudentMenuItems;