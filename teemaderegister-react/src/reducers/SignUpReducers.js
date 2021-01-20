import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  loading: false,
  hasError: false,
  error: {},
  signUpSuccess: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SIGNUP_START:
      return {
        ...state,
        loading: true
      }

    case types.SIGNUP_LOADED:
      return {
        ...state,
        loading: false,
        hasError: !!action.error,
        error: action.error || {},
        signUpSuccess: !action.error
      }

    case types.SIGNUP_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
