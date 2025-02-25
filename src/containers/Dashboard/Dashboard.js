import StudentDashboard from "./StudentDashboard/StudentDashboard";
import EmployerDashoard from "./EmployersDashboardScreen/EmployerDashboard"
import AdministratorDashboard from "./AdministratorDashboard/AdministratorDashboard";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const userType = useSelector((state) => state.user.userType);
    return (
        <>
            {(userType === "STUDENT" || userType === "JOBSEEKER") && <StudentDashboard />}
            {userType === "EMPLOYER" && <EmployerDashoard />}
            {userType === "ADMIN" && <AdministratorDashboard />}
        </>

    );
}

export default Dashboard;