import {
    PeopleOutlined,
    ReceiptOutlined,
    ContactsOutlined,
} from "@mui/icons-material";

const AcademeMenuItems = [
    {
        title: "DASHBOARD",
        section: null, // No header
        items: [
            { title: "Academic Profile", to: "/dashboard/academe/academic-profile", icon: <PeopleOutlined /> },
        ],
    },
    {
        title: "SCHOOL RECORDS",
        section: "SCHOOL RECORDS",
        items: [
            { title: "Manage Graduate Report", to: "/dashboard/academe/manage-graduate-report", icon: <ReceiptOutlined /> },
            { title: "Manage Enrollment Report", to: "/dashboard/academe/manage-enrollment-report", icon: <ReceiptOutlined /> },
        ],
    },
    {
        title: "INFORMATION",
        section: "INFORMATION",
        items: [
            { title: "Settings", to: "/dashboard/academe/settings", icon: <ContactsOutlined /> },
            { title: "Application Settings", to: "/dashboard/academe/application-settings", icon: <ReceiptOutlined /> },
        ],
    },
];

export default AcademeMenuItems;
