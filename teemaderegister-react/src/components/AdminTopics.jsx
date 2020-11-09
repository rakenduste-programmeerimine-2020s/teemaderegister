import React from 'react'
import { PropTypes } from 'prop-types'

const propTypes = {
  type: PropTypes.string
}

const AdminTopics = props => {
  switch (props.type) {
    case 'registered':
      return (
        <h2>Registered topics</h2>
      )
    case 'available':
      return (
        <h2>Available topics</h2>
      )
    case 'defended':
      return (
        <h2>Defended topics</h2>
      )
    default:
      return (<h2>Choose something.</h2>
      )
  }
}

AdminTopics.propTypes = propTypes

export default AdminTopics
