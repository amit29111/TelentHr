import axios from 'axios'

const  authConfig = axios.create({
   baseURL: "https://uat-backend-hrms.ezcompliance.in", ////nss
//    baseURL: "https://hrmsapi.ezcompliance.in/", // client
    headers:{
        'Content-Type':'application/json'
    }
})

export default authConfig

