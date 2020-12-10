import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { setToken } from '../utils/jwt'

import { ADMIN_ADD_NEW_USER } from '../constants/ApiConstants'

export const initAddNewUser = () => dispatch => dispatch({ type: types.CREATE_USER_INIT })

export const adminAddNewUser = userData => {
  return dispatch => {
    dispatch({type: types.CREATE_USER_START})
    return Api('POST', ADMIN_ADD_NEW_USER, {data: userData})
      .then(data => {
        setToken(data.token)
        dispatch({type: types.CREATE_USER_LOADED})
        return data
      }).catch(err => {
        const error = err.data
        dispatch({type: types.LOGIN_LOADED, error})
        return error
      })
  }
}
