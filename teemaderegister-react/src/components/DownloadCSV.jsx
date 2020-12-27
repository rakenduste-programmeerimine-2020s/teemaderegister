import React from 'react'
import { getData } from '../actions/CsvActions'
import { Button } from 'antd';
const getCSV = (props) => {

  const sendCurriculumInfo = () => {
    console.log(props.curriculum.meta.type)
    getData(props.activeSub, props.curriculum.meta._id, props.curriculum.meta.type)
  }

  return (
    <div style={{float: 'right'}}>
      <Button onClick={sendCurriculumInfo}>Export CSV</Button>
    </div>
  )
}

export default getCSV