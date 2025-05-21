import { View, StyleSheet } from "react-native";
import LoginPage from "../../components/LoginPage";

export default function Login() {
  return (
    <View style={styles.container}>
      <LoginPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: "#25292e",
    //justifyContent: "center",
    //alignItems: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});