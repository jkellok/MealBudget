import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ingredientService from "../../services/ingredients";
import ModalComponent from "../ModalComponent";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Button from "../Button";
import EditIngredientForm from "./EditIngredientForm";

const IngredientDetails = ({ ingredient }) => {
  return (
    <View style={styles.ingredientContainer}>
      <Text style={styles.detailText}>Name: {ingredient.name}</Text>
      <Text style={styles.detailText}>Amount: {ingredient.amount} {ingredient.unit}</Text>
      <Text style={styles.detailText}>Price per kg: {ingredient.price_per_kg} €/kg</Text>
      <Text>More details to come...</Text>
    </View>
  );
};

export default function IngredientPage() {
  const { id } = useLocalSearchParams();
  const [ingredient, setIngredient] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const getIngredient = async (id) => {
    const ingredient = await ingredientService.getIngredient(id);
    setIngredient(ingredient);
  };

  useEffect(() => {
    getIngredient(id);
  }, [id]);

  const onDelete = () => {
    try {
      ingredientService.deleteIngredient(id);
      // maybe could wait a little bit or make it slower
      // to ensure deletion happens first before pantry makes get req
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
      const updatedIngredient = await ingredientService.updateIngredient(values, ingredient.id);
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
  ingredientContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 20,
    //textAlign: "center"
    userSelect: "auto"
  },
});