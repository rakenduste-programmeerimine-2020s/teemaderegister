import Api from '../utils/Api'
import {USER_FACTOR, USER_FACTOR_ENABLE, USER_FACTOR_INSERT, USER_FACTOR_DISABLE} from '../constants/ApiConstants'

export const get2factor = userData => {
  return async () => {
    try {
      return await Api('GET', USER_FACTOR, userData)
    } catch (err) {
      return err.data
    }
  }
}

export const createQR = userData => {
  return async () => {
    try {
      return await Api('POST', USER_FACTOR, userData)
    } catch (err) {
      return err.data
    }
  }
}

export const enable = userData => {
  return async () => {
    try {
      return await Api('POST', USER_FACTOR_ENABLE, {data: userData})
    } catch (err) {
      return err.data
    }
  }
}

export const disable = userData => {
  return async () => {
    try {
      return await Api('POST', USER_FACTOR_DISABLE, {data: userData})
    } catch (err) {
      return err.data
    }
  }
}

export const insert = userData => {
  return async () => {
    try {
      console.log(userData)
      return await Api('POST', USER_FACTOR_INSERT, {data: userData})
    } catch (err) {
      return err.data
    }
  }
}
