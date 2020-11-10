import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'
import { Row, Col, Form, Input, Button, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { setDocTitle } from '../utils/Helpers'
const FormItem = Form.Item

const { func, object, shape, bool, string } = PropTypes

const propTypes = {
  initPasswordReset: func.isRequired,
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
  sendPasswordResetLink: func.isRequired
}

class AccountForgot extends React.Component {
  constructor (props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { password } = this.props
    const { message: newMessage, hasError, loading, error } = nextProps.password

    if (newMessage.text !== password.message.text ||
      loading !== password.loading) {
      if (newMessage.text) {
        message[newMessage.type](newMessage.text, 10)
      }
      if (hasError) {
        message.error(error.message)
      }
    }
  }

  UNSAFE_componentWillMount () {
    this.props.initPasswordReset()

    setDocTitle('Request password reset')
  }

  submit (values) {
    this.props.sendPasswordResetLink(values)
  }

  render () {
    const {
      password: { loading }
    } = this.props

    const crumbs = [{ url: this.props.location.pathname, name: 'Request password reset' }]

    return (
      <div className='accountForgot width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.ref} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>Request password reset</h2>
              <FormItem name='email' rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter correct email' }
              ]} >
                <Input autoFocus prefix={<UserOutlined />} placeholder='Email' />
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='button--fullWidth'
                  loading={loading}
                >
                  Send password reset link
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

AccountForgot.propTypes = propTypes

export default AccountForgot
