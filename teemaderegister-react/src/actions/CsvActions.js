import { CSV_REQUEST, SUPERVISOR_REQ} from '../constants/ApiConstants'
import axios from 'axios'
import Title from 'antd/lib/skeleton/Title'

/* export const getData = (status, course, level) => {
    return axios.post(CSV_REQUEST, {status: status, course: course, level: level})
} */

export const getData = (status, course, level) => {
    return axios.get(CSV_REQUEST, { params: {status: status, course: course, level: level }})
    .then((response) => {
        console.log(response.data)
        //createCsv(response.data)
      })
    .catch((err) => {
        console.log(err)
    })
}

const createCsv = data => {
    //let supervisorId = []
    for (let i = 0; i < data.length; i++) {
        supervisorId.push((data[i].supervisors[0].supervisor))
    }
    getSupervisorName(supervisorId)
}


/* kuidas saada nii et ma ei pea tegema iga eraldi nime jaoks POST req, vaid nii et 
saadan kogu info korraga ja saan array tagasi? */

const getSupervisorName = supervisorIds => {
    //console.log(supervisorIds)
    const jsonData = JSON.stringify(supervisorIds)
    return axios.post(SUPERVISOR_REQ, {supervisorId: jsonData})
}
