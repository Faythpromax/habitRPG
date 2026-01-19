import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

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
  
  const [todos, setTodos] = useState(todo);
  
  // Change the completed status of todo item
  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed }: todo
      )
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={36} color="orange"/>
        <Text style={{fontSize: 16}}>Todo List</Text>
      </View>
      <FlatList style={styles.FlatList}
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Checkbox value={item.completed} onValueChange={() => {toggleTodo(item.id)}} />
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <TextInput placeholder="Add a new todo" style={styles.TextInput} />
        <Ionicons name="add-circle" size={48} color="orange" onClick={() => {}} />
      </View>
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
  header:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    fontWeight: "bold",
    padding: 10,
    marginBottom: 10,
    marginTop: 20
  },
  footer:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 20
  },
  FlatList:
  {
    backgroundColor: "lightyellow",
    width: "100%",
    padding: 20,
  },
  todoItem:
  {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10, 
    padding: 10, 
    backgroundColor: "skyblue"
  },
  TextInput:
  {
    backgroundColor: "lightyellow",
    fontSize: 14,
  }
});