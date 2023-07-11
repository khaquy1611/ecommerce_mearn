import axios from "../axios";

export const userRegister = (data) => axios({
    url: `/user/register`,
    method: "POST",
    data
});

export const userLogin = (data) => axios({
    url: `/user/login`,
    method: "POST",
    data
});