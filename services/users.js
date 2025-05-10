import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const createNewUser = async (object) => {
  console.log("in create new user");
  const { data } = await axios.post(`${apiBaseUrl}/users`, object);
  return data;
};

const updateUser = async (object, id) => {
  const { data } = await axios.put(`${apiBaseUrl}/users/${id}`, object);
  return data;
};

const deleteUser = async (id) => {
  const { data } = await axios.delete(`${apiBaseUrl}/users/${id}`);
  return data;
};

export default {
  createNewUser,
  updateUser,
  deleteUser
};