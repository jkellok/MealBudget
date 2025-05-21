import { View, StyleSheet } from "react-native";
import EditRecipeForm from "../../../../../../components/EditRecipePage";

export default function EditRecipeScreen() {
  return (
    <View style={styles.container}>
      <EditRecipeForm />
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
