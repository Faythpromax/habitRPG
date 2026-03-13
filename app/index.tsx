// import { Text, View } from "react-native";
// export default function Index() {
//   return (
//     <View>
//         <Text>Hello</Text>
//     </View>
//   );
// }

import { Button, Text, View } from "react-native";
import { useCounter } from "./contexts/counterContext";
import { useTheme } from "./contexts/themeContext";

// Component that reads context
export default function ThemeCounterDisplay() {
  const { count, increase } = useCounter();
  const { theme, toggleTheme} = useTheme();
  return (
    <View style={{flex:1, backgroundColor: theme === "dark" ? "black" : "white"}}>
      <View style={{flex: 1}}>
        <Text style = {{color: theme === "dark" ? "white" : "black", fontSize: 16}}>Count: {count}</Text>
        <Button title="Add 1" onPress={increase} />
      </View>

      <View style={{marginTop: 20}}>
        <Text style = {{color: theme === "dark" ? "white" : "black", fontSize: 16}}>Try changing theme</Text>
        <Button title="change theme" onPress={toggleTheme} />
      </View>
    </View>
  );
}

// export default function Home() {
//   return (
//     <ThemeProvider>
//       <CounterProvider>
//         <ThemeCounterDisplay />
//       </CounterProvider>
//     </ThemeProvider>
//   );
// }
