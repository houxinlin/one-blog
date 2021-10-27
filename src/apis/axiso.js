import axios from "axios";
import router from "../router/index";
const instance = axios.create({
  // baseURL:"https://houxinlin.com/OneBlog/",
  baseURL: "http://localhost:8082/",
  withCredentials: true,
});

instance.interceptors.response.use(
  function(response) {
    if (response.data.code == -1000) {
      router.push({
        path: "/login",
      });
      Promise.reject(error);
      return
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
export default instance;
