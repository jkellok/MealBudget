import { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import ingredientService from "../../services/ingredients";
import linkedIngredientService from "../../services/linked_ingredients";
import { router, Stack, useLocalSearchParams, Link, useFocusEffect } from "expo-router";
import Button from "../Button";
import RecipeListItem from "../RecipesPage/RecipeListItem";
import { useAuthSession } from "../../hooks/AuthProvider";

const IngredientDetails = ({ ingredient }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.detailText}>Name: {ingredient.name}</Text>
      <Text style={styles.detailText}>Amount: {parseFloat(ingredient.amount)} {ingredient.unit}</Text>
      <Text style={styles.detailText}>Cost per kg: {ingredient.cost_per_kg} €/kg</Text>
      {ingredient.cost_per_package && <Text style={styles.detailText}>Cost per unit: {ingredient.cost_per_package} €</Text>}
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

const RecipeTitle = ({ recipe }) => {
  return (
    <View>
      <Link
        href={{
          pathname: "recipes/recipe/[id]",
          params: { id: recipe.recipe_id },
        }}
        withAnchor // ensure back button exists on recipe
      >
        <Text>{"\u2022 "}<Text style={styles.linkText}>{recipe.title}</Text></Text>
        {/* Could make RecipeListItemSimple to show small picture and less details but more than just a title */}
        {/* <RecipeListItem item={item} /> */}
      </Link>
    </View>
  );
};

const LinkedRecipes = ({ linkedRecipes }) => {
  return (
    <View style={styles.textContainer}>
      <Text>This ingredient is used in recipes:</Text>
      {linkedRecipes.map(r => (<RecipeTitle recipe={r} key={r.recipe_id} />))}
    </View>
  );
};

export default function IngredientPage() {
  const { id } = useLocalSearchParams();
  const [ingredient, setIngredient] = useState([]);
  const [error, setError] = useState(null);
  const [linkedRecipes, setLinkedRecipes] = useState([]);
  const { userId } = useAuthSession();

  const getIngredient = useCallback(async (id) => {
    const ingredient = await ingredientService.getIngredient(id, userId.current);
    setIngredient(ingredient);
  }, [userId]);

  const getLinkedRecipes = async (id) => {
    const linkedRecipes = await linkedIngredientService.getLinkedRecipesByIngredient(id);
    setLinkedRecipes(linkedRecipes);
  };

  useFocusEffect(
    useCallback(() => {
      getIngredient(id);
      getLinkedRecipes(id);
      return () => {
        getIngredient(id);
        getLinkedRecipes(id);
      };
    }, [getIngredient, id])
  );

  const onDelete = () => {
    Alert.alert("Delete ingredient",
      "Are you sure you want to delete this ingredient?", [
      {
        text: "Cancel",
        onPress: () => console.log("Deletion cancelled!"),
      },
      {
        text: "OK",
        onPress: () => handleDeletion()
      },
    ], {
      cancelable: true
    });
  };

  const handleDeletion = async () => {
    try {
      await ingredientService.deleteIngredient(id, userId.current);
      router.dismiss();
    } catch (err) {
      console.error(err);
      setError("Error while deleting ingredient.");
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
      <ScrollView>
        <IngredientDetails ingredient={ingredient} />
        {linkedRecipes.length > 0 && <LinkedRecipes linkedRecipes={linkedRecipes} />}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Link
          href={{
            pathname: "pantry/ingredient/[id]/edit",
            params: { id: id }
          }}
          asChild
        >
          <Button label="Edit" theme="primary-icon" icon="edit" />
        </Link>
        <Button label="Delete" onPress={onDelete} theme="secondary-icon" icon="delete" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    padding: 8,
  },
  errorText: {
    color: "red"
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  textContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 20,
    userSelect: "auto"
  },
  linkText: {
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  }
});