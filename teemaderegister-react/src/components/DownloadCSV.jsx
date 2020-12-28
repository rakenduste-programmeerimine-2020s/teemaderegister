import React from 'react'
import { getCsvData } from '../actions/CsvActions'
import { Button } from 'antd'

const getCSV = (props) => {
  const sendCurriculumInfo = () => {
    getCsvData(props.activeSub, props.curriculum.meta._id)
  }

  return (
    <div style={{float: 'right'}}>
      <Button onClick={sendCurriculumInfo}>Export CSV</Button>
    </div>
  )
}

export default getCSV
