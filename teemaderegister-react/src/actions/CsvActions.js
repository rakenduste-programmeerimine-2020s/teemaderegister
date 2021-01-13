import { CSV_REQUEST } from '../constants/ApiConstants'
import axios from 'axios'
import moment from 'moment'
import xlsx from 'xlsx'
import { saveAs } from 'file-saver'
const EXCEL_TYPE = 'application/csv'

export const getCsvData = (status, course) => {
  return axios.get(CSV_REQUEST, {params: {status: status, course: course}})
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

  const formatRow = row => {
    const response = {
      Title: row.title,
      Name: typeof row.author !== 'undefined' ? row.author.firstName + ' ' + row.author.lastName : 'blank name',
      Supervisor: row.supervisors[0].supervisor.profile.firstName + ' ' + row.supervisors[0].supervisor.profile.lastName
    }

    if (typeof data[0].defended === 'undefined' && typeof data[0].registered !== 'undefined') {
      response.Registered = moment(row.registered).format('DD.MM.YY')
    } else if (typeof data[0].defended !== 'undefined') {
      response.Defended = moment(row.defended).format('DD.MM.YY')
    } else {
      delete response.Name
      response.CrossCurriculum = row.curriculums.length > 1 ? 'Yes' : 'No'
      response.Added = moment(row.added).format('DD.MM.YY')
    }
    return response
  }

  mappedData = data.map(formatRow)

  const workSheet = xlsx.utils.json_to_sheet(mappedData)
  const workBook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workBook, workSheet)

  const csvBuffer = xlsx.write(workBook, {bookType: 'csv', type: 'array'})
  const blob = new Blob([csvBuffer], {type: EXCEL_TYPE})

  saveAs(blob, fileName + '.csv')
}
