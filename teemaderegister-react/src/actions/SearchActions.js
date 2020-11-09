import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'
import { loadedTableContentCount } from './TableContentActions'

import { SEARCH_COUNTS_URL } from '../constants/ApiConstants'

export const initSearch = () => dispatch => {
  dispatch({ type: types.SEARCH_INIT })
}

export const setSearch = q => dispatch => {
  dispatch({ type: types.SEARCH_SET, q })
}

export const getSearchCounts = q => dispatch => {
  // dispatch({ type: types.SEARCH_START })

  return Api('GET', SEARCH_COUNTS_URL, { params: { q } })
    .then(response => {
      const { supervisors, topics } = response
      dispatch(loadedTableContentCount({ topics, supervisors }))
      dispatch({ type: types.SEARCH_LOADED, q })
    })
    .catch(err => {
      console.log(err)
    })
}
