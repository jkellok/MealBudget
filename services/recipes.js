import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// add error handling

const getAllRecipes = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/recipes`);
  return data;
};

const getRecipe = async (id) => {
  const { data } = await axios.get(`${apiBaseUrl}/recipes/${id}`);
  return data;
};

const createNewRecipe = async (object) => {
  //try {
    const { data } = await axios.post(`${apiBaseUrl}/recipes`, object);
    return data;
  //} catch (err) {
  //  console.error(err);
  //  throw err;
  //}
};

const updateRecipe = async (object, id) => {
  const { data } = await axios.put(`${apiBaseUrl}/recipes/${id}`, object);
  return data;
};

const deleteRecipe = async (id) => {
  const { data } = await axios.delete(`${apiBaseUrl}/recipes/${id}`);
  return data;
};

export default {
  getAllRecipes,
  getRecipe,
  createNewRecipe,
  updateRecipe,
  deleteRecipe
};