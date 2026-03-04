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
  const [player, setPlayer] = useState<Player>({
    EXP: 0,
    level: 1,
    health: 100,
    mana: 50
  });
  // create State (it helps update the UI when data changes)
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoText, setTodoText] = useState("");
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const [isLoaded, setIsLoaded] = useState(false);

  // Just to show time when the app is opened
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use AsyncStorage to save and load data locally
  const saveTodos = async (todos: Todo[]) => {
    try{
    await AsyncStorage.setItem("myTodos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos", error);
    }
  }

  // Instead of loading todos directly, we check if it's a new day first
  const loadTodos = async () => {
    try {
      checkNewDay();
    } catch (error) {
      console.error("Error loading todos", error);
    }
  }

  // Check time whenever the app is opened, if it's a new day, clear the completed status of all todo items
  const checkNewDay = async () => {
      try {
        const lastVisit = await AsyncStorage.getItem("lastVisit");
        const now = new Date();
        const nowString = now.toISOString().split("T")[0];
        
        if (lastVisit) {
          const lastVisitDate = new Date(lastVisit);
          const lastVisitString = lastVisitDate.toISOString().split("T")[0];
          if (nowString !== lastVisitString) {
            clearTodoCompletion();
          }
          else {
            const stored = await AsyncStorage.getItem("myTodos");
            if (stored !== null) {
            setTodos(JSON.parse(stored));
            }
          }
        }
        await AsyncStorage.setItem("lastVisit", now.toISOString());
      } catch (error) {
        console.error("Error checking new day", error);
      }
    }

  // Clear the completed status of all todo items
  const clearTodoCompletion = async () => {
    try {
      const stored = await AsyncStorage.getItem("myTodos");
      const currentList = JSON.parse(stored || "[]") as Todo[];
      if (currentList !== null) {
        const clearedTodos = currentList.map(todo => ({ ...todo, completed: false }));
        setTodos(clearedTodos);
        await AsyncStorage.setItem("myTodos", JSON.stringify(clearedTodos));
      }
    } catch (error) {
      console.error("Error clearing todo completion", error);
    }
  }

  // Load todos when the app starts
  useEffect(() => {
    const load = async () => {
      await loadTodos();
      setIsLoaded(true);
    };
    load();
  }, []);

  // Save todos locally whenever they are changed
  useEffect(() => {
    if (!isLoaded) return; // Don't save if we haven't loaded the initial data yet
    saveTodos(todos);
  }, [todos]);
  
  // Change the completed status of todo item
  function toggleTodo(id: number) {
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

  function editTodo(id: number, name:string) {
    setEditId(id);
    setEditName(name);
  }

  function saveEdit() {
    if (!editId || editName.trim() === "") return;
    
    setTodos(prev => prev.map(todo => 
      todo.id === editId ? { ...todo, name: editName } : todo));
    setEditId(null);
    setEditName("");
  }

  // Delete a todo item
  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Ionicons name="menu" size={36} color="orange"/>
          <Text style={{fontSize:18, marginLeft:5}}>Fayth</Text>
          <Text style={{fontSize:14, marginLeft:5}}>{currentTime.toISOString().split("T")[0]}</Text>
        </View>

        <Text style={{fontSize: 18}}>Habit List</Text>
      </View>

      {/* Todo List */}
      <FlatList style={styles.FlatList}
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoListItem}>
            <View style={[styles.todoItem]}>
              <Checkbox value={item.completed} onValueChange={() => {toggleTodo(item.id)}} />

              {/* Show todo item name or TextInput depending on whether you're editing it or not */}
              {item.id === editId ? (
                <TextInput placeholder="Edit todo"
                  style={{borderWidth: 1}} value={editName} onChangeText={setEditName} />
              ) : (
                <Text style={{marginLeft: 5}}>{item.name}</Text>
              )}
            </View>

            <View style={styles.todoOptions}>
              {/* Same with the button */}
              {item.id === editId ? (
                <Button onPress={() => saveEdit()} title="Save" />
              ) : (
                <Button onPress={() => editTodo(item.id, item.name)} title="Edit" />
              )}
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
    marginBottom: 10,
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