import React from 'react'
import { PropTypes } from 'prop-types'
import ViewAllUsers from './ViewAllUsers'

const propTypes = {
  type: PropTypes.string
}

const AdminUsers = (props) => {
  switch (props.type) {
    case 'allusers':
      return <ViewAllUsers />
    default:
      return <h2>Choose something.</h2>
  }
}

AdminUsers.propTypes = propTypes

export default AdminUsers
