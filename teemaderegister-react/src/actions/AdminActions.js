import Api from '../utils/Api'

import {ADMIN_ADD_NEW_USER, ADMIN_GET_CURRICULUMS, ADMIN_GET_USERS} from '../constants/ApiConstants'

export const adminAddNewUser = userData => {
  return async () => {
    try {
      return await Api('POST', ADMIN_ADD_NEW_USER, { data: userData })
    } catch (err) {
      return err.data
    }
  }
}

export const getCurriculums = () => {
  return async () => {
    try {
      return await Api('GET', ADMIN_GET_CURRICULUMS)
    } catch (err) {
      return err.data
    }
  }
}

export const getUsers = () => {
  return async () => {
    try {
      return await Api('GET', ADMIN_GET_USERS)
    } catch (err) {
      return err.data
    }
  }
}

export const UpdateCurriculum = userData => {
  return async () => {
    try {
      return await Api('PUT', ADMIN_GET_CURRICULUMS, { data: userData })
    } catch (err) {
      return err.data
    }
  }
}
