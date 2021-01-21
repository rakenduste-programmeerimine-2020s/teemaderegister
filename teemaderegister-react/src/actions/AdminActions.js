import Api from '../utils/Api'

import { ADMIN_ADD_NEW_USER } from '../constants/ApiConstants'

export const adminAddNewUser = userData => {
  return async () => {
    try {
      return await Api('POST', ADMIN_ADD_NEW_USER, { data: userData })
    } catch (err) {
      return err.data
    }
  }
}
