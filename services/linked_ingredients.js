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

const getOneLinkedIngredientCostPerKg = async (recipeId, ingredientId) => {
  const { data } = await axios.get(`${apiBaseUrl}/linked_ingredients/${recipeId}/ingredient/${ingredientId}/cost`);
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

const updateLinkedIngredient = async (recipeId, object) => {
  const { data } = await axios.put(`${apiBaseUrl}/linked_ingredients/${recipeId}`, object);
  return data;
};

const updateIngredientCost = async (recipeId, ingredientId, object) => {
  const { data } = await axios.put(`${apiBaseUrl}/linked_ingredients/${recipeId}/ingredient/${ingredientId}`, object);
  return data;
};

const deleteLinkedIngredient = async (recipeId, ingredientId) => {
  const { data } = await axios.delete(`${apiBaseUrl}/linked_ingredients/${recipeId}/ingredient/${ingredientId}`);
  return data;
};

export default {
  getAllLinkedIngredients,
  getLinkedIngredientsByRecipe,
  getOneLinkedIngredientCostPerKg,
  getOneLinkedIngredientByRecipe,
  getLinkedRecipesByIngredient,
  createNewLinkedIngredient,
  updateLinkedIngredient,
  updateIngredientCost,
  deleteLinkedIngredient
};