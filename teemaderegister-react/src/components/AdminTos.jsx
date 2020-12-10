import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, Typography, Form } from 'antd'

const { TextArea } = Input
const { Text } = Typography

const AdminTos = props => {
  const content = props.content
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    props.getTos()
  })

  const flipEditable = () => setEditable(!editable)
  const onFinish = values => {
    props.saveTos({ content: values.textInput })
    flipEditable()
  }

  return (
    <React.Fragment>
      {!editable &&
        <React.Fragment>
          <Text>{content}</Text>
          <Button
            type='primary'
            onClick={flipEditable}
          >
            {'Edit'}
          </Button>
        </React.Fragment>
      }
      {editable &&
        <Form onFinish={onFinish}>
          <Form.Item name={'textInput'} label={'Terms of Service'}>
            <TextArea size={'large'} defaultValue={content} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>{'Save'}</Button>
          </Form.Item>

          <Button type='danger' onClick={flipEditable}>Cancel</Button>
        </Form>
      }
    </React.Fragment>
  )
}

AdminTos.propTypes = {
  content: PropTypes.string,
  getTos: PropTypes.func.isRequired,
  saveTos: PropTypes.func.isRequired
}

export default AdminTos
