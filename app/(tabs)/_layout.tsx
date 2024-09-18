import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: true, headerTitle: "Home" }} />
      <Tabs.Screen name="form" options={{ headerShown: true, headerTitle: "Form" }} />
    </Tabs>
  );
}
