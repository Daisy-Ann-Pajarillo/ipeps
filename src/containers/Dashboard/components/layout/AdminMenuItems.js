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
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
const AdministratorMenuItems = [
    {
        title: "DASHBOARD",
        key: "dashboard",
        items: [
            {
                title: "Dashboard",
                to: "/admin/",
                icon: <HomeOutlined />,
            },
            {
                title: "Announcement",
                to: "/admin/announcement",
                icon: <CelebrationOutlinedIcon />,
            },
        ],
    },
    {
        title: "SETTINGS",
        key: "settings",
        items: [
            {
                title: "Settings",
                to: "/admin/settings",
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
                to: "/admin/manage-users",
                icon: <PeopleOutlined />,
            },
            {
                title: "Job Postings",
                to: "/admin/job-postings",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Scholarship Postings",
                to: "/admin/scholarships-postings",
                icon: <ContactsOutlined />,
            },
            {
                title: "Training Postings",
                to: "/admin/training-postings",
                icon: <ReceiptOutlined />,
            },

            {
                title: "Job Applications",
                to: "/admin/job-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Scholarships Applications",
                to: "/admin/scholarship-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Training Applications",
                to: "/admin/training-applications",
                icon: <PersonSearchOutlined />,
            },
            {
                title: "Placement Reports",
                to: "/admin/placement-reports",
                icon: <AssessmentRounded />,
            },
            {
                title: "Employers",
                to: "/admin/employer",
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
