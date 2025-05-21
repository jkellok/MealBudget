import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RecipesLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: true, title: "Add recipe" }} />
        <Stack.Screen name="recipe/[id]/index" options={{ headerShown: true }} />
        <Stack.Screen name="recipe/[id]/edit" options={{ headerShown: true, title: "Edit recipe" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}