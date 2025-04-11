import axios from "axios";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAllLinkedIngredients = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/linked_ingredients`);
  return data;
};

const getLinkedIngredientsByRecipe = async (id) => {
  const { data } = await axios.get(`${apiBaseUrl}/linked_ingredients/${id}`);
  return data;
};

const getOneLinkedIngredientByRecipe = async (recipeId, ingredientId) => {
  const { data } = await axios.get(`${apiBaseUrl}/linked_ingredients/${recipeId}/ingredient/${ingredientId}`);
  return data;
};

const getLinkedRecipesByIngredient = async (id) => {
  const { data } = await axios.get(`${apiBaseUrl}/linked_ingredients/ingredient/${id}`);
  return data;
};

const createNewLinkedIngredient = async (recipeId, object) => {
  const { data } = await axios.post(`${apiBaseUrl}/linked_ingredients/${recipeId}`, object);
  return data;
};

// ADD LATER?
const updateIngredient = async (object, id) => {
  const { data } = await axios.put(`${apiBaseUrl}/linked_ingredients/${id}`, object);

  return data;
};

const deleteLinkedIngredient = async (recipeId, ingredientId) => {
  const { data } = await axios.delete(`${apiBaseUrl}/linked_ingredients/${recipeId}/ingredient/${ingredientId}`);
  return data;
};

export default {
  getAllLinkedIngredients,
  getLinkedIngredientsByRecipe,
  getOneLinkedIngredientByRecipe,
  getLinkedRecipesByIngredient,
  createNewLinkedIngredient,
  //updateIngredient,
  deleteLinkedIngredient
};