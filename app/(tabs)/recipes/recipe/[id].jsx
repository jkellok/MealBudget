import { View, StyleSheet } from "react-native";
import RecipePage from "../../../../components/RecipePage";

export default function RecipeScreen() {
  return (
    <View style={styles.container}>
      <RecipePage />
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
  text: {
    color: "#fff",
  },
});
