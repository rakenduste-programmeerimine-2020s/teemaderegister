import React, { useEffect, useState } from 'react'
import Breadcrumbs from './Breadcrumbs'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import { Row, Col, Form, Input, Button, message, Image, notification } from 'antd'
import { get2factor, createQR, enable, insert } from '../actions/2faActions'
import { connect } from 'react-redux'

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

const Settings2fa = (props) => {
  const [image, setImage] = useState()
  const [enabled, setEnabled] = useState()

  useEffect(() => {
    const getData = async (values) => {
      const { image, enabled } = await props.get2factor(values)
      setImage(image)
      setEnabled(enabled)
    }
    getData()
  }, [image])

  const createQR = async (values) => {
    const response = await props.createQR(values)
    const { error, message, image } = response
    if (error) return notification.error(message)
    notification.success(message)
    setImage(image)
    window.location.reload(false)
  }

  const onFinish = async (values) => {
    const response = await props.enable(values)
    const { message, error } = response
    if (!error) {
      window.location.reload(false)
      return notification.success({ message: message })
    }
    notification.error({ message: message })

  }

  const checkToken = async (values) => {
    const response = await props.insert(values)
    if (response) return notification.success({ message: 'Token is valid' })
    notification.error({ message: 'Token is not valid!' })

  }

  return (
    <div>

      {image ? (
        enabled ? (
          <div>
            <Image src={image} />
            <Form
              name='basic'
              onFinish={checkToken}
            >
              <Form.Item
                label='Token'
                name='token'
                rules={[{ required: true, message: 'Please input your token!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Check
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
            <div>
              <Image src={image} />
              <Form
                name='basic'
                onFinish={onFinish}
              >
                <Form.Item
                  label='Token'
                  name='token'
                  rules={[{ required: true, message: 'Please input your token!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Enable
                </Button>
                </Form.Item>
              </Form>
            </div>
          )
      ) : (
          <div>
            <Button onClick={createQR}>Generate image</Button>
          </div>
        )}
    </div>
  )
}

export default connect(() => {
}, { get2factor, createQR, enable, insert })(Settings2fa)
