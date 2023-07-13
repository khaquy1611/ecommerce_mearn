import axios from "../axios";

// Lấy danh mục sản phẩm
export const getCategories = () =>
  axios({
    url: "/product_categories/",
    method: "GET",
    withCredentials: true,
  });
