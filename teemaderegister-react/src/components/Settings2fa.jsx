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
    <div className='settings2fa'>

      {image ? (
        enabled ? (
          <Row gutter={8}>
            <Col span={8} />
            <Col xs={24} sm={8}>
              <div >
                <Image src={image} />
                <Form
                  name='basic'
                  onFinish={onClose}
                >
                  <h2 >Currently the 2FA is Enabled</h2>
                  <h3 >Insert the QR token and press Disable to deactivate 2fa</h3>
                  <Form.Item
                    label='Token'
                    name='token'
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
                <h2 >Currently the 2FA is Disabled</h2>
                <h3 >Insert the QR token and press enable to activate 2fa</h3>
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
            </Col>
            <Col span={8} />
          </Row >
        )
      ) : (
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <div className='generatorQR'>
              <Form.Item>
                <h2 className='text-align--center'>It seems you haven't setup any 2FA</h2>
                <Button onClick={createQR}>Generate QR for 2fa</Button>
              </Form.Item>
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
