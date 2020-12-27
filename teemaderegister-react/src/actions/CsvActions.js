import { CSV_REQUEST } from '../constants/ApiConstants'
import axios from 'axios'
import moment from 'moment'
import xlsx from 'xlsx'
import { saveAs } from 'file-saver'
const EXCEL_TYPE = 'application/csv'
//  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

export const getCsvData = (status, course, level) => {
  return axios.get(CSV_REQUEST, { params: {status: status, course: course, level: level }})
    .then((res) => {
      createCsv(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

const createCsv = data => {
  let fileName = data[0].curriculums[0].abbreviation
  let mappedData

  if (data[0].defended == undefined) {
    mappedData = data.map(row => ({
      Title: row.title,
      Name: row.author.firstName + ' ' + row.author.lastName,
      Supervisor: row.supervisors[0].supervisor.profile.firstName + ' ' + row.supervisors[0].supervisor.profile.lastName,
      Registered: moment(row.registered).format('DD.MM.YY')
    }))
    fileName += '-registered'
  } else {
    mappedData = data.map(row => ({
      Title: row.title,
      Name: row.author.firstName + ' ' + row.author.lastName,
      Supervisor: row.supervisors[0].supervisor.profile.firstName + ' ' + row.supervisors[0].supervisor.profile.lastName,
      Defended: moment(row.defended).format('DD.MM.YY')
    }))
    fileName += '-defended'
  }
  const workSheet = xlsx.utils.json_to_sheet(mappedData)
  const workBook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workBook, workSheet)

  const csvBuffer = xlsx.write(workBook, {bookType: 'csv', type: 'array'})
  const blob = new Blob([csvBuffer], {type: EXCEL_TYPE})

  saveAs(blob, fileName + '.csv')
}
