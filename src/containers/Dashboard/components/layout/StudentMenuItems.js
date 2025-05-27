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
                to: "/dashboard",
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
                to: "/dashboard/job-search",
                icon: <TravelExploreOutlined />,
            },
            {
                title: "Saved Jobs",
                to: "/dashboard/saved-jobs",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Job Applications",
                to: "/dashboard/job-applications",
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
                to: "/dashboard/training-search",
                icon: <PageviewOutlined />,
            },
            {
                title: "Saved Trainings",
                to: "/dashboard/saved-trainings",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Training Applications",
                to: "/dashboard/training-applications",
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
                to: "/dashboard/scholarship-search",
                icon: <SchoolOutlined />,
            },
            {
                title: "Saved Scholarships",
                to: "/dashboard/saved-scholarships",
                icon: <BookmarksOutlined />,
            },
            {
                title: "Scholarship Applications",
                to: "/dashboard/scholarship-applications",
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
                to: "/dashboard/companies",
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
                to: "/dashboard/settings",
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