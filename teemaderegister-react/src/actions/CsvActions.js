//import Api from '../utils/Api'
import {CSV_REQUEST} from '../constants/ApiConstants'

/* export const getData = (status, course) => {
    return Api('POST', '/api/csv/', {status: status, course: course})
        .then(console.log('KOHAL'))
        .catch('ERROR')
}
 */

import axios from 'axios'

export const getData = (status, course, level) => {
    return axios.post(CSV_REQUEST, {status: status, course: course, level: level})
}
