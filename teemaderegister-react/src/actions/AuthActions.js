import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { clearToken, setToken } from '../utils/jwt'

import {
  USER_ME_URL,
  AUTH_LOGOUT_URL
} from '../constants/ApiConstants'

export const checkUser = () => {
  return dispatch => {
    dispatch({ type: types.AUTH_START })

    Api('GET', USER_ME_URL)
      .then(data => {
        const { user, token } = data
        if (token) setToken(token)
        dispatch({ type: types.AUTH_LOADED, user, token })
      })
      .catch(() => {
        clearToken()
        return dispatch({ type: types.AUTH_INIT })
      })
  }
}

export const logout = () => dispatch => {
  const completeLogout = () => dispatch => {
    clearToken()
    dispatch({ type: types.AUTH_INIT })
  }

  return Api('POST', AUTH_LOGOUT_URL)
    .then(() => {
      dispatch(completeLogout())
    })
    .catch(() => {
      console.warn('already logged out')
      dispatch(completeLogout())
    })
}
