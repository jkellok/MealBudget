import { Text, View, StyleSheet } from "react-native";

export default function RecipeScreen() {
  return (
    <View style={styles.container}>
      <Text>One recipe shown here</Text>
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
