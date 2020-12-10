import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { setToken } from '../utils/jwt'

import { ADMIN_ADD_NEW_USER } from '../constants/ApiConstants'

export const initAddNewUser = () => dispatch => dispatch({ type: types.ADMIN_INIT_ADD_NEW_USER })

export const adminAddNewUser = creds => {
  return dispatch => {
    dispatch({type: types.LOGIN_START})
    return Api('POST', ADMIN_ADD_NEW_USER, {data: creds})
      .then(data => {
        setToken(data.token)
        dispatch({type: types.LOGIN_LOADED})
        return data
      }).catch(err => {
        const error = err.data
        dispatch({type: types.LOGIN_LOADED, error})
        return err.data
      })
  }
}
