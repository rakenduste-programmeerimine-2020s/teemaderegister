import * as types from '../constants/ActionTypes'

const INITIAL_STATE = {
  topics: {
    data: [],
    count: {
      registered: 0,
      available: 0,
      defended: 0,
      all: 0
    },
    query: {}
  },
  supervisors: {
    data: [],
    count: {
      supervised: 0,
      all: 0
    },
    query: {}
  },
  loading: true
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TABLE_COUNT_LOADED: {
      const { topics, supervisors } = action
      return {
        ...state,
        topics: topics ? { ...state.topics, count: topics } : state.topics,
        supervisors: supervisors
          ? { ...state.supervisors, count: supervisors }
          : state.supervisors
      }
    }

    case types.TABLE_START:
      return {
        ...state,
        loading: true
      }

    case types.TABLE_CLEAR: {
      const { params } = action
      return {
        ...state,
        topics:
          params.tab === 'topics'
            ? { ...state.topics, data: [], query: params }
            : state.topics,
        supervisors:
          params.tab === 'supervisors'
            ? { ...state.supervisors, data: [], query: params }
            : state.supervisors,
        loading: false
      }
    }

    case types.TABLE_LOADED: {
      const { topics, supervisors, count, query } = action
      const countObj = {}
      countObj[query.sub] = count
      return {
        ...state,
        loading: false,
        topics:
          query.tab === 'topics'
            ? {
              data: topics,
              query,
              count: Object.assign({ ...state.topics.count }, countObj)
            }
            : state.topics,
        supervisors:
          query.tab === 'supervisors'
            ? {
              data: supervisors,
              query,
              count: Object.assign({ ...state.supervisors.count }, countObj)
            }
            : state.supervisors
      }
    }

    case types.TABLE_INIT:
      return INITIAL_STATE

    default:
      return {
        ...state
      }
  }
}
