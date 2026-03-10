// import { Text, View } from "react-native";
// export default function Index() {
//   return (
//     <View>
//         <Text>Hello</Text>
//     </View>
//   );
// }

import { Button, Text, View } from "react-native";
import { CounterProvider, useCounter } from "./contexts/counterContext";

// Component that reads context
function CounterDisplay() {
  const { count, increase } = useCounter();

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Add 1" onPress={increase} />
    </View>
  );
}

// Root component
export default function App() {
  return (
    <CounterProvider>
      <CounterDisplay />
    </CounterProvider>
  );
}
