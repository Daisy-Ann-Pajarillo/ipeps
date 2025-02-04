import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  token: null,
  userId: null,
  expirationDate: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
  verifiedCaptcha: false,
  user: null,
};

const authStart = (state) => {
  return updateObject(state, { error: null, loading: true });
};

const captchaAuthSuccess = (state) => {
  return updateObject(state, { verifiedCaptcha: true });
};

const captchaAuthFail = (state) => {
  return updateObject(state, { verifiedCaptcha: false });
};

const captchaAuthExpired = (state) => {
  return updateObject(state, { verifiedCaptcha: false });
};

const captchaAuthReset = (state) => {
  return updateObject(state, { verifiedCaptcha: false });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.authData.token,
    userId: action.authData.userId,
    expirationDate: action.authData.expirationDate,
    error: null,
    loading: false,
    user: action.authData.user,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state) => {
  return updateObject(state, {
    token: null,
    userId: null,
    expirationDate: null,
    user: null,
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const getAuthStorage = (state, action) => {
  return updateObject(state, {
    token: action.authData.token,
    userId: action.authData.userId,
    expirationDate: action.authData.expirationDate,
    error: null,
    loading: false,
    user: action.authData.user,
  });
};

// Rename the reducer function to match the file name
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.CAPTCHA_AUTH_SUCCESS:
      return captchaAuthSuccess(state, action);
    case actionTypes.CAPTCHA_AUTH_FAIL:
      return captchaAuthFail(state, action);
    case actionTypes.CAPTCHA_AUTH_EXPIRED:
      return captchaAuthExpired(state, action);
    case actionTypes.CAPTCHA_AUTH_RESET:
      return captchaAuthReset(state, action);
    case actionTypes.AUTH_GET_STORAGE:
      return getAuthStorage(state, action);

    default:
      return state;
  }
};

// Export the renamed reducer
export default authReducer; // Corrected export