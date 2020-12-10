import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import { TOS_LOAD, TOS_SAVE } from '../constants/ApiConstants'

export const getTos = () => dispatch => {
  return Api('GET', TOS_LOAD)
    .then(response => {
      const { content, updatedAt } = response.doc
      dispatch({ type: types.TOS_LOADED, content, updatedAt })
    })
    .catch(err => {
      console.log(err)
    })
}

export const saveTos = content => dispatch => {
  return Api('POST', TOS_SAVE, { data: content })
    .then(() => {
      dispatch({ type: types.TOS_SAVED })
    })
    .catch(err => {
      console.log(err)
    })
}
