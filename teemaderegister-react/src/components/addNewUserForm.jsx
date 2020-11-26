import React from 'react'
import {Button, Form, Input, notification,  Select } from 'antd'

const {Option} = Select;

const AddNewUserForm = () => {
    const roles = ["admin", "curriculum-manager", "head-of-study", "student", "study-assistant", "supervisor"]

    function onFinish(values) {
        console.log(values);
        notification.success({
            message: 'Creating user was successful!'
        })
    }

    function onFinishFailed(error) {
        notification.error({
            message: 'Please input values!'
        })
    }

    function handleChange(value) {
        console.log(`selected ${value}`);
    }

    return (
        <Form
            name={'addNewUserForm'}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 14 }}>
            <Form.Item label="Name" style={{ marginBottom: 0 }}>
            <Input.Group compact>
              <Form.Item
                  name={'firstName'}
                  rules={[{required: true, message: 'Please input first name!'}]}>
                  
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
                rules={[{required: true, message: 'Please input email!', type: 'email'}]}>
                <Input/>
            </Form.Item>

            <Form.Item
                label={'Role'}
                name={'role'}
                rules={[{required: true, message: 'Please input role!'}]}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: '100%'}}
                    placeholder="Please select new user roles"
                    onChange={handleChange}
                >
                    {roles.map((value) => {
                        return <Option key={value}>{value}</Option>
                    })}
                </Select>
            </Form.Item>

            <Form.Item
                name={'submit'}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default AddNewUserForm
