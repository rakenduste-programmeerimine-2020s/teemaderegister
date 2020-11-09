import { removeEmpty } from './Helpers'
import queryString from 'query-string'

export default (action, location, params, defaults) => {
  // to escape changing state
  params = Object.assign({}, params)
  // hide defaults, for example page = 1
  if (defaults) {
    Object.keys(defaults).forEach(key => {
      if (params[key] && params[key] === defaults[key]) delete params[key]
    })
  }

  params = removeEmpty(params)
  const { filters } = params
  // if filters add each filter to params separately
  if (filters) {
    Object.keys(filters).forEach(key => {
      // filters[key]

      // allow single alues for now
      if (!params[key]) params[key] = filters[key]
    })

    delete params['filters']
  }

  action(
    location + '?' + queryString.stringify(params, { arrayFormat: 'bracket' })
  )
}
