import axios from '@/axios'
import logger, { error, info } from '@/logger'
import store from '../store'
import { UPDATE_PAGE_LOADING } from '@/store/types/mutation-types'

// Response interceptor
axios.interceptors.response.use(
  res => {
    store.commit(UPDATE_PAGE_LOADING, false)
    logger('')
    info('---------- Response Success ----------')
    logger(`[${res.config.method.toUpperCase()}] ${res.config.url}`)
    logger('data: ', res.data)
    info('--------------------------------------')
    logger('')
    return res
  },
  err => {
    store.commit(UPDATE_PAGE_LOADING, false)
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
    store.commit(UPDATE_PAGE_LOADING, true)
    const accessToken = ''
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  err => Promise.reject(err)
)
