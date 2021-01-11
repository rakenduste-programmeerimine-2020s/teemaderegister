import React, {useEffect, useState} from 'react'
import { Table } from 'antd'
import API from '../utils/Api'
import {ADMIN_VIEW_USERS_URL} from '../constants/ApiConstants'

const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName'
  }
]

export default function ViewAllUsers () {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    API('GET', ADMIN_VIEW_USERS_URL)
      .then(res => {
        const userInfo = res.map((userData) => ({
          key: userData._id,
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName
        }))
        setUsers(userInfo)
        setIsLoading(false)
      })
  }, [])

  return <Table dataSource={users} columns={columns} loading={isLoading}/>
}
