import axios from "axios";

const axiosUserInstance = axios.create({
  baseURL: "http://localhost:5000/",
});

axiosUserInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("userToken");
    config.headers.token = `Bearer ${token ? token : ""}`;
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);



export { axiosUserInstance };
