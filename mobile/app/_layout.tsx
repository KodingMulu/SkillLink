import { Stack } from "expo-router";
import NotificationBell from "../components/ui/NotificationBell"; // Import komponen baru

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true, // Ubah ke true untuk menampilkan lonceng di header
        headerTitle: "",   // Kosongkan judul agar bersih seperti di gambar
        headerShadowVisible: false, // Menghilangkan garis pembatas header
        headerStyle: {
          backgroundColor: "#fcfcfc", // Menyesuaikan background dengan dashboard
        },
        // Pasang lonceng di pojok kanan atas
        headerRight: () => <NotificationBell />,
      }}
    />
  );
}