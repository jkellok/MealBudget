import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import { Image } from "expo-image";
import recipeService from "../../services/recipes";
import linkedIngredientService from "../../services/linked_ingredients";
import ModalComponent from "../ModalComponent";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Button from "../Button";
import EditRecipeForm from "./EditRecipeForm";
import IconButton from "../IconButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthSession } from "../../hooks/AuthProvider";

const IngredientsList = ({ combinedIngredientArray, onLinkIngredient, onUnlinkIngredient }) => {
  const renderIngredient = ({ item }) => (
    <View style={{ flexDirection: "row" }}>
      <Text><Text style={{fontWeight: "bold"}}>{`\u2022 ${item.amount} ${item.unit} `}</Text>{item.name}</Text>
      {item.cost && <Text style={styles.costText}> ({item.cost} €)</Text>}
      {item.ingredient_id && <IconButton icon="link-off" onPress={() => onUnlinkIngredient(item.ingredient_id)} />}
      {!item.ingredient_id && <IconButton icon="link" onPress={() => onLinkIngredient(item)} />}
    </View>
  );

  return (
    <View>
      <Text style={styles.detailText}>Ingredients:</Text>
      <FlatList
        data={combinedIngredientArray}
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

const TagsList = ({ tags }) => {
  const renderTags = ({ item, index }) => (
    <View>
      <Text>#{item} </Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.detailText}>Tags:</Text>
      <FlatList
        data={tags}
        renderItem={renderTags}
        horizontal
      />
    </View>
  );
};

const RecipeDetails = ({ recipe, combinedIngredientArray, onLinkIngredient, onUnlinkIngredient }) => {
  return (
    <View style={styles.recipeContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>{recipe.title}</Text>
        {/* Could use iconButton to press to toggle isFavorite */}
        {recipe.is_favorite && <MaterialIcons name="favorite" size={20} color="red" style={{ paddingLeft: 10 }} />}
      </View>

      <View style={styles.detailsContainer}>
        {recipe.image && (
          <View style={styles.imageContainer}>
            <Image source={recipe.image} style={styles.image} />
          </View>
        )}
        <View>
          <Text style={styles.detailText}>Servings: {recipe.servings}</Text>
          {recipe.cost_per_serving && (<Text style={styles.detailText}>Cost per serving: {recipe.cost_per_serving}</Text>)}
          {recipe.total_cost && (<Text style={styles.detailText}>Total cost: {recipe.total_cost}</Text>)}
          {recipe.category && (<Text style={styles.detailText}>Category: {recipe.category}</Text>)}
          {recipe.tags?.length > 0 && <TagsList tags={recipe.tags} />}
          {recipe.difficulty && (<Text style={styles.detailText}>Difficulty: {recipe.difficulty}</Text>)}
          {recipe.rating && (<Text style={styles.detailText}>Rating: {recipe.rating}</Text>)}
          {recipe.minutes_to_make && (
            <View style={styles.detailsContainer}>
              <MaterialIcons name="timelapse" size={20} style={{ paddingRight: 10 }} />
              <Text style={styles.detailText}>{recipe.minutes_to_make} min</Text>
            </View>
          )}
        </View>
      </View>

      {recipe.description && (<Text style={styles.detailText}>Description: {recipe.description}</Text>)}
      <IngredientsList combinedIngredientArray={combinedIngredientArray} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
      <InstructionsList instructions={recipe.instructions} />
      {recipe.notes && (<Text style={styles.detailText}>Notes: {recipe.notes}</Text>)}
    </View>
  );
};

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [linkedIngredients, setLinkedIngredients] = useState([]);
  const [recipeCost, setRecipeCost] = useState(null);
  const [combinedIngredientArray, setCombinedIngredientArray] = useState([]);
  const { userId } = useAuthSession();

  const getRecipe = async (id) => {
    const recipe = await recipeService.getRecipe(id, userId.current);
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

  // CHANGE THIS
  useEffect(() => {
    const getRecipeCost = async () => {
      let totalIngredientCost = 0;
      for (let i = 0; i < linkedIngredients.length; i++) {
        totalIngredientCost += +linkedIngredients[i].ingredient_cost;
      }
      totalIngredientCost = totalIngredientCost.toFixed(2);
      setRecipeCost(totalIngredientCost);
      try {
        const values = { ...recipe, total_cost: totalIngredientCost };
        const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id, userId.current);
        setRecipe(updatedRecipe);
      } catch (err) {
        console.error(err);
      }
    };

    if (linkedIngredients.length === recipe?.ingredients.length) {
      getRecipeCost();
    } else {
      setRecipeCost(null);
    }
  }, [linkedIngredients, recipe?.ingredients.length]);

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

    console.log("ing array", ingredientArray);
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
      const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id, userId.current);
      // update linked ingredients
      // maybe fetch and get the recipe from db?
      updateLinkedIngredients(values.ingredients);
      setRecipe(updatedRecipe);
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error editing the recipe");
    }
  };

  const updateLinkedIngredients = async (editedIngredients) => {
    const currIngredients = recipe.ingredients;
    // compare new ingredient values with existing ingredients in the recipe
    // if they are different, something has changed
    // if the ingredient is linked, it needs to be updated

    // move to helper function file?
    const isSame = (a, b) => a.amount === b.amount && a.unit === b.unit && a.name === b.name;
    const onlyInLeft = (left, right, compareFunction) =>
      left.filter(leftValue =>
        !right.some(rightValue =>
          compareFunction(leftValue, rightValue)
        )
      );
    // contains new edited ingredients, will not contain removed ingredients
    const onlyInEdited = onlyInLeft(editedIngredients, currIngredients, isSame);
    // contains old ingredients before submission, can contain ingredients that are to be removed
    const onlyInCurr = onlyInLeft(currIngredients, editedIngredients, isSame);

    // update each edited linked ingredient that are in onlyInEdited
    for (let i = 0; i < onlyInEdited.length; i++) {
      await linkedIngredientService.updateLinkedIngredient(recipe.recipe_id, onlyInEdited[i]);
    }

    // if a linked ingredient is deleted, onlyInEdited does not have the object while the object is in onlyInCurr
    // if a linked ingredient is edited, it is in both arrays
    // create a new array that contains the objects to be deleted
    const linkedIngredientsToDelete = onlyInCurr.filter(({ name }) => !onlyInEdited.some((e) => e.name === name));

    // get ingredient_id from linkedIngredients and unlink it
    for (let i = 0; i < linkedIngredientsToDelete.length; i++) {
      const linkedIngredientToDelete = linkedIngredients.find(l => l.name === linkedIngredientsToDelete[i].name);
      onUnlinkIngredient(linkedIngredientToDelete.ingredient_id);
    }

    // update the view
    getLinkedIngredients(id);
  };

  const onLinkIngredient = async (ingredient) => {
    try {
      const linkedIngredient = await linkedIngredientService.createNewLinkedIngredient(recipe.recipe_id, ingredient);
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

  if (!recipe) return <Text>Loading recipe...</Text>;

  // onPress doesn't fire properly so probably can't have buttons in the header
  const RecipeHeader = () => (
    <View style={{ flexDirection: "row", width: 300, height: 40, justifyContent: "space-evenly", backgroundColor: "yellow" }}>
      <View style={{ backgroundColor: "blue", width: 150 }}>
        <Text>{recipe.title}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100, backgroundColor: "red" }}>
        <IconButton onPress={onUpdateRecipe} icon="edit" />
        <IconButton onPress={onDelete} icon="delete" />
      </View>
    </View>
  );

  // only use flatlist here that consists of header and footer etc.?
  // or just use map on the lists? and then scrollview
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
      {recipeCost && <Text>Total cost / per serving: {recipeCost} € / {recipe.cost_per_serving} €</Text>}
      <RecipeDetails recipe={recipe} combinedIngredientArray={combinedIngredientArray} onLinkIngredient={onLinkIngredient} onUnlinkIngredient={onUnlinkIngredient} />
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
  costText: {
    fontSize: 12,
    color: "#737373"
  },
  imageContainer: {
    //flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    margin: 10,
  },
  image: {
    //flex: 1,
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
});