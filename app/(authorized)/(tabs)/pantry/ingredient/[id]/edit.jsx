import { View, StyleSheet } from "react-native";
import EditIngredientForm from "../../../../../../components/EditIngredientPage";

export default function EditIngredientScreen() {
  return (
    <View style={styles.container}>
      <EditIngredientForm />
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
