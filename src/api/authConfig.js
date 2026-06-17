import axios from 'axios';

const authConfig = axios.create({
  baseURL: 'https://uat-backend-hrms.ezcompliance.in',
  // baseURL: "https://hrmsapi.ezcompliance.in",
  headers: {
    'Content-Type': 'application/json',
  },
});

authConfig.interceptors.request.use(request => {
  console.log('REQUEST URL:', request.baseURL + request.url);
  return request;
});

authConfig.interceptors.response.use(
  response => {
    console.log('SUCCESS RESPONSE:', response.status);
    return response;
  },
  error => {
    console.log('AXIOS ERROR:', error.message);
    console.log('AXIOS STATUS:', error.response?.status);
    console.log('AXIOS DATA:', error.response?.data);
    return Promise.reject(error);
  }
);

export default authConfig;