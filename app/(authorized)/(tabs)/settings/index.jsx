import { View, StyleSheet } from "react-native";
import SettingsPage from "../../../../components/SettingsPage";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <SettingsPage />
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