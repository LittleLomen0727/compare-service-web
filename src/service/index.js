import { get, post } from '@/axios/requests'

export default {
  compare (request) {
    const url = '/compare/url'
    return post(url, request)
  },

  requestDirectXML (url, method) {
    const config = {
      baseURL: ''
    }
    if (method === 'GET') return get(url, config)
    if (method === 'POST') return post(url, {}, config)
    return new Promise((resolve, reject) => {
      reject(new Error('error'))
    })
  }
}
