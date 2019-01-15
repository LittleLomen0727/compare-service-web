import axios from 'axios'

export default axios.create({
  baseURL: 'http://45.78.3.69:8888',
  withCredentials: false
})
