import { jwtDecode } from "jwt-decode";

import * as actionTypes from "./actionTypes";
import axios from "../../axios";
import React, { useState } from "react";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData,
  };
};

export const captchaAuthSuccess = (authData) => {
  return {
    type: actionTypes.CAPTCHA_AUTH_SUCCESS,
    authData: authData,
  };
};

export const captchaAuthFail = (error) => {
  return {
    type: actionTypes.CAPTCHA_AUTH_FAIL,
    error: error,
  };
};

export const captchaAuthExpired = () => {
  return {
    type: actionTypes.CAPTCHA_AUTH_EXPIRED,
  };
};

export const resetCaptcha = () => {
  return {
    type: actionTypes.CAPTCHA_AUTH_RESET,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  console.log("logo out jdksjfkasdfkj");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const getAuthStorageSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_GET_STORAGE,
    authData: authData,
  };
};

export const getAuthStorage = () => {
  return (dispatch) => {
    const localToken = localStorage.getItem("token");

    if (!localToken) {
      return; // Exit if no token is found
    }

    try {
      const decodeToken = jwtDecode(localToken);
      const expirationDate = localStorage.getItem("expirationDate");
      const userId = decodeToken?.id;
      const user = decodeToken;

      dispatch(
        getAuthStorageSuccess({
          token: localToken,
          expirationDate,
          userId,
          user,
        })
      );
    } catch (error) {
      console.error("Invalid token:", error);
      // Optionally, handle token invalidation here
    }
  };
};

export const auth = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios({
      method: "get",
      url: "/api/token",
      auth: {
        username: username,
        password: password,
      },
      withCredentials: false,
    })
      .then((response) => {
        const user = jwtDecode(response.data.token);
        const expirationDate = new Date(
          new Date().getTime() + response.data.expires_in * 1000
        ).getTime();

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("user", JSON.stringify(user)); // Ensure the user object is stored as a string

        dispatch(
          authSuccess({
            token: response.data.token,
            userId: user.id,
            expirationDate: expirationDate,
            user: user,
          })
        );
        dispatch(checkAuthTimeout(response.data.expires_in));

        return axios
          .get("/api/check-personal-information-status", {
            auth: {
              username: response.data.token,
            },
          })
          .then((statusResponse) => {
            console.log("user type: ", statusResponse.data.user_type);

            statusResponse.data.user_type === "ADMIN"
              ? (window.location.href = "/admin")
              : (window.location.href = statusResponse.data.has_personal_info
                ? "/dashboard"
                : "/user-application-form");
          });
      })
      .catch((error) => {
        dispatch(authFail(error.response?.data || "Authentication failed"));
        window.location.href = "/";
      });
  };
};

export const verifyCaptcha = (recaptchaValue) => {
  return (dispatch) => {
    let bodyFormData = new FormData();
    bodyFormData.set("recaptchaValue", recaptchaValue);

    axios({
      method: "post",
      url: "/api/verify-captcha",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        dispatch(
          captchaAuthSuccess({
            captchaValid: response.data.valid,
          })
        );
      })
      .catch((err) => {
        dispatch(
          authFail(err?.response?.data?.error || "Captcha verification failed")
        );
      });
  };
};
