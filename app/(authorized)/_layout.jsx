import { useAuthSession } from "../../hooks/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

export default function AuthLayout() {
  const { token, isLoading } = useAuthSession();

  if (isLoading) {
    return <Text style={{ alignSelf: "center", justifyContent: "center" }}>Loading...</Text>;
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