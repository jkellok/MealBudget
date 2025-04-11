import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import recipeService from "../../services/recipes";
import linkedIngredientService from "../../services/linked_ingredients";
import ModalComponent from "../ModalComponent";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Button from "../Button";
import EditRecipeForm from "./EditRecipeForm";
import IconButton from "../IconButton";

const IngredientsList = ({ ingredients, linkedIngredients, onLinkIngredient, onUnlinkIngredient }) => {
  // combine ingredients and linkedIngredients array
  // if ingredient is linked, add id (and price) from linkedIngredients array
  const ingredientArray = ingredients.map((i) => {
    const found = linkedIngredients.find(l => l.name === i.name);
    return (
      i.name === found?.name ? ({
        ...i,
        ingredient_id: found.ingredient_id,
        price: found.price_per_kg_for_recipe,
      }) : i);
  });

  const calculateIngredientPricePerAmount = (ingredient) => {
    if (ingredient.unit === "kg") {
      const calculatedPrice = (ingredient.amount * ingredient.price).toFixed(2);
      return calculatedPrice + " €";
    } else {
      return "Calculation WIP (kg only)";
    }
  };

  const renderIngredient = ({ item }) => (
    <View style={{ flexDirection: "row" }}>
      <Text><Text style={{fontWeight: "bold"}}>{`\u2022 ${item.amount} ${item.unit} `}</Text>{item.name}</Text>
      {item.price && <Text style={styles.priceText}> ({calculateIngredientPricePerAmount(item)}) </Text>}
      {item.ingredient_id && <IconButton icon="link-off" onPress={() => onUnlinkIngredient(item.ingredient_id)} />}
      {!item.ingredient_id && <IconButton icon="link" onPress={() => onLinkIngredient(item)} />}
    </View>
  );

  return (
    <View>
      <Text style={styles.detailText}>Ingredients:</Text>
      <FlatList
        data={ingredientArray}
        keyExtractor={(item) => item.name}
        renderItem={renderIngredient}
      />
    </View>
  );
};

const InstructionsList = ({ instructions }) => {
  const renderInstruction = ({ item, index }) => (
    <View>
      <Text>{index + 1}. {item}</Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.detailText}>Instructions:</Text>
      <FlatList
        data={instructions}
        renderItem={renderInstruction}
      />
    </View>
  );
};

const RecipeDetails = ({ recipe, linkedIngredients, onLinkIngredient, onUnlinkIngredient }) => {
  return (
    <View style={styles.recipeContainer}>
      <Text style={styles.detailText}>Title: {recipe.title}</Text>
      <Text style={styles.detailText}>Servings: {recipe.servings}</Text>
      <IngredientsList ingredients={recipe.ingredients} linkedIngredients={linkedIngredients} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
      <InstructionsList instructions={recipe.instructions} />
    </View>
  );
};

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [linkedIngredients, setLinkedIngredients] = useState([]);

  const getRecipe = async (id) => {
    const recipe = await recipeService.getRecipe(id);
    setRecipe(recipe);
  };

  const getLinkedIngredients = async (id) => {
    const linkedIngredients = await linkedIngredientService.getLinkedIngredientsByRecipe(id);
    setLinkedIngredients(linkedIngredients);
  };

  useEffect(() => {
    getRecipe(id);
    getLinkedIngredients(id);
  }, [id]);

  const onDelete = () => {
    try {
      recipeService.deleteRecipe(id);
      router.back();
    } catch (err) {
      console.error(err);
      setError("Error while deleting the recipe.");
    }
  };

  const onUpdateRecipe = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const submitUpdatedRecipe = async (values) => {
    try {
      const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id);
      setRecipe(updatedRecipe);
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error editing the recipe");
    }
  };

  const onLinkIngredient = async (ingredient) => {
    try {
      await linkedIngredientService.createNewLinkedIngredient(recipe.recipe_id, ingredient);
      getLinkedIngredients(recipe.recipe_id);
    } catch (err) {
      console.error(err);
      setError("Error linking the ingredient");
    }
  };

  const onUnlinkIngredient = async (ingredientId) => {
    try {
      await linkedIngredientService.deleteLinkedIngredient(recipe.recipe_id, ingredientId);
      const filteredLinkedIngredients = linkedIngredients.filter(l => l.ingredient_id !== ingredientId);
      setLinkedIngredients(filteredLinkedIngredients);
    } catch (err) {
      console.error(err);
      setError("Error unlinking the ingredient");
    }
  };

  if (recipe.length === 0) return <Text>Loading recipe...</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: recipe.title,
          headerBackButtonDisplayMode: true,
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <RecipeDetails recipe={recipe} linkedIngredients={linkedIngredients} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
      <View style={styles.buttonContainer}>
        <Button label="Edit" onPress={onUpdateRecipe} theme="primary-icon" icon="edit" />
        <Button label="Delete" onPress={onDelete} theme="secondary-icon" icon="delete" />
      </View>
      <ModalComponent isVisible={isModalVisible} onClose={onModalClose} title="Edit recipe">
        <EditRecipeForm onClose={onModalClose} onSubmit={submitUpdatedRecipe} recipe={recipe} />
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    padding: 10,
  },
  errorText: {
    color: "red"
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  recipeContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 20,
    //textAlign: "center"
    userSelect: "auto"
  },
  priceText: {
    fontSize: 12,
    color: "#737373"
  }
});