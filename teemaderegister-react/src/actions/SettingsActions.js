import Api from '../utils/Api'
import * as types from '../constants/ActionTypes'
import { checkUser } from './AuthActions'

import {
  USER_PROFILE_URL,
  USER_UPDATE_PROFILE_URL,
  USER_UPDATE_PASSWORD_URL,
  USER_PICTURE_RESET_URL
} from '../constants/ApiConstants'

export const initSettings = () => dispatch =>
  dispatch({ type: types.USER_SETTINGS_INIT })

export const getProfile = () => dispatch => {
  return Api('GET', USER_PROFILE_URL)
    .then(data => {
      const { user } = data
      dispatch({ type: types.USER_SETTINGS_LOADED, user })
    })
    .catch(err => {
      console.log(err)
    })
}

export const updateProfile = user => dispatch => {
  dispatch({ type: types.USER_SETTINGS_SAVE_START })

  return Api('PUT', USER_UPDATE_PROFILE_URL, { data: user })
    .then(data => {
      const { message } = data
      dispatch({ type: types.USER_SETTINGS_SAVE_END, message })
      dispatch(checkUser())
    }).catch(err => {
      const error = err.data
      console.log(error)
      dispatch({ type: types.USER_SETTINGS_SAVE_END, error })
    })
}

export const uploadPictureStart = () => dispatch => {
  dispatch({ type: types.USER_PICTURE_SET_START })
}

export const uploadPictureEnd = ({ user, message }) => dispatch => {
  dispatch({ type: types.USER_PICTURE_SET_END, user, message })
  dispatch(checkUser())
}

export const uploadPictureError = (error) => dispatch => {
  console.log(error)
  dispatch({ type: types.USER_PICTURE_SET_END, error })
}

export const resetPicture = () => dispatch => {
  dispatch({ type: types.USER_PICTURE_SET_START })

  return Api('PUT', USER_PICTURE_RESET_URL)
    .then(data => {
      const { user, message } = data
      dispatch({ type: types.USER_PICTURE_SET_END, user, message })
      dispatch(checkUser())
    }).catch(err => {
      const error = err.data
      console.log(error)
      dispatch({ type: types.USER_PICTURE_SET_END, error })
    })
}

export const changePassword = user => dispatch => {
  dispatch({ type: types.PASSWORD_CHANGE_START })

  return Api('PUT', USER_UPDATE_PASSWORD_URL, { data: user })
    .then(data => {
      const { message } = data
      dispatch({ type: types.PASSWORD_CHANGE_END, message })
    }).catch(err => {
      const error = err.data
      console.log(error)
      dispatch({ type: types.PASSWORD_CHANGE_END, error })
    })
}
