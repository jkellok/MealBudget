import { View, StyleSheet } from "react-native";
import IngredientPage from "../../../../components/IngredientPage";

export default function IngredientScreen() {
  return (
    <View style={styles.container}>
      <IngredientPage />
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
