import { post } from '@/axios/requests'

export default {
  compare (request) {
    const url = '/compare/url'
    return post(url, request)
  }
}