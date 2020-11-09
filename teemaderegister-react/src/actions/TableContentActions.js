import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import {
  SUPERVISORS_URL,
  TOPICS_URL
} from '../constants/ApiConstants'

export const initTableContent = () => dispatch =>
  dispatch({ type: types.TABLE_INIT })

export const loadedTableContentCount = ({ topics, supervisors }) => dispatch =>
  dispatch({ type: types.TABLE_COUNT_LOADED, topics, supervisors })

export const clearTableContent = params => dispatch =>
  dispatch({ type: types.TABLE_CLEAR, params })

export const getTableContent = (params, showLoading) => dispatch => {
  if (showLoading) dispatch({ type: types.TABLE_START })

  const API_URL = params.tab === 'topics'
    ? TOPICS_URL
    : params.tab === 'supervisors'
      ? SUPERVISORS_URL
      : TOPICS_URL // default

  return Api('GET', API_URL, { params })
    .then(({ topics, supervisors, count, query }) => {
      dispatch({ type: types.TABLE_LOADED, topics, supervisors, count, query })
    })
    .catch(err => {
      console.log(err)
    })
}
