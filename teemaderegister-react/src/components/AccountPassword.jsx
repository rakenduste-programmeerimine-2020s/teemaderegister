import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'
import { Row, Col, Form, Input, Button, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'

import { setDocTitle } from '../utils/Helpers'
const FormItem = Form.Item

const { func, object, shape, bool, string } = PropTypes

const propTypes = {
  location: object.isRequired,
  password: shape({
    hasError: bool.isRequired,
    loading: bool.isRequired,
    message: shape({
      text: string,
      type: string
    }),
    error: shape({
      message: string
    }).isRequired
  }).isRequired,
  resetPassword: func.isRequired,
  resetPasswordToken: func.isRequired
}

class AccountPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmDirty: false
    }
    this.checkPassword = this.checkPassword.bind(this)
    this.checkPasswordConfirm = this.checkPasswordConfirm.bind(this)
    this.handleInactiveInput = this.handleInactiveInput.bind(this)
    this.submit = this.submit.bind(this)
    this.formRef = React.createRef()
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    this.is_new = !!params.get('is-new')
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { password } = this.props
    const { message: newMessage, error, loading, hasError } = nextProps.password

    if (newMessage.text !== password.message.text ||
      loading !== password.loading) {
      if (newMessage.text) {
        message[newMessage.type](newMessage.text, 10)
      }
      if (hasError) {
        message.error(error.message, 10)
      }
    }
  }

  UNSAFE_componentWillMount () {
    if (this.is_new) return setDocTitle('Create password')
    setDocTitle('Reset password')
  }

  componentDidMount () {
    this.props.resetPasswordToken()
  }

  handleInactiveInput (e) {
    const { value } = e.target
    const form = this.formRef.current
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })

    if (form.getFieldValue('password-confirm') &&
        form.getFieldValue('password-confirm').length > 0) {
      form.validateFields(['password-confirm'], { force: true })
    }
  }

  checkPassword (rule, value, callback) {
    const form = this.formRef.current
    const formInputValue = form.getFieldValue('password')

    if (value && value !== formInputValue) {
      callback(new Error('Passwords does not match!'))
    }
    callback()
  }

  checkPasswordConfirm (rule, value, callback) {
    const form = this.formRef.current
    if (value && this.state.confirmDirty) {
      form.validateFields(['password-confirm'], { force: true })
    }
    callback()
  }

  submit (values) {
    this.props.resetPassword(values)
    this.formRef.current.resetFields(['password', 'password-confirm'])
  }

  render () {
    const {
      password: { loading }
    } = this.props

    const crumbs = [{ url: this.props.location.pathname, name: 'Password reset' }]

    return (
      <div className='accountPassword width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>{this.is_new ? 'Password create' : 'Password reset'}</h2>
              <FormItem name='password' rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be 8 characters long' },
                { validator: this.checkPasswordConfirm }
              ]}>
                <Input
                  autoFocus
                  prefix={<LockOutlined />}
                  type='password'
                  placeholder='Password'
                  onBlur={this.handleInactiveInput}
                />
              </FormItem>
              <FormItem name='password-confirm' rules={[
                { required: true, message: 'Please confirm your password!' },
                { validator: this.checkPassword }
              ]}>
                <Input
                  prefix={<LockOutlined />}
                  type='password'
                  placeholder='Confirm password'
                  onBlur={this.handleInactiveInput}
                />
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='button--fullWidth'
                  loading={loading}
                >
                  {this.is_new ? 'Create password' : 'Reset password'}
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    )
  }
}

AccountPassword.propTypes = propTypes

export default AccountPassword
