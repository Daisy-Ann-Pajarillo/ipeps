import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../../../gab/Ipeps-Frontend/OJT_2 WORK/ipeps-frontend/src/theme";
import {
    HomeOutlined,
    PeopleOutlined,
    ContactsOutlined,
    ReceiptOutlined,
    MenuOutlined,
} from "@mui/icons-material";

// Item Component
const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <MenuItem
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>
                <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
                    {title}
                </Link>
            </Typography>
        </MenuItem>
    );
};

// SideBar Component
const SideBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const [profileImage, setProfileImage] = useState(
        "https://st2.depositphotos.com/1003940/5526/i/450/depositphotos_55260497-stock-photo-cute-happy-baby-boy-crawling.jpg"
    );

    // Handle profile image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    // Toggle sidebar collapse on mobile
    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* Sidebar Toggle Button */}
                    <MenuItem
                        onClick={handleSidebarToggle}
                        icon={isCollapsed ? <MenuOutlined /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontSize: 12 }}>
                                    ACADEME
                                </Typography>
                                <IconButton onClick={handleSidebarToggle}>
                                    <MenuOutlined />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* Sidebar Profile Section */}
                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <label htmlFor="profile-upload">
                                    <img
                                        alt="profile-user"
                                        width="100px"
                                        height="100px"
                                        src={profileImage}
                                        style={{ cursor: "pointer", borderRadius: "50%" }}
                                    />
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    Baby
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    ACADEME
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Sidebar Menu Items */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Academic Profile"
                            to="/academe-dashboard/academic-profile"
                            icon={<PeopleOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography variant="h6" color={colors.grey[100]} sx={{ fontSize: 12 }}>
                            SCHOOL RECORDS
                        </Typography>
                        <Item
                            title="Manage Graduate Report"
                            to="/academe-dashboard/manage-graduate-report"
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Manage Enrollment Report"
                            to="/academe-dashboard/manage-enrollment-report"
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography variant="h6" color={colors.grey[100]} sx={{ fontSize: 12 }}>
                            INFORMATION
                        </Typography>
                        <Item
                            title="Settings"
                            to="/academe-dashboard/settings"
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Application Settings"
                            to="/academe-dashboard/application-settings"
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default SideBar;
