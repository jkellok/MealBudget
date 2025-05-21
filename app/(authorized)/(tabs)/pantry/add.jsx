import { View, StyleSheet } from "react-native";
import AddIngredientForm from "../../../../components/AddIngredientPage";

export default function AddIngredientScreen() {
  return (
    <View style={styles.container}>
      <AddIngredientForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
});
