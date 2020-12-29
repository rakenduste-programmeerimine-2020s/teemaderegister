import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import { Row, Col, Form, Input, Button, message, Image } from 'antd'

const FormItem = Form.Item

const { func, object, shape, bool, string } = PropTypes

const propTypes = {
  get: func.isRequired,
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

class Settings2fa extends React.Component {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  componentWillUnmount() {
    this.props.initSettings()
  }

  render() {
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

        <Image
          width={200}
          src="data:image/png;base64,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"
        />

        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} className='login__form'>
              <FormItem label='Authenticator number' name='authenticatorNumber' rules={[
                { required: true, message: 'Вставьте номера аутентификатора' }
              ]}>
                <Input type='int' />
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

Settings2fa.propTypes = propTypes

export default Settings2fa