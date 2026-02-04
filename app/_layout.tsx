// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "./partial/navbar";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}