import { View, StyleSheet } from "react-native";
import PantryPage from "../../../components/PantryPage";

export default function PantryScreen() {
  return (
    <View style={styles.container}>
      <PantryPage />
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
