import { CSV_REQUEST } from '../constants/ApiConstants'
import axios from 'axios'
import moment from 'moment'

/* export const getData = (status, course, level) => {
    return axios.post(CSV_REQUEST, {status: status, course: course, level: level})
} */

export const getData = (status, course, level) => {
    return axios.get(CSV_REQUEST, { params: {status: status, course: course, level: level }})
    .then((response) => {
        console.log(response.data)
        createCsv(response.data)
      })
    .catch((err) => {
        console.log(err)
    })
}

const createCsv = data => {
    const sortedData = data.map(row => ({
        title: row.title,
        name: row.author.firstName + ' ' + row.author.lastName,
        supervisor: row.supervisors[0].supervisor.profile.firstName + ' ' + row.supervisors[0].supervisor.profile.lastName,
        registered: moment(row.registered).format("DD.MM.YY") 
    }))
    console.log(JSON.stringify(sortedData))
}




