import axios from "../axios";
export const getAllRoles = (params) =>
  axios({
    url: `/role/`,
    method: `GET`,
    mode: "no-cors",
    withCredentials: true,
    params,
  });
