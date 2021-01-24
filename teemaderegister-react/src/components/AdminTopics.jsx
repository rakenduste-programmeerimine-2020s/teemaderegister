import React from 'react'
import { PropTypes } from 'prop-types'
import TopicTable from './TopicTable'
import SupervisorNewTopic from './SupervisorNewTopic'

const propTypes = {
  type: PropTypes.string
}

const AdminTopics = props => {
  switch (props.type) {
    case 'registered':
      return (
        <TopicTable title={'registered'} />
      )
    case 'available':
      return (
        <TopicTable title={'available'} />
      )
    case 'defended':
      return (
        <TopicTable title={'defended'} />
      )
    case 'newTopic':
      return (
        <SupervisorNewTopic/>
      )
    default:
      return (<h2>Choose something.</h2>
      )
  }
}

AdminTopics.propTypes = propTypes

export default AdminTopics
