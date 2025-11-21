import { Text, View, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome</Text>

      <Link href="/auth/login" asChild>
        <Button title="Go to Login" />
      </Link>

      <Link href="/auth/register" asChild>
        <Button title="Go to Register" />
      </Link>
    </View>
  );
}