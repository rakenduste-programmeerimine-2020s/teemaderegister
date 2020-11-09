import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  q: '',
  loading: true
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SEARCH_START:
      return {
        ...state,
        loading: true
      }

    case types.SEARCH_SET: {
      const { q } = action
      return {
        ...state,
        q
      }
    }

    case types.SEARCH_LOADED: {
      const { q } = action
      return {
        ...state,
        q,
        loading: false
      }
    }

    case types.SEARCH_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
