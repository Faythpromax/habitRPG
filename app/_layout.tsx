import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlayerProvider } from "./contexts/playerContext";
import Navbar from "./partial/navbar";

export default function RootLayout() {
  return (
    <PlayerProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <Navbar />
      </SafeAreaView>
    </PlayerProvider>
  );
}