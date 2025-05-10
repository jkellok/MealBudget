import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { StyleSheet, FlatList, Text, View, Dimensions } from "react-native";
import IngredientListItem from "./IngredientListItem";
import ingredientService from "../../services/ingredients";
import AddButton from "../AddButton";
import AddIngredientForm from "./AddIngredientForm";
import ModalComponent from "../ModalComponent";
import { useAuthSession } from "../../hooks/AuthProvider";

export default function PantryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { userId } = useAuthSession();

  const getIngredients = async () => {
    //const ingredients = await ingredientService.getAllIngredients();
    console.log("getting ingredients for usreid", userId.current);
    const ingredients = await ingredientService.getIngredientsByUser(userId.current);
    setIngredients(ingredients);
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      getIngredients();
      return () => {
        // or put onDelete here and update ingredients state
        getIngredients();
      };
    }, [])
  );

  const handleEmptyList = () => {
    return <Text>No ingredients found!</Text>;
  };

  const onRefresh = () => {
    setIsFetching(true);
    getIngredients();
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <Link
        href={{
          pathname: "pantry/ingredient/[id]",
          params: { id: item.ingredient_id },
        }}>
        <IngredientListItem item={item} />
      </Link>
    </View>
  );

  const onAddIngredient = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const submitNewIngredient = async (values) => {
    try {
      const ingredient = await ingredientService.createNewIngredient(values, userId.current);
      setIngredients(ingredients.concat(ingredient));
      onModalClose();
    } catch (err) {
      console.error(err);
      setError("Error submitting new ingredient");
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {/* change to SectionList later? */}
      <FlatList
        ListEmptyComponent={handleEmptyList}
        showsVerticalScrollIndicator={true}
        data={ingredients}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.ingredient_id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isFetching}
        ItemSeparatorComponent={<View style={styles.separator}></View>}
      />
      <View /* style={styles.addButtonViewContainer} */>
        <AddButton onPress={onAddIngredient} />
      </View>
      <ModalComponent isVisible={isModalVisible} onClose={onModalClose} title="Add ingredient">
        <AddIngredientForm onClose={onModalClose} onSubmit={submitNewIngredient} />
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