import axios from "../axios";

export const userRegister = (data) =>
  axios({
    url: `/user/register`,
    method: "POST",
    data,
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
