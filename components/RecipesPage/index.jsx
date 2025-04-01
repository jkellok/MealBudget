import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { StyleSheet, FlatList, Text, View, Dimensions } from "react-native";
import RecipeListItem from "./RecipeListItem";
import recipeService from "../../services/recipes";
import AddButton from "../AddButton";
import AddRecipeForm from "./AddRecipeForm";
import ModalComponent from "../ModalComponent";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const getRecipes = async () => {
    const recipes = await recipeService.getAllRecipes();
    setRecipes(recipes);
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      getRecipes();
    }, [])
  );

  const handleEmptyList = () => {
    return <Text>No recipes found!</Text>;
  };

  const onRefresh = () => {
    setIsFetching(true);
    getRecipes();
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <Link
        href={{
          pathname: "recipes/recipe/[id]",
          params: { id: item.id },
        }}>
        <RecipeListItem item={item} />
      </Link>
    </View>
  );

  const onAddRecipe = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const submitNewRecipe = async (values) => {
    try {
      const recipe = await recipeService.createNewRecipe(values);
      setRecipes(recipes.concat(recipe));
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error submitting new recipe");
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        ListEmptyComponent={handleEmptyList}
        showsVerticalScrollIndicator={true}
        data={recipes}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isFetching}
        ItemSeparatorComponent={<View style={styles.separator}></View>}
      />
      <View /* style={styles.addButtonViewContainer} */>
        <AddButton onPress={onAddRecipe} />
      </View>
      <ModalComponent isVisible={isModalVisible} onClose={onModalClose} title="Add recipe">
          <AddRecipeForm onClose={onModalClose} onSubmit={submitNewRecipe} />
      </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 10,
    //padding: 6,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "column",
    margin: 10
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonViewContainer: {
    position: "absolute",
    left: -150,
    bottom: 20
  },
  errorText: {
    color: "red"
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
  },
  listItemContainer: {
    //backgroundColor: "gray",
    width: Dimensions.get("window").width * 0.8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    //height: Dimensions.get("window").height * 0.8,
    //width: Dimensions.get("window").width * 0.8,
  }
});