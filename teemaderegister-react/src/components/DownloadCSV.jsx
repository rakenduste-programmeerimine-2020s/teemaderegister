import React from 'react'
import { getCsvData } from '../actions/CsvActions'
import { Button } from 'antd'

const getCSV = (props) => {
  let buttonVisibility = true

  props.curriculum !== undefined ? buttonVisibility = true : buttonVisibility = false

  const sendCurriculumInfo = () => {
    getCsvData(props.activeSub, props.curriculum.meta._id)
  }

  return (
    <div style={{float: 'right', visibility: (buttonVisibility ? 'visible' : 'hidden')}}>
      <Button onClick={sendCurriculumInfo}>Export CSV</Button>
    </div>
  )
}

export default getCSV
