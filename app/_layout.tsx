import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CounterProvider } from "./contexts/counterContext";
import { PlayerProvider } from "./contexts/playerContext";
import { ThemeProvider } from "./contexts/themeContext";
import Navbar from "./partial/navbar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <CounterProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
            <Navbar />
          </SafeAreaView>
        </CounterProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
}