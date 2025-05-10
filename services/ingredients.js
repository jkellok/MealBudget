import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAllIngredients = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry`);
  return data;
};

const getIngredientsByUser = async (userId) => {
  console.log("userid get ingredients", userId);
  const { data } = await axios.get(`${apiBaseUrl}/pantry/users/${userId}`);
  return data;
};

const getIngredient = async (id, userId) => {
  console.log("get isnge ingredient userid", userId);
  const { data } = await axios.get(`${apiBaseUrl}/pantry/users/${userId}/ingredient/${id}`);
  return data;
};

const createNewIngredient = async (object, userId) => {
  const { data } = await axios.post(`${apiBaseUrl}/pantry/users/${userId}/`, object);
  return data;
};

const updateIngredient = async (object, id, userId) => {
  console.log("updating with object", object);
  const { data } = await axios.put(`${apiBaseUrl}/pantry/users/${userId}/ingredient/${id}`, object);
  return data;
};

const deleteIngredient = async (id, userId) => {
  console.log("deleting with userid", userId);
  const { data } = await axios.delete(`${apiBaseUrl}/pantry/users/${userId}/ingredient/${id}`);
  return data;
};

export default {
  getAllIngredients,
  getIngredientsByUser,
  getIngredient,
  createNewIngredient,
  updateIngredient,
  deleteIngredient
};