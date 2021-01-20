import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { setToken } from '../utils/jwt'

import { SIGNUP_URL } from '../constants/ApiConstants'

export const initSignUp = () => dispatch => dispatch({ type: types.SIGNUP_INIT })

export const triggerSignUp = creds => dispatch => {
  dispatch({ type: types.SIGNUP_START })

  return Api('POST', SIGNUP_URL, { data: creds })
    .then(data => {
      setToken(data.token)
      dispatch({ type: types.SIGNUP_LOADED })
    }).catch(err => {
      const error = err.data
      dispatch({ type: types.SIGNUP_LOADED, error })
    })
}
