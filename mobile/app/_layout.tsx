import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        // Menonaktifkan header bawaan agar lonceng ganda di atas hilang
        headerShown: false, 
      }}
    />
  );
}