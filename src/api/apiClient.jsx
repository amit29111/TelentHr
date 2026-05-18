import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
   baseURL: "https://uat-backend-hrms.ezcompliance.in/", ////nss
  //  baseURL: "https://hrmsapi.ezcompliance.in/", // client.      
  headers: {
    "Content-Type": "application/json",
  },
});  
  

apiClient.interceptors.request.use(async (config) => {
  const authToken = await AsyncStorage.getItem("authToken");
  const orgId = await AsyncStorage.getItem("orgId");
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  if (orgId) {
    config.headers["org_uuid"] = orgId;
  } 
  return config;
});

export default apiClient;





