import React from 'react'
import {PropTypes} from 'prop-types'
import ViewAllUsers from './ViewAllUsers'
import AddNewUserForm from './AddNewUserForm'
// import SupervisorNewTopic from './SupervisorNewTopic'
import {Card} from 'antd'
import EditCurriculums from './EditCurriculums'

const propTypes = {
  type: PropTypes.string
}

const AdminUsers = (props) => {
  switch (props.type) {
    case 'allusers':
      return <ViewAllUsers/>
    case 'edit-curriculums':
      return (
        <EditCurriculums />
      )
    case 'add-new-user':
      return (
        <Card>
          {/*<AddNewUserForm/>*/}
          <h1>Hello</h1>
        </Card>
      )
    case 'new-topic':
      return (
          <SupervisorNewTopic/>
      )
    default:
      return <h2>Choose something.</h2>
  }
}

AdminUsers.propTypes = propTypes

export default AdminUsers
