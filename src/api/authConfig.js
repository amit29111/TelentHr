import axios from 'axios'

const  authConfig = axios.create({
    baseURL : 'http://40.82.136.223:3300/',
    headers:{
        'Content-Type':'application/json'
    }
})

export default authConfig

