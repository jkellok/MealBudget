import { View, StyleSheet } from "react-native";
import AddRecipeForm from "../../../../components/AddRecipePage";

export default function AddRecipeScreen() {
  return (
    <View style={styles.container}>
      <AddRecipeForm />
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
