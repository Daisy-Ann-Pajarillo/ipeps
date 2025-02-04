import * as actionTypes from './actionTypes';

export const toggleDashboardSidebar = (state) => {
  return {
    type: actionTypes.TOGGLE_DASHBOARD_SIDEBAR,
  };
};

export const toggleDashboardAside = () => {
  return {
    type: actionTypes.TOGGLE_DASHBOARD_ASIDE,
  };
};

export const toggleDarkMode = () => {
  return {
    type: actionTypes.TOGGLE_DASHBOARD_DARKMODE,
  };
};
