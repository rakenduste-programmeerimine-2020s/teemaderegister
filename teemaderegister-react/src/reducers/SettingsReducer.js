import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  loading: true,
  user: {
    login: {},
    profile: {},
    updatedAt: ''
  },
  formLoading: {
    picture: false,
    account: false,
    password: false
  },
  error: {},
  message: '',
  hasError: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.USER_SETTINGS_LOADED:
      const { user } = action
      return {
        ...state,
        loading: false,
        user
      }

    case types.USER_SETTINGS_SAVE_START:
      return {
        ...state,
        formLoading: {
          ...state.formLoading,
          account: true
        }
      }

    case types.USER_SETTINGS_SAVE_END:
      return {
        ...state,
        formLoading: {
          ...state.formLoading,
          account: false
        },
        message: action.message,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.USER_PICTURE_SET_START:
      return {
        ...state,
        formLoading: {
          ...state.formLoading,
          picture: true
        }
      }

    case types.USER_PICTURE_SET_END: {
      const { user, error, message } = action

      return {
        ...state,
        user: user
          ? {
            ...state.user,
            profile: {
              ...state.user.profile,
              image: user.profile.image
            },
            updatedAt: user.updatedAt
          }
          : { ...state.user },
        formLoading: {
          ...state.formLoading,
          picture: false
        },
        message: message || INITIAL_STATE.message,
        hasError: !!error,
        error: error || {}
      }
    }

    case types.PASSWORD_CHANGE_START :
      return {
        ...state,
        formLoading: {
          ...state.formLoading,
          password: true
        }
      }

    case types.PASSWORD_CHANGE_END:
      return {
        ...state,
        formLoading: {
          ...state.formLoading,
          password: false
        },
        message: action.message || INITIAL_STATE.message,
        hasError: !!action.error,
        error: action.error || {}
      }

    case types.USER_SETTINGS_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
