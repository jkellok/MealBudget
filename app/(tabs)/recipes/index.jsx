import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recipes screen</Text>
      <Link
        href={{
          pathname: "recipes/recipe/[id]",
          params: { id: 1 },
        }}>
        <Text style={styles.text}>To one recipe</Text>
      </Link>
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
