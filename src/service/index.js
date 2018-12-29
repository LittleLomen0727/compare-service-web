import { get, post } from '@/axios/requests'

export default {
  compare (request) {
    const url = '/compare/url'
    return post(url, request)
  },

  requestDirectXML (url) {
    const config = {
      baseURL: ''
    }
    return get(url, config)
  }
}
