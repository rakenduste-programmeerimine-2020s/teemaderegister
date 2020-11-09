import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  message: {
    text: '',
    type: 'success' // or info
  },
  loading: false,
  hasError: false,
  error: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PASSWORD_RESET_LINK_SENDING:
      return {
        ...INITIAL_STATE,
        loading: true
      }

    case types.PASSWORD_RESET_LINK_SENT:
      return {
        message: {
          ...state.message,
          text: action.message
        },
        loading: false,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.PASSWORD_RESET_START:
      return {
        ...INITIAL_STATE,
        loading: true
      }

    case types.PASSWORD_RESET_FORM:
      return {
        message: {
          ...state.message,
          text: action.message,
          type: 'info'
        },
        loading: false,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.PASSWORD_RESET_END:
      return {
        message: {
          ...state.message,
          text: action.message
        },
        loading: false,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.PASSWORD_RESET_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
