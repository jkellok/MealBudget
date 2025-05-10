import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// add error handling

const getAllRecipes = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/recipes`);
  return data;
};

const getRecipesByUser = async (userId) => {
  const { data } = await axios.get(`${apiBaseUrl}/recipes/users/${userId}`);
  return data;
};

const getRecipe = async (id, userId) => {
  const { data } = await axios.get(`${apiBaseUrl}/recipes/users/${userId}/entry/${id}`);
  return data;
};

const createNewRecipe = async (object, userId) => {
  const { data } = await axios.post(`${apiBaseUrl}/recipes/users/${userId}`, object);
  return data;
};

const updateRecipe = async (object, id, userId) => {
  const { data } = await axios.put(`${apiBaseUrl}/recipes/users/${userId}/entry/${id}`, object);
  return data;
};

const deleteRecipe = async (id, userId) => {
  const { data } = await axios.delete(`${apiBaseUrl}/recipes/users/${userId}/entry/${id}`);
  return data;
};

export default {
  getAllRecipes,
  getRecipesByUser,
  getRecipe,
  createNewRecipe,
  updateRecipe,
  deleteRecipe
};