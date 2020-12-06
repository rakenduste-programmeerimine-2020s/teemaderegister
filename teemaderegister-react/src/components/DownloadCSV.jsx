import React from 'react'
import axios from 'axios'
import { getData } from '../actions/CsvActions'
const getCSV = (props) => {

  const sendCurriculumInfo = () => {
    console.log(props.curriculum.meta.type)
    getData(props.activeSub, props.curriculum.meta._id, props.curriculum.meta.type)
  }

  const createCSV = () => {
    // saadud jsonist teen csv
  }

  return (
    <div>
      <button onClick={sendCurriculumInfo}>Download CSV</button>
    </div>
  )
}

export default getCSV