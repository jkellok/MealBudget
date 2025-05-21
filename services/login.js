import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const login = async (credentials) => {
  const { data } = await axios.post(apiBaseUrl, credentials);
  return data;
};

// logout?

export default {
  login
};