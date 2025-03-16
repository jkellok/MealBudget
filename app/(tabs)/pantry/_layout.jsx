import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PantryLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ingredient/[id]" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
