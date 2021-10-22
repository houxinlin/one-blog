import axios from 'axios'

const instance = axios.create({
  baseURL:"http://192.168.43.220:8082/",

})

export default instance
