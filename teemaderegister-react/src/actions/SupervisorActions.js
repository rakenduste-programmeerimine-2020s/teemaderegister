import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import { loadedTableContentCount } from './TableContentActions'

import { SUPERVISOR_SLUG_URL, SUPERVISORS_URL, CURRICULUMS_URL, TOPICS_URL } from '../constants/ApiConstants'

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
      console.log(err)
    })
}

export const createTopic = dispatch => {
    return async () => {
        try {
            return await Api('POST', TOPICS_URL, {data: dispatch})
        } catch (err) {
            return err.data
        }
    }
}

export const getSupervisors = dispatch => {
    return async () => {
        try {
            return await Api('GET', SUPERVISORS_URL, {data: dispatch})
        } catch (err) {
            return err.data
        }
    }
}

export const getCurriculums = dispatch => {
    return async () => {
        try {
            return await Api('GET', CURRICULUMS_URL, {data: dispatch})
        } catch (err) {
            return err.data
        }
    }
}

