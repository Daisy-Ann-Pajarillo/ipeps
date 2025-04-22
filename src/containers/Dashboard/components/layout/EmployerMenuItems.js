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

const EmployerMenuItems = [
    {
        title: "HOME",
        key: "home",
        items: [
            {
                title: "Home",
                to: "/dashboard/",
                icon: <HomeOutlined />,
            },
        ],
    },
    {
        title: "POSTINGS",
        key: "postings",
        items: [
            {
                title: "Job Posting",
                to: "/dashboard/job-posting",
                icon: <TravelExploreOutlined />,
            },
            {
                title: "Training Posting",
                to: "/dashboard/training-posting",
                icon: <PageviewOutlined />,
            },
            {
                title: "Scholarship Posting",
                to: "/dashboard/scholarship-posting",
                icon: <SchoolOutlined />,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        key: "management",
        items: [
            {
                title: "Manage",
                to: "/dashboard/manage-employers",
                icon: <BusinessOutlined />,
            },
            {
                title: "Manage Applicants",
                to: "/dashboard/applicants",
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

export default EmployerMenuItems;
