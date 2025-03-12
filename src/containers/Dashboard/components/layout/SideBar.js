import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentMenuItems from "./StudentMenuItems";
import JobseekerMenuItems from "./JobseekerMenuItems";
import EmployerMenuItems from "./EmployerMenuItems";
import AdministratorMenuItems from "./AdminMenuItems";
import AcademeMenuItems from "./AcademeMenuItems";
import { ExpandMore, ExpandLess, Menu, ChevronLeft, DarkMode, LightMode } from "@mui/icons-material";
import ToggleDarkMode from "../../../../reusable/components/toggleDarkMode";

const SidebarGroupItems = ({ title, children, isCollapsed, isOpen, onToggle }) => (
    <>
        {!isCollapsed && (
            <button
                onClick={onToggle}
                className={`flex justify-between items-center w-full px-3 py-2
                    text-gray-900 dark:text-white font-bold text-xs cursor-pointer
                    hover:bg-gray-300 dark:hover:bg-gray-900 transition-all duration-300 ease-in-out
                    ${isOpen ? "bg-gray-200 dark:bg-gray-800" : "bg-transparent"}
                `}
            >
                <span>{title}</span>
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </button>
        )}

        {(isCollapsed || (!isCollapsed && isOpen)) && (
            <div className={`pl-4 flex flex-col ${isCollapsed ? "gap-5" : ""} transition-all duration-300 ease-in-out`}>
                {children}
            </div>
        )}
    </>
);

const SidebarItem = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
    return (
        <Link
            to={to}
            className={`flex items-center w-full px-3 py-2 cursor-pointer no-underline rounded-md
                ${selected === title
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}
                transition-all duration-300 ease-in-out
                ${isCollapsed ? "justify-center" : ""}
            `}
            onClick={() => setSelected(title)}
        >
            {icon && <span className={`${!isCollapsed && "mr-2"}`}>{icon}</span>}
            {!isCollapsed && <span className="text-md">{title}</span>}
        </Link>
    );
};

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
    const userType = useSelector((state) => state.user.userType);
    const [selected, setSelected] = useState("Dashboard");
    const [profileImage, setProfileImage] = useState("https://bit.ly/40SdWk7");
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (userType === "STUDENT") {
            setMenuItems(StudentMenuItems);
        } else if (userType === "JOBSEEKER") {
            setMenuItems(JobseekerMenuItems);
        }  else if (userType === "EMPLOYER") {
            setMenuItems(EmployerMenuItems);
        } else if (userType === "ADMIN") {
            setMenuItems(AdministratorMenuItems);
        } else if (userType === "ACADEME") {
            setMenuItems(AcademeMenuItems);
        }
    }, [userType]);

    const [openSections, setOpenSections] = useState({});
    useEffect(() => {
        setOpenSections(Object.fromEntries(menuItems.map(({ key }) => [key, true])));
    }, [menuItems]);

    return (
        <div
            className={`
                relative
                ${isCollapsed ? "w-20" : "w-[280px]"}
                bg-gray-100 dark:bg-gray-950 h-dvh pb-10 overflow-y-auto
                transition-all duration-300 ease-in-out
            `}
        >
            {/* Sidebar Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`
                    absolute top-4 left-0 transform translate-x-1/2
                    flex items-center justify-center
                    w-8 h-8 rounded-full
                    bg-blue-600 text-white
                    shadow-lg cursor-pointer
                    hover:bg-blue-700
                    transition-all duration-300 ease-in-out
                    z-10
                `}
            >
                {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {!isCollapsed && (
                <div className="mb-6 text-center pt-6 relative">
                    <ToggleDarkMode className={"absolute right-3 top-3"} />
                    <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700">
                        <label htmlFor="profile-upload" className="block w-full h-full cursor-pointer">
                            <img
                                alt="profile-user"
                                src={profileImage}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </label>
                        <input id="profile-upload" type="file" accept="image/*" className="hidden" />
                    </div>
                    <p className="text-gray-900 dark:text-white text-lg font-semibold mt-2.5">Emily Smith</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm opacity-75">{userType}</p>
                </div>
            )}

            <div className={`flex flex-col ${isCollapsed ? "gap-10 mt-16" : "mt-8"} px-2`}>
                {menuItems.map(({ title, key, items }) => (
                    <SidebarGroupItems
                        key={key}
                        title={title}
                        isCollapsed={isCollapsed}
                        isOpen={openSections[key]}
                        onToggle={() => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))}
                    >
                        {items.map(({ title, to, icon }) => (
                            <SidebarItem
                                key={title}
                                title={title}
                                to={to}
                                icon={icon}
                                selected={selected}
                                setSelected={setSelected}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </SidebarGroupItems>
                ))}
            </div>
        </div>
    );
};

export default SideBar;
