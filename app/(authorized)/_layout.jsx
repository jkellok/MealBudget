import { useAuthSession } from "../../hooks/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

export default function AuthLayout() {
  const { token, isLoading } = useAuthSession();
  console.log("token is", token);
  console.log("isLoading is", isLoading);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token?.current) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}