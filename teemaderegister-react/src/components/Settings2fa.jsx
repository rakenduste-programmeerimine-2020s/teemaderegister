import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button, Image, notification } from 'antd'
import { get2factor, createQR, enable, insert, disable } from '../actions/2faActions'
import { connect } from 'react-redux'

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
  const onClose = async (values) => {
    const response = await props.disable(values)
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
          <Row gutter={8}>
            <Col span={8} />
            <Col xs={24} sm={8}>
              <div  >
                <Image src={image} />
                <Form
                  name='basic'
                  onFinish={checkToken}
                >
                  <Form.Item
                    label='Token'
                    name='token'
                    style={{ width: 200, margin: '0 10px' }}
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

                <Form
                  name='basic'
                  onFinish={onClose}
                >
                  <Form.Item
                    label='Token'
                    name='token'
                    style={{ width: 200, margin: '0 10px' }}
                    rules={[{ required: true, message: 'Please input your token!' }]}
                  >
                    <Input
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type='primary' htmlType='submit'>
                      Disable
                </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
            <Col span={8} />
          </Row>
        ) : (
            <Row gutter={8}>
              <Col span={8} />
              <Col xs={24} sm={8}>
                <div>
                  <Image src={image} />
                  <Form
                    name='basic'
                    onFinish={onFinish}
                  >
                    <Form.Item
                      label='Token'
                      name='token'
                      style={{ width: 200, margin: '0 10px' }}
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
              </Col>
              <Col span={8} />
            </Row >
          )
      ) : (
          <Row gutter={8}>
            <Col span={8} />
            <Col xs={24} sm={8}>
              <div>
                <Button onClick={createQR}>Generate QR for 2fa</Button>
              </div>
            </Col>
            <Col span={8} />
          </Row>
        )}
    </div>
  )
}

export default connect(() => {
}, { get2factor, createQR, enable, insert, disable })(Settings2fa)
