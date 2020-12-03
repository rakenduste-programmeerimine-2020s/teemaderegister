import React from 'react'
import {PropTypes} from 'prop-types'
import AddNewUserForm from './addNewUserForm'
import {Card} from 'antd'
import TopicsView from './TopicsView'

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
    case 'addNewUser':
      return (
        <Card>
          <AddNewUserForm/>
        </Card>
      )
    case 'myTopics':
      return (
        <TopicsView data={[
          {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street'
          },
          {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street'
          }
        ]}/>
      )
    default:
      return (<h2>Choose something.</h2>
      )
  }
}

AdminUsers.propTypes = propTypes

export default AdminUsers
