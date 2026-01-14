import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const todo = [
    {
      id: 1,
      name: "Hello",
      completed: false
    },
    {
      id: 2,
      name: "World",
      completed: true
    },
    {
      id: 3,
      name: "!!!!",
      completed: false
    }
  ]

  return (
    <View style={styles.container}>
      <FlatList style={styles.FlatList}
        data={todo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <Text>{item.name}, {item.completed ? "Completed" : "Not Completed"}</Text>
          </>
        )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  FlatList:
  {
    backgroundColor: "lightyellow",
    width: "100%",
    padding: 20,
  }
  
});