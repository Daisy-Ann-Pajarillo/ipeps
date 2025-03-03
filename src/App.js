import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Updated imports for React Router v6
import { useSelector, useDispatch } from "react-redux";
import { setUserType } from "./store/userSlice";
import * as actions from "./store/actions/index";

import "./index.css"; // Updated import path
import Home from "./containers/Home/Home";
import Logout from "./containers/Logout/Logout";
import UserApplicationForm from "./containers/UserApplicationForm/UserApplicationForm";
import HelloStudent from "./hello-student";
import HelloJobseeker from "./hello-jobseeker";
import Dashboard from "./containers/Dashboard/Dashboard";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(actions.getAuthStorage()); // Dispatch action directly
  }, [dispatch]);

  let authRoutes = null;
  let applicationRoutes = null;

  if (auth && auth.expirationDate > new Date().getTime() && auth.user) {
    dispatch(setUserType(auth.user.user_type));

    switch (auth.user.user_type) {
      case "ADMIN":
        authRoutes = <Route path="/dashboard/*" element={<React.Suspense fallback={loading}>{/* <AdminLayout /> */}</React.Suspense>} />;
        break;
      case "EMPLOYER":
        authRoutes = <Route path="/dashboard/*" element={<React.Suspense fallback={loading}>{/* <EmployerLayout /> */}</React.Suspense>} />;
        break;
      case "JOBSEEKER":
        authRoutes = <Route path="/dashboard/*" element={<React.Suspense fallback={loading}><HelloJobseeker /></React.Suspense>} />;
        applicationRoutes = <Route path="/user-application-form" element={<React.Suspense fallback={loading}>{/* <UserApplicationForm /> */}</React.Suspense>} />;
        break;
      case "ACADEME":
        authRoutes = <Route path="/dashboard/*" element={<React.Suspense fallback={loading}>{/* <AcademeLayout /> */}</React.Suspense>} />;
        break;
      case "STUDENT":
        authRoutes = <Route path="/dashboard/*" element={<React.Suspense fallback={loading}><HelloStudent /></React.Suspense>} />;
        break;
      default:
        break;
    }
  }

  return (
    <Router>
      <React.Suspense fallback={loading}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/user-application-form" element={<UserApplicationForm />} />
          <Route path="dashboard/*" element={<Dashboard />} />

          {/* Protected Routes */}
          {authRoutes}

          {/* Catch-all Route */}
          <Route path="*" element={<div>Error</div>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
