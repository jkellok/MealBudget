import { StyleSheet, Text, View, Dimensions } from "react-native";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <Text>Start by adding ingredients to pantry.</Text>
      <Text>Required fields are name, amount, unit and price per kg.</Text>
      <Text>Then you can add recipes.</Text>
      <Text>Required fields are title, servings, ingredients and instructions.</Text>
      <Text>After adding a recipe, you can link ingredients to it.</Text>
      <Text>Linking the ingredients is based on the ingredient name currently, so make sure the name matches.</Text>
      <Text>After linking the ingredient, the app will try to calculate the cost of the ingredient for the recipe.</Text>
      <Text>If all the ingredients are linked, the cost for the whole recipe should be calculated.</Text>
      <Text>The cost is shown for the whole recipe and for a portion.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    padding: 10,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.8,
    borderRadius: 10,
  },
});