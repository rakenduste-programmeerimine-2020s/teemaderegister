import React from 'react'
import { Button } from 'antd'

const addTopic = (props) => {
  let buttonVisibility = true

  props.curriculum !== undefined ? buttonVisibility = true : buttonVisibility = false

  const openTopicAdd = () => {

  }

  return (
    <div style={{ float: 'right', visibility: (buttonVisibility ? 'visible' : 'hidden') }}>
      <Link to='/topic/add'>
        <Button onClick={openTopicAdd}>Add Topic</Button>
      </Link>
    </div>
  )
}

export default addTopic