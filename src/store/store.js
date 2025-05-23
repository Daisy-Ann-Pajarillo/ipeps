import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth'; // Import the authReducer
import dashboardReducer from './reducers/dashboard'; // Import the dashboardReducer
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer, 
    user: userReducer,
  },
});

export default store;


