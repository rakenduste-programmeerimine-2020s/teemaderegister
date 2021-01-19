import React, {useEffect, useState} from 'react'
import { Table } from 'antd'
import API from '../utils/Api'
import {ADMIN_VIEW_USERS_URL} from '../constants/ApiConstants'

const columns = [
  {
    title: 'First Name',
    dataIndex: ['profile', 'firstName'],
    key: 'firstName'
  },
  {
    title: 'Last Name',
    dataIndex: ['profile', 'lastName'],
    key: 'lastName'

  }
]

export default function ViewAllUsers () {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    API('GET', ADMIN_VIEW_USERS_URL)
      .then(res => {
        setUsers(res)
        setIsLoading(false)
      })
  }, [])

  return <Table dataSource={users} columns={columns} loading={isLoading} rowKey={r => r._id}/>
}
