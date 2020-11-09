import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  curriculums: [],
  loading: true
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CURRICULUMS_LOADED: {
      const { curriculums } = action
      return {
        ...state,
        curriculums,
        loading: false
      }
    }

    default:
      return {
        ...state
      }
  }
}
