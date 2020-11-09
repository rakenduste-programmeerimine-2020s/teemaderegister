import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { setToken } from '../utils/jwt'

import { AUTH_LOCAL_LOGIN_URL } from '../constants/ApiConstants'

export const initLogin = () => dispatch => dispatch({ type: types.LOGIN_INIT })

export const triggerLogin = creds => dispatch => {
  dispatch({ type: types.LOGIN_START })

  return Api('POST', AUTH_LOCAL_LOGIN_URL, { data: creds })
    .then(data => {
      setToken(data.token)
      dispatch({ type: types.LOGIN_LOADED })
    }).catch(err => {
      const error = err.data
      dispatch({ type: types.LOGIN_LOADED, error })
    })
}
