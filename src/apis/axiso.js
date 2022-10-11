import axios from "axios";
import router from "../router/index";
const instance = axios.create({
  baseURL:import.meta.env.VITE_APP_REQUEST_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  function(response) {
    if (response.data.code == -1000) {
      router.push({
        path: "/login",
      });
      return Promise.reject(new Error("no login"));
      
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
export default instance;
