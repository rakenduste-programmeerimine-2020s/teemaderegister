import Api from './../utils/Api'
import * as types from '../constants/ActionTypes'
import { PASSWORD_FORGOT_URL, PASSWORD_RESET_URL } from './../constants/ApiConstants'

export const initPasswordReset = () => dispatch => dispatch({ type: types.PASSWORD_RESET_INIT })

export const sendPasswordResetLink = values => dispatch => {
  dispatch({ type: types.PASSWORD_RESET_LINK_SENDING })

  return Api('POST', PASSWORD_FORGOT_URL, { data: values })
    .then(data => {
      dispatch({ type: types.PASSWORD_RESET_LINK_SENT, message: data.message })
    })
    .catch(err => {
      const error = err.data
      dispatch({ type: types.PASSWORD_RESET_LINK_SENT, error })
    })
}

export const resetPasswordToken = token => dispatch => {
  return Api('GET', PASSWORD_RESET_URL.replace(':token', token))
    .then(data => {
      dispatch({ type: types.PASSWORD_RESET_FORM, message: data.message })
    })
    .catch(err => {
      const error = err.data
      dispatch({ type: types.PASSWORD_RESET_FORM, error })
    })
}

export const resetPassword = values => dispatch => {
  dispatch({ type: types.PASSWORD_RESET_START })

  return Api('POST', PASSWORD_RESET_URL.replace(':token', values.token), { data: values })
    .then(data => {
      dispatch({ type: types.PASSWORD_RESET_END, message: data.message })
      return data
    })
    .catch(err => {
      const error = err.data
      dispatch({ type: types.PASSWORD_RESET_END, error })
    })
}
