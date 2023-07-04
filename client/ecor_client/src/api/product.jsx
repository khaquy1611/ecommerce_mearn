import axios from "../axios";

export const getProducts = (data) =>
  axios({
    url: `/product/`,
    method: `GET`,
    params: {
      sort: data?.sort || "",
    },
  });
