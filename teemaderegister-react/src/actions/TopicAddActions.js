import * as types from '../constants/ActionTypes'
import Api from '../utils/Api'

import {
  TOPICS_URL,
} from '../constants/ApiConstants'

export const initTopic = () => dispatch => {
  dispatch({ type: types.TOPIC_INIT })
}

export const triggerAddTopic = (values) => dispatch => {
  dispatch({ type: types.TOPCIS_ADD_START })

  return Api('POST', TOPICS_URL, { data: values })
    .then(data => {
      const { topic } = data
      dispatch({ type: types.TOPICS_ADD_END, topic })
    }).catch(err => {
      const error = err.data
      dispatch({ type: types.TOPICS_ADD_END, error })
    })
}
