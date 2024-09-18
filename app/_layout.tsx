import { Stack } from "expo-router/stack";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="[recordId]" options={{ presentation: "modal", title: "Records details" }} />
    </Stack>
  );
}
