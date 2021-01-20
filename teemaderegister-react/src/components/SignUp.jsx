import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'
import { setDocTitle } from '../utils/Helpers'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

const FormItem = Form.Item

const { func, object, shape, bool, string } = PropTypes

const propTypes = {
  initSignUp: func.isRequired,
  location: object.isRequired,
  signup: shape({
    hasError: bool.isRequired,
    error: shape({
      message: string
    }).isRequired,
    signUpSuccess: bool.isRequired
  }).isRequired,
  triggerSignUp: func.isRequired
}

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.signup.hasError) {
      message.error(nextProps.signup.error.message)
      this.componentWillUnmount()
    }
  }

  componentDidMount () {
    setDocTitle('SignUp')
  }

  componentWillUnmount () {
    this.props.initSignUp()
  }

  submit (values) {
    const roles = { roles: ['student'] }
    const result = { ...values, ...roles }
    window.setTimeout(() => {
      this.props.triggerSignUp(result).then((response) => {
        if (response) {
          this.formRef.current.resetFields()
          message.success('Account created, you can now log in')
        }
      })
    }, 1500)
  }

  render () {
    const crumbs = [{ url: this.props.location.pathname, name: 'Sign Up' }]
    return (
      <div className = 'signup width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>
                Sign up to <span className='emphisize'>Te</span>
              </h2>
              <FormItem name='firstName' className='name' rules={[
                { required: true, message: 'Please input your name!' }
              ]}>
                <Input
                  autoFocus
                  prefix={<UserOutlined />}
                  type='name'
                  placeholder='First name'
                />
              </FormItem>
              <FormItem name='lastName' className='name' rules={[
                { required: true, message: 'Please input your name!' }
              ]}>
                <Input
                  prefix={<UserOutlined />}
                  type='name'
                  placeholder='Last name'
                />
              </FormItem>
              <FormItem name='email' rules={[
                { required: true, message: 'Please input your email!' }
              ]}>
                <Input prefix={<MailOutlined />} placeholder='Email' />
              </FormItem>
              <FormItem name='password' className='signup__password' rules={[
                { required: true, message: 'Please input your password!' },
                { pattern: /(?=.*\d)/, message: 'Password must contain at least one number' },
                { pattern: /(?=.*[A-Z])/, message: 'Password must contain at least one uppercase letter' },
                { min: 8, message: 'Passwords must be at least 8 characters long' }
              ]}>
                <Input
                  prefix={<LockOutlined />}
                  type='password'
                  placeholder='Password'
                />
              </FormItem>
              <Checkbox required>I have read and agree to the
                <Link to='/tos' target='_blank'>
                  &nbsp;Terms of service
                </Link>
              </Checkbox>
              <Button
                type='primary'
                htmlType='submit'
                className='button--fullWidth'
              >
              Submit
              </Button>
            </Form>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    )
  }
}

SignUp.propTypes = propTypes

export default SignUp
