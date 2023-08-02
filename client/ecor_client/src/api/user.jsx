import axios from "../axios";

export const userRegister = (data) =>
  axios({
    url: `/user/register`,
    method: "POST",
    data,
    mode: "no-cors",
    withCredentials: true,
  });

export const userFinalRegister = (token = "") =>
  axios({
    url: `/user/finalRegister/` + token,
    method: "PUT",
    mode: "no-cors",
    withCredentials: true,
  });

export const userLogin = (data) =>
  axios({
    url: `/user/login`,
    method: "POST",
    data,
    mode: "no-cors",
    withCredentials: true,
  });

export const userForgotPassWord = (data) =>
  axios({
    url: `/user/forgotpassword`,
    method: `POST`,
    data,
    mode: "no-cors",
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
export const userResetPassWord = (data) =>
  axios({
    url: `/user/resetpassword`,
    method: `PUT`,
    data,
    mode: "no-cors",
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
export const userGetCurrent = () =>
  axios({
    url: `/user/current`,
    method: `GET`,
    mode: "no-cors",
    withCredentials: true,
  });

export const userLogout = () =>
  axios({
    url: `/user/logout`,
    method: `GET`,
    mode: "no-cors",
    withCredentials: true,
  });
export const getAllUsers = (params) =>
  axios({
    url: `/user/`,
    method: `GET`,
    mode: "no-cors",
    withCredentials: true,
    params,
  });
  
export const updateUserByAdmin = (uid, data) =>
  axios({
    url: `/user/` + uid,
    method: `PUT`,
    data,
    mode: "no-cors",
    withCredentials: true,
  });

export const deleteUserApi = (uid) =>
  axios({
    url: `/user/` + uid,
    method: `DELETE`,
    mode: "no-cors",
    withCredentials: true,
  });
