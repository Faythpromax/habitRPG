import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";


type Todo = {
  id: number;
  name: string;
  completed: boolean;
}

export default function Index() {
  // const todo: Todo[] = [
  //   {
  //     id: 1,
  //     name: "Hello",
  //     completed: false
  //   },
  //   {
  //     id: 2,
  //     name: "World",
  //     completed: true
  //   },
  //   {
  //     id: 3,
  //     name: "!!!!",
  //     completed: false
  //   }
  // ]
  
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoText, setTodoText] = useState("");
  
  const saveTodos = async (todos: Todo[]) => { //hmm1
    try{
    await AsyncStorage.setItem("myTodos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos", error);
    }
  }

  const loadTodos = async () => { //hmm2
    try {
      const stored = await AsyncStorage.getItem("myTodos");
      if (stored !== null) {
        setTodos(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading todos", error);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

    useEffect(() => {
    saveTodos(todos);
  }, [todos]);
  
  // Change the completed status of todo item
  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed }: todo
      )
    )
  }

  // Add a new todo item
  function createTodo() {
      if (!todoText.trim()) return;     

      const newTodo: Todo = {
        id: Date.now(),
        name: todoText,
        completed: false
      };
      
      setTodos(prev => [...prev, newTodo]);
      setTodoText("");
  }

  // Delete a todo item
  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
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
          <View style={styles.todoListItem}>
            <View style={[styles.todoItem]}>
              <Checkbox value={item.completed} onValueChange={() => {toggleTodo(item.id)}} />
              <Text> {item.name}</Text>
            </View>
            <Ionicons name="remove-circle" size={24} color="red" 
              onPress={() => deleteTodo(item.id)} 
              style={{marginLeft: 10}}/>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TextInput placeholder="Add a new todo" style={styles.TextInput} value={todoText} onChangeText={setTodoText} />
        <Ionicons name="add-circle" size={48} color="orange" onPress={() => {createTodo()}} />
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
  todoListItem:
  {
    flexDirection: "row", 
    alignItems: "center",
  },
  todoItem:
  {
    flex:1,
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10, 
    padding: 10, 
    backgroundColor: "skyblue"
  },
  TextInput:
  {
    flex: 1,
    backgroundColor: "lightyellow",
    fontSize: 14,
  }
});