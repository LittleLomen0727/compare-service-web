import axios from '@/axios'
import logger, { error, info } from '@/logger'
import App from '../App'

// Response interceptor
axios.interceptors.response.use(
  res => {
    logger('')
    info('---------- Response Success ----------')
    logger(`[${res.config.method.toUpperCase()}] ${res.config.url}`)
    logger('data: ', res.data)
    info('--------------------------------------')
    logger('')
    return res
  },
  err => {
    const res = err.response
    logger(res)
    if (!res) {
      // unknown error that we cannot handle
      return Promise.reject(err)
    }

    // print info
    error('----------- Response Error -----------')
    error(`status: ${res.status}`)
    error(`[${res.config.method.toUpperCase()}] ${res.config.url}`)
    logger(res.data)
    error('--------------------------------------')

    return Promise.reject(err)
  }
)

// Request interceptor
axios.interceptors.request.use(
  config => {
    console.info(App)
    const accessToken = ''
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  err => Promise.reject(err)
)
