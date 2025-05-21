import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { StyleSheet, FlatList, Text, View, Dimensions } from "react-native";
import RecipeListItem from "./RecipeListItem";
import recipeService from "../../services/recipes";
import { useAuthSession } from "../../hooks/AuthProvider";
import Button from "../Button";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { userId } = useAuthSession();

  const getRecipes = useCallback(async () => {
    const recipes = await recipeService.getRecipesByUser(userId.current);
    setRecipes(recipes);
    setIsFetching(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      getRecipes();
    }, [getRecipes])
  );

  const handleEmptyList = () => {
    return <Text style={{ alignSelf: "center" }}>No recipes found!</Text>;
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
          params: { id: item.recipe_id },
        }}>
        <RecipeListItem item={item} />
      </Link>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={handleEmptyList}
        showsVerticalScrollIndicator={true}
        data={recipes}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.recipe_id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isFetching}
        ItemSeparatorComponent={<View style={styles.separator}></View>}
      />
      <View style={styles.addButtonContainer}>
        <Link
          href={{
            pathname: "recipes/add"
          }}
          asChild
        >
          <Button label="Add a recipe" theme="primary-icon-wide" icon="add" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    //borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "column",
    width: Dimensions.get("window").width * 0.9,
  },
  addButtonContainer: {
    width: Dimensions.get("window").width * 0.95,
    alignItems: "center"
  },
  errorText: {
    color: "red"
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
  },
  listItemContainer: {
    paddingVertical: 2,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  }
});