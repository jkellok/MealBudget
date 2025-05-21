import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PantryLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: true, title: "Add ingredient" }} />
        <Stack.Screen name="ingredient/[id]/index" options={{ headerShown: true }} />
        <Stack.Screen name="ingredient/[id]/edit" options={{ headerShown: true, title: "Edit ingredient" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
