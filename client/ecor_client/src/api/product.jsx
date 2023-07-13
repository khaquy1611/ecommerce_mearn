import axios from "../axios";

export const getProducts = (params) =>
  axios({
    url: `/product/`,
    method: `GET`,
    params,
    withCredentials: true,
  });
