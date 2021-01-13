import React, {useEffect, useState} from 'react'
// eslint-disable-next-line standard/object-curly-even-spacing
import {Button, Form, Input, notification, Select} from 'antd'
import {adminAddNewUser} from '../actions/AdminActions'
import {connect} from 'react-redux'
import {setDocTitle} from '../utils/Helpers'

const {Option} = Select

const AddNewUserForm = (props) => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const roles = [
    'admin',
    'curriculum-manager',
    'head-of-study',
    'student',
    'study-assistant',
    'supervisor'
  ]

  useEffect(() => {
    setDocTitle('Add new user')
  }, [])

  const onFinish = async (values) => {
    setIsLoading(true)
    // eslint-disable-next-line react/prop-types
    const response = await props.adminAddNewUser(values)
    const {message, success} = response

    if (success === 1) {
      notification.success({message: message})
      form.resetFields()
    } else {
      notification.error({message: message})
    }
    setIsLoading(false)
  }

  function onFinishFailed () {
    notification.error({
      message: 'Please input values!'
    })
  }

  return (
    <Form
      form={form}
      name={'AddNewUserForm'}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{span: 3}}
      wrapperCol={{span: 14}}
    >
      <Form.Item label='Name' style={{marginBottom: 0}}>
        <Input.Group compact>
          <Form.Item
            name={'firstName'}
            rules={[{required: true, message: 'Please input first name!'}]}
          >
            <Input placeholder={'First Name'}/>
          </Form.Item>

          <Form.Item
            name={'lastName'}
            rules={[{required: true, message: 'Please input last name!'}]}
          >
            <Input placeholder={'Last Name'}/>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        label={'Email'}
        name={'email'}
        rules={[
          {required: true, message: 'Please enter correct email!', type: 'email'}
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={'Role'}
        name={'role'}
        rules={[{required: true, message: 'Please input role!'}]}
      >
        <Select
          mode='multiple'
          allowClear
          style={{width: '100%'}}
          placeholder='Please select new user roles'
        >
          {roles.map((value) => {
            return <Option key={value}>{value}</Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item name={'submit'}>
        <Button type='primary' htmlType='submit' loading={isLoading}>
            Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default connect(() => {
}, {adminAddNewUser})(AddNewUserForm)
