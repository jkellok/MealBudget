import { Text, View, StyleSheet } from "react-native";
import HomePage from "../../../components/HomePage";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <HomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});