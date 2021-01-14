import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import {getToken, setToken} from '../utils/jwt'

import { AUTH_GOOGLE_LOGIN_URL } from '../constants/ApiConstants'

export const initLogin = () => dispatch => dispatch({ type: types.LOGIN_INIT })

export const triggerLogin = creds => dispatch => {
  dispatch({ type: types.LOGIN_START })
    console.log("oooo")
    console.log(creds);
  return Api('POST', AUTH_GOOGLE_LOGIN_URL, { data: creds })
    .then(data => {
        console.log(data)
        console.log("AAAAAAAAA")
      setToken(data.token)
      console.log("töken"+getToken())
      dispatch({ type: types.LOGIN_LOADED })


    }).catch(err => {
      const error = err.data
      dispatch({ type: types.LOGIN_LOADED, error })
    })
}
