import React from 'react'
import {PropTypes} from 'prop-types'
import ViewAllUsers from './ViewAllUsers'
import AddNewUserForm from './AddNewUserForm'
import {Card} from 'antd'

const propTypes = {
  type: PropTypes.string
}

const AdminUsers = (props) => {
  switch (props.type) {
    case 'allusers':
      return <ViewAllUsers/>
    case 'add-new-user':
      return (
        <Card>
          <AddNewUserForm/>
        </Card>
      )
    default:
      return <h2>Choose something.</h2>
  }
}

AdminUsers.propTypes = propTypes

export default AdminUsers
