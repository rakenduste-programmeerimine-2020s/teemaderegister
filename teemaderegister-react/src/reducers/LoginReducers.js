import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  loading: false,
  hasError: false,
  error: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_START:
      return {
        ...state,
        loading: true
      }

    case types.LOGIN_LOADED:
      return {
        ...state,
        loading: false,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.LOGIN_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
