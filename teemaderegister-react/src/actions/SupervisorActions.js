import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import { loadedTableContentCount } from './TableContentActions'

import { SUPERVISOR_SLUG_URL, TOPICS_ADMIN_URL } from '../constants/ApiConstants'

export const initSupervisor = () => dispatch => {
  dispatch({ type: types.SUPERVISOR_INIT })
}

export const getSupervisor = slug => dispatch => {
  return Api('GET', SUPERVISOR_SLUG_URL.replace(':slug', slug))
    .then(({ supervisor, counts }) => {
      dispatch(
        loadedTableContentCount({
          topics: {
            available: counts.available,
            registered: counts.registered.all,
            defended: counts.defended.all,
            all: counts.all
          }
        })
      )
      dispatch({ type: types.SUPERVISOR_LOADED, supervisor, counts })
    })
    .catch(err => {
      dispatch({type: types.SUPERVISOR_NOT_FOUND, message: err.data.message})
      console.log(err)
    })
}

export const getSupervisorTopics = userData => {
    return async () => {
        try {
            return await Api('POST', TOPICS_ADMIN_URL, {data: userData})
        } catch (err) {
            return err.data
        }
    }
}

