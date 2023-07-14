import axios from "axios";
const instance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  function (config) {
    let localStorageData = window.localStorage.getItem("persist:shop/user");
    if (localStorageData && typeof localStorageData === "string") {
      localStorageData = JSON.parse(localStorageData);
      const accessToken = JSON.parse(localStorageData?.token);
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      return config;
    } else {
      // Làm gì đó trước khi request dược gửi đi
      return config;
    }
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data;
  },
  function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return error.response;
  }
);

export default instance;
