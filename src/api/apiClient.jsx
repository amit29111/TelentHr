import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "http://40.82.136.223:3300/",
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