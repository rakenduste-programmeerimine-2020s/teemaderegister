import React, {useState} from 'react'
// eslint-disable-next-line standard/object-curly-even-spacing
import {Button, Form, Input, notification, Select} from 'antd'
import {adminAddNewUser, initAddNewUser} from '../actions/AdminActions'
import {connect} from 'react-redux'

const {Option} = Select

const AddNewUserForm = (props) => {
  const [form] = Form.useForm()
  const [isLoading, setisLoading] = useState(false)
  const roles = [
    'admin',
    'curriculum-manager',
    'head-of-study',
    'student',
    'study-assistant',
    'supervisor'
  ]

  const onFinish = async (values) => {
    // show user loading
    setisLoading(true)
    // eslint-disable-next-line react/prop-types
    await props.initAddNewUser()
    // eslint-disable-next-line react/prop-types
    const response = await props.adminAddNewUser(values)
    console.log(response)
    const {message, success} = response
    if (success === 1) {
      notification.success({message: message})
      form.resetFields()
    } else {
      notification.error({message: message})
    }
    setisLoading(false)
  }

  // eslint-disable-next-line handle-callback-err
  function onFinishFailed (error) {
    console.log(error)
    notification.error({
      message: 'Please input values!'
    })
  }

  function handleChange (values) {
    console.log(`selected roles: ${values}`)
  }

  return (
    <Form
      form={form}
      name={'addNewUserForm'}
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
          {required: true, message: 'Please input email!', type: 'email'}
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
          onChange={handleChange}
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
}, {initAddNewUser, adminAddNewUser})(AddNewUserForm)
