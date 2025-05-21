import { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import { Image } from "expo-image";
import recipeService from "../../services/recipes";
import linkedIngredientService from "../../services/linked_ingredients";
import { router, Stack, useLocalSearchParams, Link, useFocusEffect } from "expo-router";
import Button from "../Button";
import IconButton from "../IconButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuthSession } from "../../hooks/AuthProvider";
import RatingBar from "../RatingBar";

const IngredientsList = ({ combinedIngredientArray, onLinkIngredient, onUnlinkIngredient }) => {
  if (!combinedIngredientArray) return null;
  return (
    <View style={styles.subtitleAndTextContainer}>
      <Text style={styles.subtitle}>Ingredients:</Text>
      {combinedIngredientArray.map((item, index) => (
        <View style={styles.rowContainer} key={index}>
          <Text><Text style={{fontWeight: "bold"}}>{`\u2022 ${item.amount} ${item.unit} `}</Text>{item.name}</Text>
          {item.cost && <Text style={styles.costText}> ({item.cost} €)</Text>}
          {item.ingredient_id && <IconButton icon="link-off" onPress={() => onUnlinkIngredient(item.ingredient_id)} />}
          {!item.ingredient_id && <IconButton icon="link" onPress={() => onLinkIngredient(item)} />}
        </View>
      ))}
    </View>
  );
};

const InstructionsList = ({ instructions }) => {
  return (
    <View style={styles.subtitleAndTextContainer}>
      <Text style={styles.subtitle}>Instructions:</Text>
      {instructions.map((item, index) => (
        <View key={index}>
          <Text>{index + 1}. {item}</Text>
        </View>
      ))}
    </View>
  );
};

const RecipeDetails = ({ recipe, combinedIngredientArray, onLinkIngredient, onUnlinkIngredient }) => {
  return (
    <View style={styles.recipeContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        {/* Could use iconButton to press to toggle isFavorite */}
        {!recipe.is_favorite && <MaterialIcons name="favorite-outline" size={20} color="black" style={{ paddingLeft: 10 }} />}
        {recipe.is_favorite && <MaterialIcons name="favorite" size={20} color="red" style={{ paddingLeft: 10 }} />}
      </View>

      <View style={styles.detailsContainer}>
        {recipe.image && (
          <View style={styles.imageContainer}>
            <Image source={recipe.image} style={styles.image} />
          </View>
        )}
        <View style={styles.detailsTextContainer}>
          {recipe.rating && (
            <View style={styles.rowContainer}>
              <Text style={styles.detailText}>Rating: </Text>
              <RatingBar rating={recipe.rating} size={20} />
            </View>
          )}
          <View style={styles.rowContainer}>
            <MaterialIcons name="person" size={16} color="black" />
            <Text> {recipe.servings}</Text>
          </View>
          {recipe.minutes_to_make && (
            <View style={styles.rowContainer}>
              <MaterialIcons name="timelapse" size={16} />
              <Text style={styles.detailText}> {recipe.minutes_to_make} min</Text>
            </View>
          )}
          {recipe.cost_per_serving && (
            <View style={styles.rowContainer}>
              <FontAwesome5 name="coins" size={16} color="black" />
              <Text> {recipe.total_cost} € ({recipe.cost_per_serving} €/portion)</Text>
            </View>
          )}
          {recipe.difficulty && (
            <View style={styles.rowContainer}>
              <Text style={styles.detailText}>Difficulty: {recipe.difficulty}</Text>
            </View>
          )}
        </View>
      </View>
      <View>
        {recipe.category && (
          <View style={styles.rowContainer}>
            <Text style={styles.detailText}>Category: {recipe.category}</Text>
          </View>
        )}
        {recipe.tags?.length > 0 && (
          <View style={styles.rowContainer}>
            <Text style={styles.detailText}>Tags: </Text>
            {recipe.tags.map((t, index) => <Text key={index} style={{ flexWrap: "nowrap", flexDirection: "column" }}>#{t} </Text>)}
          </View>
        )}
      </View>

      {recipe.description && (
        <View style={styles.subtitleAndTextContainer}>
          <Text style={styles.subtitle}>Description:</Text>
          <Text>{recipe.description}</Text>
        </View>
      )}

      <IngredientsList combinedIngredientArray={combinedIngredientArray} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
      <InstructionsList instructions={recipe.instructions} />

      {recipe.notes && (
        <View style={styles.subtitleAndTextContainer}>
          <Text style={styles.subtitle}>Notes:</Text>
          <Text>{recipe.notes}</Text>
        </View>
        )}
    </View>
  );
};

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [linkedIngredients, setLinkedIngredients] = useState([]);
  const [combinedIngredientArray, setCombinedIngredientArray] = useState([]);
  const { userId } = useAuthSession();

  const getRecipe = useCallback(async (id) => {
    const recipe = await recipeService.getRecipe(id, userId.current);
    setRecipe(recipe);
  }, [userId]);

  const getLinkedIngredients = async (id) => {
    const linkedIngredients = await linkedIngredientService.getLinkedIngredientsByRecipe(id);
    setLinkedIngredients(linkedIngredients);
  };

  useFocusEffect(
    useCallback(() => {
      getRecipe(id);
      getLinkedIngredients(id);
      return () => {
        getRecipe(id);
        getLinkedIngredients(id);
      };
    }, [getRecipe, id])
  );

  // could change this, maybe doesn't need to be an useeffect
  useEffect(() => {
    const getRecipeCost = async () => {
      let totalIngredientCost = 0;
      for (let i = 0; i < linkedIngredients.length; i++) {
        totalIngredientCost += +linkedIngredients[i].ingredient_cost;
      }
      totalIngredientCost = totalIngredientCost.toFixed(2);
      try {
        const values = { ...recipe, total_cost: totalIngredientCost };
        const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id, userId.current);
        setRecipe(updatedRecipe);
      } catch (err) {
        console.error(err);
      }
    };

    if (linkedIngredients.length === recipe?.ingredients.length) {
      // calculate recipe cost if all ingredients are linked
      getRecipeCost();
    }
  }, [linkedIngredients, recipe?.ingredients.length, userId]);

  useEffect(() => {
    // combine ingredients and linkedIngredients array
    // if ingredient is linked, add id and costs from linkedIngredients array
    // (ingredients has name, unit and amount)
    const ingredientArray = recipe?.ingredients.map((i) => {
      const found = linkedIngredients.find(l => l.name === i.name);
      return (
        i.name === found?.name ? ({
          ...i,
          ingredient_id: found.ingredient_id,
          cost: found.ingredient_cost,
          cost_kg: found.cost_per_kg // possibly not needed
        }) : i);
    });
    setCombinedIngredientArray(ingredientArray);
  }, [linkedIngredients, recipe?.ingredients]);

  const onDelete = () => {
    Alert.alert("Delete recipe",
      "Are you sure you want to delete this recipe?", [
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
      await recipeService.deleteRecipe(id, userId.current);
      router.dismiss();
    } catch (err) {
      console.error(err);
      setError("Error while deleting the recipe.");
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
      removeRecipeCost();
    } catch (err) {
      console.error(err);
      setError("Error unlinking the ingredient");
    }
  };

  const removeRecipeCost = async () => {
    try {
      const values = { ...recipe, total_cost: null, cost_per_serving: null};
      const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id, userId.current);
      setRecipe(updatedRecipe);
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <Text>Loading recipe...</Text>;

  // onPress doesn't fire properly so probably can't have buttons in the header
  /* const RecipeHeader = () => (
    <View style={{ flexDirection: "row", width: 300, height: 40, justifyContent: "space-evenly", backgroundColor: "yellow" }}>
      <View style={{ backgroundColor: "blue", width: 150 }}>
        <Text>{recipe.title}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100, backgroundColor: "red" }}>
        <IconButton onPress={onUpdateRecipe} icon="edit" size={24} />
        <IconButton onPress={onDelete} icon="delete" />
      </View>
    </View>
  ); */

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          //headerTitle: () => <RecipeHeader />,
          headerTitle: recipe.title,
          headerBackButtonDisplayMode: true,
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView>
        <RecipeDetails recipe={recipe} combinedIngredientArray={combinedIngredientArray} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Link
          href={{
            pathname: "recipes/recipe/[id]/edit",
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
  recipeContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 14,
    userSelect: "auto",
  },
  costText: {
    fontSize: 12,
    color: "#737373",
  },
  imageContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    margin: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  detailsTextContainer: {
    width: "100%",
    //height: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    //flexWrap: "wrap",
    //flex: 1,
    maxWidth: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
    flexWrap: "wrap"
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontsize: 16,
    fontWeight: "bold",
    fontVariant: "small-caps",
  },
  subtitleAndTextContainer: {
    padding: 4,
    marginVertical: 2,
    borderColor: "black",
    borderWidth: 1
  }
});