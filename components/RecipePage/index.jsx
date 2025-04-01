import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import recipeService from "../../services/recipes";
import ModalComponent from "../ModalComponent";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Button from "../Button";
import EditRecipeForm from "./EditRecipeForm";

const IngredientsList = ({ ingredients }) => {
  const renderIngredient = ({ item }) => (
    <View>
      <Text>{`\u2022 ${item.amount} ${item.unit} | ${item.name}`}</Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.detailText}>Ingredients:</Text>
      <FlatList
        data={ingredients}
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

const RecipeDetails = ({ recipe }) => {
  return (
    <View style={styles.recipeContainer}>
      <Text style={styles.detailText}>Title: {recipe.title}</Text>
      <Text style={styles.detailText}>Servings: {recipe.servings}</Text>
      <IngredientsList ingredients={recipe.ingredients} />
      <InstructionsList instructions={recipe.instructions} />
    </View>
  );
};

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const getRecipe = async (id) => {
    const recipe = await recipeService.getRecipe(id);
    setRecipe(recipe);
  };

  useEffect(() => {
    getRecipe(id);
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
      const updatedRecipe = await recipeService.updateRecipe(values, recipe.id);
      setRecipe(updatedRecipe);
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error editing the recipe");
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
      <RecipeDetails recipe={recipe} />
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
});