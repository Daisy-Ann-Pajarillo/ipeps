import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Updated imports for React Router v6
//import { useSelector, useDispatch } from 'react-redux'; // Use hooks instead of connect
import * as actions from "./store/actions/index";

import "./index.css"; // Updated import path
import Home from "./containers/Home/Home";
import Logout from "./containers/Logout/Logout";

import UserApplicationForm from "./containers/UserApplicationForm/UserApplicationForm";
// import EmployerApplicationForm from "./containers/UserApplicationFormNew/EmployerApplicationForm";
// import AcademeApplicationForm from "./containers/UserApplicationFormNew/AcademeApplicationForm";
import { connect } from "react-redux";

import HelloStudent from "./hello-student";
import HelloJobseeker from "./hello-jobseeker";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const App = (props) => {
  useEffect(() => {
    props.onGetAuthStorage(); // Dispatch action to get auth storage
  }, [props.auth.token]);

  let authRoutes = null;
  let applicationRoutes = null;
  console.log("Auth: ", props.auth);
  console.log("Auth Date: ", props.auth.expirationDate);
  console.log("Current Date: ", new Date().getTime());
  console.log("Is Authenticated: ", props.auth.user);

  if (
    props.auth &&
    props.auth.expirationDate > new Date().getTime() &&
    props.auth.user
  ) {
    // Check user type
    if (props.auth.user.user_type === "ADMIN") {
      authRoutes = (
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={loading}>
              {/* <AdminLayout /> */}
            </React.Suspense>
          }
        />
      );
    } else if (props.auth.user.user_type === "EMPLOYER") {
      authRoutes = (
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={loading}>
              {/* <EmployerLayout /> */}
            </React.Suspense>
          }
        />
      );
    } else if (props.auth.user.user_type === "JOBSEEKER") {
      authRoutes = (
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={loading}>
              <HelloJobseeker />
              {/* <JobSeekerLayout /> */}
            </React.Suspense>
          }
        />
      );
      applicationRoutes = (
        <Route
          path="/user-application-form"
          element={
            <React.Suspense fallback={loading}>
              {/* <UserApplicationForm /> */}
            </React.Suspense>
          }
        />
      );
    } else if (props.auth.user.user_type === "ACADEME") {
      authRoutes = (
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={loading}>
              {/* <AcademeLayout /> */}
            </React.Suspense>
          }
        />
      );
    } else if (props.auth.user.user_type === "STUDENT") {
      authRoutes = (
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={loading}>
              <HelloStudent />
              {/* <StudentLayout /> */}
            </React.Suspense>
          }
        />
      );
    }

    // if (auth.verifiedCaptcha) {
    //   dispatch(resetCaptcha()); // Reset captcha if verified
    // }
  }

  // if (
  //   props.auth &&
  //   props.auth.token &&
  //   !(new Date(props.auth.expirationDate) > new Date())
  // ) {
  //   // Not valid
  //   authRoutes = (
  //     <Route
  //       path="/dashboard/*"
  //       element={<Navigate to="/logout" replace />} // Redirect to logout
  //     />
  //   );

  //   // if (auth.verifiedCaptcha) {
  //   //   dispatch(resetCaptcha()); // Reset captcha if verified
  //   // }
  // }

  return (
    <Router>
      <React.Suspense fallback={loading}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/user-application-form"
            element={
              <UserApplicationForm
                //user_type = {props.auth.user.user_type}
                user_type="EMPLOYER"
              />
            }
          />
          {/* <Route
            path="/employer-application-form"
            element={<EmployerApplicationForm />}
          />
           <Route
            path="/academe-application-form"
            element={<AcademeApplicationForm />}
          /> */}

          {/* Application Routes */}
          {applicationRoutes}

          {/* Protected Routes */}
          {authRoutes}

          {/* Catch-all Route */}
          <Route path="*" element={<div>Error</div>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
    //onResetCaptcha: () => dispatch(actions.resetCaptcha()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
