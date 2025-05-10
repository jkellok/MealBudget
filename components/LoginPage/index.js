import { useState } from "react";
import { StyleSheet, View } from "react-native";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Button from "../Button";

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <View style={styles.container}>
      <Button
        onPress={() => setShowLogin(!showLogin)}
        label={showLogin ? "Sign up instead?" : "Login instead?"}
      />
      {showLogin ? <LoginForm/> : <SignUpForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
});