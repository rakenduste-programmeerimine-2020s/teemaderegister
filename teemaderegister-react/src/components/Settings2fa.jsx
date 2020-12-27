import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Row, Col, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

const { func, object, shape, bool, string } = PropTypes

const propTypes = {
  initSettings: func.isRequired,
  location: object.isRequired,
  settings: shape({
    error: shape({
      message: string
    }).isRequired,
    hasError: bool.isRequired,
    message: string.isRequired,
    formLoading: shape({
      password: bool.isRequired
    }).isRequired
  }).isRequired
}

class SettingsPassword extends React.Component {
  constructor (props) {
    super(props)

    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { settings } = this.props
    const {
      form: { resetFields },
      settings: {
        message: newMessage,
        error,
        formLoading,
        hasError
      }
    } = nextProps

    if (!formLoading.password && formLoading.password !== settings.formLoading.password) {
      if (hasError) {
        message.error(error.message, 2)
      }
      if (newMessage) {
        message.success(newMessage, 2)
        resetFields()
      }
    }
  }

  componentWillUnmount () {
    this.props.initSettings()
  }

  render () {
    const crumbs = [
      { url: '/settings/account', name: 'Settings' },
      { url: null, name: 'Enable 2FA' }
    ]

    const {
      settings: { formLoading }
    } = this.props

    return (
      <div className='settingsPassword width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} className='login__form'>
              <FormItem label='Current Password' name='currentPassword' rules={[
                { required: true, message: 'Please enter your current password' }
              ]}>
                <Input type='password'/>
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='button--fullWidth'
                  loading={formLoading.password}
                >
                  Confirm Password
                </Button>
              </FormItem>
              <FormItem>
                <Button type='default' className='button--fullWidth'>
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

SettingsPassword.propTypes = propTypes

export default SettingsPassword