import axios from 'axios'
export function request() {
  const instance = axios.create()

  instance.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config 
  })
  return instance
}