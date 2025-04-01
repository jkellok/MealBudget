import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// add error handling

const getAllIngredients = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry`);
  return data;
};

const getIngredient = async (id) => {
  const { data } = await axios.get(`${apiBaseUrl}/pantry/${id}`);
  return data;
};

const createNewIngredient = async (object) => {
  //try {
    const { data } = await axios.post(`${apiBaseUrl}/pantry`, object);
    return data;
  //} catch (err) {
  //  console.error(err);
  //  throw err;
  //}
};

const updateIngredient = async (object, id) => {
  const { data } = await axios.put(`${apiBaseUrl}/pantry/${id}`, object);
  return data;
};

const deleteIngredient = async (id) => {
  const { data } = await axios.delete(`${apiBaseUrl}/pantry/${id}`);
  return data;
};

export default {
  getAllIngredients,
  getIngredient,
  createNewIngredient,
  updateIngredient,
  deleteIngredient
};