import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

type Todo = {
  id: number;
  name: string;
  completed: boolean;
}


export default function Todo() {
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
  
  // create State (it helps update the UI when data changes)
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoText, setTodoText] = useState("");
  
  // Use AsyncStorage to save and load data locally
  const saveTodos = async (todos: Todo[]) => {
    try{
    await AsyncStorage.setItem("myTodos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos", error);
    }
  }

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem("myTodos");
      if (stored !== null) {
        setTodos(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading todos", error);
    }
  }

  // Clear the completed status of all todo items
  const clearTodoCompletion = async () => {
    try {
      const stored = todos;
      if (stored !== null) {
        const clearedTodos = stored.map(todo => ({ ...todo, completed: false }));
        setTodos(clearedTodos);
        await AsyncStorage.setItem("myTodos", JSON.stringify(clearedTodos));
      }
    } catch (error) {
      console.error("Error clearing todo completion", error);
    }
  }

  // Load todos when the app starts
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos locally whenever they are changed
    useEffect(() => {
    saveTodos(todos);
  }, [todos]);
  
  // Change the completed status of todo item
  // Create a local variable that changes the EXP once a todo is in completed state
  function toggleTodo(id: number) {
    // setTodos(prev =>
    //   prev.map(todo =>
    //     todo.id === id ? { ...todo, completed: !todo.completed }: todo
    //   )
    // )
    setTodos(prev => {
      return prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    });


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
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Ionicons name="menu" size={36} color="orange"/>
          <Text style={{fontSize:18, marginLeft:5}}>Fayth</Text>
        </View>

        <Text style={{fontSize: 18}}>Habit List</Text>
      </View>

      {/* Show Todo List */}
      <FlatList style={styles.FlatList}
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoListItem}>
            <View style={[styles.todoItem]}>
              <Checkbox value={item.completed} onValueChange={() => {toggleTodo(item.id)}} />
              <Text> {item.name}</Text>
            </View>
            <View style={styles.todoOptions}>
              <Button onPress={() => {}} title="Edit" />
              <Ionicons name="remove-circle" size={30} color="red" 
                onPress={() => deleteTodo(item.id)} 
                style={{marginLeft: 5}}/>
            </View>
          </View>
        )}
      />

    {/* Add new todo */}
      <View style={styles.footer}>
        <TextInput placeholder="Add a new todo" style={styles.TextInput} value={todoText} onChangeText={setTodoText} />
        <Ionicons name="add-circle" size={36} color="orange" onPress={() => {createTodo()}} />
        <Ionicons name="refresh" size={36} color="red" onPress={() => {clearTodoCompletion()}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
  },
  header:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff4a9",
  },
  footer:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    gap: 5,
    backgroundColor: "#fff4a9",
    // marginTop: 10,
    // marginBottom: 20
  },
  FlatList:
  {
    flex: 1,
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
    flex: 1,
    alignItems: "center", 
    padding: 10, 
    backgroundColor: "skyblue",
    flexDirection: "row",
  },
  todoOptions:
  {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  TextInput:
  {
    flex: 1,
    padding: 10,
    // backgroundColor: "lightyellow",
    borderWidth: 1,
    borderColor: "gray",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    fontSize: 16,
  }
});