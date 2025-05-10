import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RecipesLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
