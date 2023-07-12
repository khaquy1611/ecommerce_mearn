import axios from "../axios";

export const userRegister = (data) =>
  axios({
    url: `/user/register`,
    method: "POST",
    data,
    withCredentials: true,
  });

export const userLogin = (data) =>
  axios({
    url: `/user/login`,
    method: "POST",
    data,
    withCredentials: true,
  });

export const userForgotPassWord = (data) =>
  axios({
    url: `/user/forgotpassword`,
    method: `POST`,
    data,
    withCredentials: true,
  });
