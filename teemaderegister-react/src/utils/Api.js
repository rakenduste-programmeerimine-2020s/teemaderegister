import axios from 'axios'
import { getToken } from './jwt'
import nprogress from 'nprogress'
nprogress.configure({
  speed: 100,
  trickleSpeed: 100
})
let timeout = null
let isStarted = false

const makeConfig = (method, url, query) => {
  let config = {
    method: method,
    url: url
  }

  if (query && query.data && ['PUT', 'POST', 'PATCH'].indexOf(method) !== -1) {
    config.data = query.data
  }

  if (query && query.params) {
    config.params = query.params
  }

  // IF TOKEN ADD TO REQUEST
  const token = getToken()
  if (token) {
    config.headers = {
      Authorization: 'Bearer ' + token
    }
  }

  return config
}

export default (method, url, query) => {
  const config = makeConfig(method, url, query)

  if (!isStarted) nprogressHandler.start()

  return axios
    .request(config)
    .then(response => {
      nprogressHandler.delay()
      return Promise.resolve(response.data)
      
    })
    .catch(err => {
      if (err.status === 403) {
        // dispatch same as logout
        console.log('not authorized')
      }

      nprogressHandler.delay()

      return Promise.reject(err.response)
    })
}

const nprogressHandler = {
  start: () => {
    isStarted = true
    nprogress.start()
  },
  end: () => {
    isStarted = false
    timeout = null
    nprogress.done()
  },
  delay: () => {
    if (timeout && isStarted) {
      nprogress.inc()
      clearTimeout(timeout)
    }

    timeout = nprogressHandler.timer()
  },
  timer: () => setTimeout(nprogressHandler.end, 500)
}
