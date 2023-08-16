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
export const productRatings = (data) =>
  axios({
    url: `/product/ratings`,
    method: `PUT`,
    mode: "no-cors",
    data,
    withCredentials: true,
  });
export const createProduct = (data) =>
  axios({
    url: `/product/`,
    method: `POST`,
    mode: "no-cors",
    data,
    withCredentials: true,
  });
export const updateProduct = (data, pid) =>
  axios({
    url: "/product/" + pid,
    method: "PUT",
    data,
  });
export const deleteProduct = (pid) =>
axios({
  url: "/product/" + pid,
  method: "DELETE",
  mode: "no-cors",
  withCredentials: true,
});
export const addVariants = (pid,data) => 
axios({
  url: "/product/variants/" + pid,
  method: "PUT",
  data
})