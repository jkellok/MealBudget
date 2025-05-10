import { View } from "react-native";
import LoginPage from "../../components/LoginPage";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LoginPage />
    </View>
  );
}