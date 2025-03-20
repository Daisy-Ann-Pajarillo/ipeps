import StudentDashboard from "./StudentDashboard/StudentDashboard";
import EmployerDashoard from "./EmployersDashboardScreen/EmployerDashboard"
import AdministratorDashboard from "./AdministratorDashboard/AdministratorDashboard";
import AcademeDashboard from "./AcademeDashboard/AcademicDashboard";
import { useSelector } from "react-redux";


///// delete this component
const Dashboard = () => {
    const userType = useSelector((state) => state.user.userType);
    return (
        <>
            {(userType === "STUDENT" || userType === "JOBSEEKER") && <StudentDashboard />}
            {userType === "EMPLOYER" && <EmployerDashoard />}
            {userType === "ADMIN" && <AdministratorDashboard />}
            {userType === "ACADEME" && <AcademeDashboard />}
        </>

    );
}

export default Dashboard;