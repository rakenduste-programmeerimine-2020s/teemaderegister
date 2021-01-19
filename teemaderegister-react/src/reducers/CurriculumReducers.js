import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  meta: {},
  loading: true,
  form: {
    loading: false,
    curriculum: {},
    hasError: false,
    error: {}
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CURRICULUM_LOADED: {
      const { meta } = action
      return {
        ...state,
        meta,
        loading: false
      }
    }

    case types.CURRICULUM_ADD_START:
      return {
        ...state,
        form: {
          ...state.form,
          loading: true
        }
      }

    case types.CURRICULUM_NOT_FOUND:
      return {
        ...state,
        error: true,
        message: action.message
      }

    case types.CURRICULUM_ADD_END: {
      const { curriculum, error } = action
      return {
        ...state,
        form: {
          loading: false,
          curriculum: curriculum || {},
          hasError: !!error,
          error: error || {}
        }

      }
    }

    case types.CURRICULUM_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
