import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import ingredientService from "../../services/ingredients";
import linkedIngredientService from "../../services/linked_ingredients";
import ModalComponent from "../ModalComponent";
import { router, Stack, useLocalSearchParams, Link } from "expo-router";
import Button from "../Button";
import EditIngredientForm from "./EditIngredientForm";
import RecipeListItem from "../RecipesPage/RecipeListItem";

const IngredientDetails = ({ ingredient }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.detailText}>Name: {ingredient.name}</Text>
      <Text style={styles.detailText}>Amount: {parseFloat(ingredient.amount)} {ingredient.unit}</Text>
      <Text style={styles.detailText}>Cost per kg: {ingredient.cost_per_kg} €/kg</Text>
      {ingredient.cost_per_unit && <Text style={styles.detailText}>Cost per unit: {ingredient.cost_per_unit} €</Text>}
      {ingredient.expiration_date && <Text style={styles.detailText}>Expiration date: {new Date(ingredient.expiration_date).toLocaleDateString()}</Text>}
      {ingredient.buy_date && <Text style={styles.detailText}>Buy date: {new Date(ingredient.buy_date).toLocaleDateString()}</Text>}
      {ingredient.aisle && <Text style={styles.detailText}>Aisle: {ingredient.aisle}</Text>}
      {ingredient.brand && <Text style={styles.detailText}>Brand: {ingredient.brand}</Text>}
      {ingredient.store && <Text style={styles.detailText}>Store: {ingredient.store}</Text>}
      {ingredient.on_sale && <Text style={styles.detailText}>On sale: {ingredient.on_sale.toString()}</Text>}
      {ingredient.in_pantry && <Text style={styles.detailText}>In pantry: {ingredient.in_pantry.toString()}</Text>}
    </View>
  );
};

const LinkedRecipes = ({ linkedRecipes }) => {
  const renderRecipeTitle = ({ item }) => (
    <View>
      <Link
        href={{
          pathname: "recipes/recipe/[id]",
          params: { id: item.recipe_id },
        }}>
        <Text>{"\u2022 "}<Text style={styles.linkText}>{item.title}</Text></Text>
      </Link>
    </View>
  );

  // if want to show image or possibly other details instead
  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <Link
        href={{
          pathname: "recipes/recipe/[id]",
          params: { id: item.recipe_id },
        }}>
        <RecipeListItem item={item} />
      </Link>
    </View>
  );

  return (
    <View style={styles.textContainer}>
      <Text>This ingredient is used in recipes:</Text>
      <FlatList
        data={linkedRecipes}
        renderItem={renderRecipeTitle}
      />
    </View>
  );
};

export default function IngredientPage() {
  const { id } = useLocalSearchParams();
  const [ingredient, setIngredient] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [linkedRecipes, setLinkedRecipes] = useState([]);

  const getIngredient = async (id) => {
    const ingredient = await ingredientService.getIngredient(id);
    setIngredient(ingredient);
  };

  const getLinkedRecipes = async (id) => {
    const linkedRecipes = await linkedIngredientService.getLinkedRecipesByIngredient(id);
    setLinkedRecipes(linkedRecipes);
  };

  useEffect(() => {
    getIngredient(id);
    getLinkedRecipes(id);
  }, [id]);

  const onDelete = async () => {
    try {
      await ingredientService.deleteIngredient(id);
      router.back();
    } catch (err) {
      console.error(err);
      setError("Error while deleting ingredient.");
    }
  };

  const onUpdateIngredient = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const submitUpdatedIngredient = async (values) => {
    try {
      const updatedIngredient = await ingredientService.updateIngredient(values, ingredient.ingredient_id);
      setIngredient(updatedIngredient);
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error editing the ingredient");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: ingredient.name,
          headerBackButtonDisplayMode: true,
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <IngredientDetails ingredient={ingredient} />
      {linkedRecipes.length > 0 && <LinkedRecipes linkedRecipes={linkedRecipes} />}
      <View style={styles.buttonContainer}>
        <Button label="Edit" onPress={onUpdateIngredient} theme="primary-icon" icon="edit" />
        <Button label="Delete" onPress={onDelete} theme="secondary-icon" icon="delete" />
      </View>
      <ModalComponent isVisible={isModalVisible} onClose={onModalClose} title="Edit ingredient">
        <EditIngredientForm onClose={onModalClose} onSubmit={submitUpdatedIngredient} ingredient={ingredient} />
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
  textContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 20,
    //textAlign: "center"
    userSelect: "auto"
  },
  linkText: {
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  }
});