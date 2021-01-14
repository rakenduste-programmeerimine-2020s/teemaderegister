import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Redirect, Link } from 'react-router-dom'
import { getToken } from '../utils/jwt'
import Breadcrumbs from './Breadcrumbs'
import { Row, Col, Form, Input, Button, message, Tooltip } from 'antd'
import { UserOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons'
import { setDocTitle } from '../utils/Helpers'

const FormItem = Form.Item

const { bool, func, object, shape, string } = PropTypes

const propTypes = {
  initLogin: func.isRequired,
  location: object.isRequired,
  login: shape({
    hasError: bool.isRequired,
    loading: bool.isRequired,
    error: shape({
      message: string
    }).isRequired
  }).isRequired,
  triggerLogin: func.isRequired
}

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: props.login.loading,
      factoryEnabled: false
    }
    this.submit = this.submit.bind(this)
    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.login.loading !== this.state.loading) {
      this.setState({ loading: nextProps.login.loading })
      if (nextProps.login.hasError) {
        if (nextProps.login.error.message === 'Please insert token!') {
          this.setState({factoryEnabled: true})
        }
        message.error(nextProps.login.error.message)
      }
    }
  }

  componentDidMount () {
    setDocTitle('Login')
  }

  componentWillUnmount () {
    this.props.initLogin()
  }

  submit (values) {
    this.setState({ loading: true })
    // show user loading
    window.setTimeout(() => {
      this.props.triggerLogin(values)
    }, 1500)
  }

  render () {
    const {
      location: { search }
    } = this.props

    const { loading } = this.state

    const params = queryString.parse(search)
    const redirect = params.redirect || '/'

    const crumbs = [{ url: this.props.location.pathname, name: 'Sign In' }]

    if (getToken()) {
      return <Redirect to={redirect} />
    }

    return (
      <div className='login width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>
                Sign in to <span className='emphisize'>Te</span>
              </h2>
              <FormItem name='email' rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter correct email' }
              ]}>
                <Input autoFocus prefix={<UserOutlined />} placeholder='Email' />
              </FormItem>
              <FormItem className='login__password'>
                <FormItem name='password' rules={[
                  { required: true, message: 'Please input your Password!' }
                ]} noStyle>
                  <Input
                    prefix={<LockOutlined />}
                    type='password'
                    placeholder='Password'
                  />
                </FormItem>
                <p className='login__forgot' ><Link to='/account/forgot'>Forgot password?</Link></p>
              </FormItem>
              {
                this.state.factoryEnabled ? (
                  <FormItem name='token'>
                    <Input prefix={<BulbOutlined />} placeholder='Token' />
                  </FormItem>
                ) : (
                  <div>

                  </div>
                )
              }
              <FormItem>
                <FormItem noStyle>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='button--fullWidth'
                    loading={loading}
                  >
                    Log in
                  </Button>
                </FormItem>
                <p>
                  <Tooltip
                    placement='topLeft'
                    title='If you do not have account please contact your school administrator'
                  >
                    <span>do not have account?</span>
                  </Tooltip>
                </p>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    )
  }
}

Login.propTypes = propTypes

export default Login
