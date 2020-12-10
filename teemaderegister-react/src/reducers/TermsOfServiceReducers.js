import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  content: '',
  contentLastUpdated: '0'
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TOS_LOADED:
      console.log({ c: action.content, u: action.updatedAt })
      const { content, updatedAt } = action
      return {
        ...state,
        content,
        contentLastUpdated: updatedAt
      }
    default:
      return {
        ...state
      }
  }
}
