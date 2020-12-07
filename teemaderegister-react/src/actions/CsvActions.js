import {CSV_REQUEST} from '../constants/ApiConstants'
import axios from 'axios'

/* export const getData = (status, course, level) => {
    return axios.post(CSV_REQUEST, {status: status, course: course, level: level})
} */

export const getData = (status, course, level) => {
    return axios.get(CSV_REQUEST, { params: {status: status, course: course, level: level }})
    .then((response) => {
        console.log(response.data)
      })
    .catch((err) => {
        console.log(err)
    })
}
