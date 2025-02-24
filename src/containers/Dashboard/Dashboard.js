import StudentDashboard from "./StudentDashboard/StudentDashboard";
import EmployerDashoard from "./EmployersDashboardScreen/EmployerDashboard"
const Dashboard = ({ user_type }) => {
    return (
        <>
            {user_type === "STUDENT" && <StudentDashboard />}
            {user_type === "EMPLOYER" && <EmployerDashoard />}
        </>

    );
}

export default Dashboard;