import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, Typography } from 'antd'

const { TextArea } = Input
const { Text } = Typography

const AdminTos = props => {
  const content = props.content
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    props.getTos()
  })

  const flipEditable = () => setEditable(!editable)
  const save = text => {
    props.saveTos({ content: 'blabla' })
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
        <React.Fragment>
          <TextArea size={'large'} defaultValue={content} />
          <Button type='primary' onClick={save}>{'Save'}</Button>
          <Button type='danger' onClick={flipEditable}></Button>
        </React.Fragment>
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
