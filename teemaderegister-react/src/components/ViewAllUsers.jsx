import React, { useEffect, useState, Component } from 'react'
import { Layout, Table } from 'antd'

const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
]

function ViewAllUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUserData = async () => {
      var jwt = localStorage.getItem('jwtToken')
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + jwt,
        },
      })
      const jsonData = await response.json()
      const userInfo = jsonData.map((userData, i) => ({
        key: i,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }))
      return userInfo
    }
    getUserData().then(setUsers)
  }, [])

  return <Table dataSource={users} columns={columns} />
}

export default ViewAllUsers
