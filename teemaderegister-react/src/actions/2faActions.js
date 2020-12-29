import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import {
  USER_FACTOR
} from '../constants/ApiConstants'


export const get = () => dispatch => {
  return Api('GET', USER_FACTOR)
    .then(data => dispatch({
      type: types.FACTOR_LOADED,
      factor: data.factor
    }))
    .catch(err => {
      console.log(err)
    })
}