import React from 'react'
import { PropTypes } from 'prop-types'

const propTypes = {
  type: PropTypes.string
}

const AdminUsers = props => {
  switch (props.type) {
    case 'supervisor':
      return (
        <h2>Registered supervisors</h2>
      )
    case 'students':
      return (
        <h2>Registered students</h2>
      )
    default:
      return (<h2>Choose something.</h2>
      )
  }
}

AdminUsers.propTypes = propTypes

export default AdminUsers
