import { StyleSheet, Text, View } from "react-native";
import { useAuthSession } from "../../hooks/AuthProvider";

export default function HomePage() {
  const { userId } = useAuthSession();
  console.log("user suff", userId);
  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
      <Text>User ID: {userId?.current}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});