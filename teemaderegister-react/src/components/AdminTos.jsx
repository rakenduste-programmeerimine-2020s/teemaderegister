import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, Typography, Form, Layout, Space } from 'antd'

const { TextArea } = Input
const { Title, Paragraph } = Typography

const { Content } = Layout

const AdminTos = props => {
  const [editable, setEditable] = useState(false)
  const [content, setContent] = useState(props.content)

  useEffect(() => {
    props.getTos()
  }, [])

  const flipEditable = () => setEditable(!editable)
  const onFinish = values => {
    setContent(values.textInput)
    props.saveTos({ content: values.textInput })
    flipEditable()
  }

  const displayContent = (
    <Content>
      <Paragraph>{content}</Paragraph>
      <Button
        type='primary'
        onClick={flipEditable}
      >
        {'Edit'}
      </Button>
    </Content>
  )

  const editForm = (
    <Form onFinish={onFinish} initialValues={{ 'textInput': content, 'innerTextInput': content }}>
      <Form.Item name={'textInput'}>
        <TextArea name={'innerTextInput'} size={'large'} autoSize={true} />
      </Form.Item>
      <Space>
        <Form.Item>
          <Button type='primary' htmlType='submit'>{'Save'}</Button>
        </Form.Item>
        <Form.Item>
          <Button type='danger' htmlType='reset' onClick={flipEditable}>Cancel</Button>
        </Form.Item>
      </Space>
    </Form>
  )

  return (
    <Layout className='layout termsOfService width--public-page'>
      <Space direction='vertical' align='center'>
        <Title>{'Teemaderegister Terms of Service'}</Title>
      </Space>
      {editable ? editForm : displayContent}
    </Layout>
  )
}

AdminTos.propTypes = {
  content: PropTypes.string,
  getTos: PropTypes.func.isRequired,
  saveTos: PropTypes.func.isRequired
}

export default AdminTos
