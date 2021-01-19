import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  data: {},
  count: {},
  loading: true
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SUPERVISOR_LOADED: {
      const { supervisor, counts } = action
      return {
        ...state,
        data: supervisor,
        count: counts,
        loading: false
      }
    }

    case types.SUPERVISOR_NOT_FOUND: {
      return {
        ...state,
        error: true,
        message: action.message
      }
    }

    case types.SUPERVISOR_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
