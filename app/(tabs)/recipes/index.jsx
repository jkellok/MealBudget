import { View, StyleSheet } from "react-native";
import RecipesPage from "../../../components/RecipesPage";

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <RecipesPage />
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
