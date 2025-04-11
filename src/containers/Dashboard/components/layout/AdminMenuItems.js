import {
    HomeOutlined,
    SettingsOutlined,
    PeopleOutlined,
    ContactsOutlined,
    ReceiptOutlined,
    PersonSearchOutlined,
    AssessmentRounded,
    AccountBalanceOutlined,
    LogoutOutlined,
} from "@mui/icons-material";

const AdministratorMenuItems = [
    {
        title: "DASHBOARD",
        key: "dashboard",
        items: [
            {
                title: "Dashboard",
                to: "/dashboard/",
                icon: <HomeOutlined />,
            },
        ],
    },
    {
        title: "SETTINGS",
        key: "settings",
        items: [
            {
                title: "Settings",
                to: "/dashboard/admin/settings",
                icon: <SettingsOutlined />,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        key: "management",
        items: [
            {
                title: "Manage Users",
                to: "/dashboard/admin/manage-users",
                icon: <PeopleOutlined />,
            },
            {
                title: "Job Postings",
                to: "/dashboard/admin/job-postings",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Scholarship Postings",
                to: "/dashboard/admin/scholarships-postings",
                icon: <ContactsOutlined />,
            },
            {
                title: "Training Postings",
                to: "/dashboard/admin/training-postings",
                icon: <ReceiptOutlined />,
            },

            {
                title: "Job Applications",
                to: "/dashboard/admin/job-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Scholarships Applications",
                to: "/dashboard/admin/scholarship-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Training Applications",
                to: "/dashboard/admin/training-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Placement Reports",
                to: "/dashboard/admin/placement-reports",
                icon: <AssessmentRounded />,
            },
            {
                title: "Employers",
                to: "/dashboard/admin/employer",
                icon: <AccountBalanceOutlined />,
            },
        ],
    },
    {
        title: "LOGOUT",
        key: "logout",
        items: [
            {
                title: "Logout",
                to: "/",
                icon: <LogoutOutlined />,
            },
        ],
    },
];

export default AdministratorMenuItems;
