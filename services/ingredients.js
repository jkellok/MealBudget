import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAllIngredients = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry`);
  return data;
};

const getIngredientsByUser = async (userId) => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry/users/${userId}`);
  return data;
};

const getIngredient = async (id, userId) => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry/users/${userId}/ingredient/${id}`);
  return data;
};

const createNewIngredient = async (object, userId) => {
  const { data } = await axios.post(`${apiBaseUrl}/pantry/users/${userId}/`, object);
  return data;
};

const updateIngredient = async (object, id, userId) => {
  const { data } = await axios.put(`${apiBaseUrl}/pantry/users/${userId}/ingredient/${id}`, object);
  return data;
};

const deleteIngredient = async (id, userId) => {
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