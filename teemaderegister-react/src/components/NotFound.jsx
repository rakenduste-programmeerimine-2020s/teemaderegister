import React from 'react'
import { setDocTitle } from '../utils/Helpers'
import {Button, Result} from 'antd'

const NotFound = () => {
  setDocTitle('Not Found')

  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={<Button type='primary'>Back Home</Button>}
    />
  )
}

export default NotFound
