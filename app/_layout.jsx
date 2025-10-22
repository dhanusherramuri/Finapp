import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="Login" options={{ title: "Login" }} />
      <Stack.Screen name="Signup" options={{ title: "Signup" }} />
      <Stack.Screen name="Bank" options={{ title: "Bank" }} />
      <Stack.Screen name="ViewPaymentDetails" options={{ title: "Bank" }} />
    </Stack>
  );
}
