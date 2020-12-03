import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  content: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TOS_LOADED:
      const { content } = action
      return {
        ...state,
        content
      }

    case types.TOS_SAVED: {
      return {
        ...state
      }
    }
  }
}
