import axios from "../axios";

export const getProducts = (params) =>
  axios({
    url: `/product/`,
    method: `GET`,
    params,
    withCredentials: true,
  });

export const getProduct = (pid) =>
  axios({
    url: `/product/` + pid,
    method: `GET`,
    withCredentials: true,
  });
