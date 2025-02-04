import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  sidebarShow: false,
  asideShow: false,
  darkMode: false,
};

const toggleDashboardSidebar = (state, action) => {
  return updateObject(state, {
    sidebarShow: !state.sidebarShow,
  });
};

const toggleAsideShow = (state, action) => {
  return updateObject(state, {
    asideShow: !state.asideShow,
  });
};

const toggleDarkMode = (state, action) => {
  console.log(state);
  return updateObject(state, {
    darkMode: !state.darkMode,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_DASHBOARD_SIDEBAR:
      return toggleDashboardSidebar(state, action);
    case actionTypes.TOGGLE_DASHBOARD_ASIDE:
      return toggleAsideShow(state, action);
    case actionTypes.TOGGLE_DASHBOARD_DARKMODE:
      return toggleDarkMode(state, action);
    default:
      return state;
  }
};

export default reducer;
