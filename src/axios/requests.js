import axios from '@/axios'

export function request (config) {
  return new Promise((resolve, reject) => {
    axios.request(config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}

export function get (url, config) {
  return new Promise((resolve, reject) => {
    axios.get(url, config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}

export function post (url, data, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}

export function del (url, config) {
  return new Promise((resolve, reject) => {
    axios.delete(url, config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}

export function patch (url, data, config) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data, config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}

export function put (url, data, config) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, config).then(
      res => {
        resolve(res)
      },
      err => {
        reject(err.response)
      }
    )
  })
}
