import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { usePlayer } from "./contexts/playerContext";
import { Habit } from "./types/habit";

// export default function Todo({ updateEXP }: { updateEXP: (addEXP: number) => void }) {
export default function HabitTracker() {
  // Get player data and updateEXP function
  const { player, updateEXP } = usePlayer();

  // create State (it helps update the UI when data changes)
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitText, setHabitText] = useState("");
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const [isLoaded, setIsLoaded] = useState(false);

  // Just to show date when the app is opened
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use AsyncStorage to save and load data locally
  const saveHabits = async (habits: Habit[]) => {
    try{
    await AsyncStorage.setItem("myHabits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits", error);
    }
  }

  // Instead of loading todos directly, we check if it's a new day first
  const loadHabits = async () => {
    try {
      checkNewDay();
    } catch (error) {
      console.error("Error loading habits", error);
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
            clearHabitCompletion();
          }
          else {
            const stored = await AsyncStorage.getItem("myHabits");
            if (stored !== null) {
            setHabits(JSON.parse(stored));
            }
          }
        }
        await AsyncStorage.setItem("lastVisit", now.toISOString());
      } catch (error) {
        console.error("Error checking new day", error);
      }
    }

  // Clear the completed status of all todo items
  const clearHabitCompletion = async () => {
    try {
      const stored = await AsyncStorage.getItem("myHabits");
      const currentList = JSON.parse(stored || "[]") as Habit[];
      if (currentList !== null) {
        const clearedHabits = currentList.map(habit => ({ ...habit, completed: false }));
        setHabits(clearedHabits);
        await AsyncStorage.setItem("myHabits", JSON.stringify(clearedHabits));
      }
    } catch (error) {
      console.error("Error clearing habit completion", error);
    }
  }

  // Load todos when the app starts
  useEffect(() => {
    const load = async () => {
      await loadHabits();
      setIsLoaded(true);
    };
    load();
  }, []);

  // Save todos locally whenever they are changed
  useEffect(() => {
    if (!isLoaded) return; // Don't save if we haven't loaded the initial data yet
    saveHabits(habits);
  }, [habits]);
  
  // Change the completed status of todo item
  function toggleHabit(id: number) {
    setHabits(prev => {
      return prev.map(habit => {
        if (habit.id === id) {
          if (habit.completed === false) {
            updateEXP(35); // Add 35 EXP for completing a task
          }
          return { ...habit, completed: !habit.completed };
        }
        return habit;
      });
    });
  }

  // Add a new todo item
  function createHabit() {
      if (!habitText.trim()) return;     

      const newHabit: Habit = {
        id: Date.now(),
        name: habitText,
        completed: false
      };
      
      setHabits(prev => [...prev, newHabit]);
      setHabitText("");
  }

  function editHabit(id: number, name:string) {
    setEditId(id);
    setEditName(name);
  }

  function saveEdit() {
    if (!editId || editName.trim() === "") return;
    
    setHabits(prev => prev.map(habit => 
      habit.id === editId ? { ...habit, name: editName } : habit));
    setEditId(null);
    setEditName("");
  }

  // Delete a todo item
  function deleteHabit(id: number) {
    setHabits(prev => prev.filter(habit => habit.id !== id));
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
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.habitListItem}>
            <View style={[styles.habitItem]}>
              <Checkbox value={item.completed} onValueChange={() => {toggleHabit(item.id)}} />

              {/* Show todo item name or TextInput depending on whether you're editing it or not */}
              {item.id === editId ? (
                <TextInput placeholder="Edit habit"
                  style={{borderWidth: 1, padding: 0, marginLeft: 5, flex: 1}} value={editName} onChangeText={setEditName} />
              ) : (
                <Text style={{marginLeft: 5, flex: 1}}>{item.name}</Text>
              )}
            </View>

            <View style={styles.habitOptions}>
              {/* Same with the button */}
              {item.id === editId ? (
                <Button onPress={() => saveEdit()} title="Save" />
              ) : (
                <Button onPress={() => editHabit(item.id, item.name)} title="Edit" />
              )}
              <Ionicons name="remove-circle" size={30} color="red" 
                onPress={() => deleteHabit(item.id)} 
                style={{marginLeft: 5}}/>
            </View>
          </View>
        )}
      />

    {/* Add new todo */}
      <View style={styles.footer}>
        <TextInput placeholder="Add a new habit" style={styles.TextInput} value={habitText} onChangeText={setHabitText} />
        <Ionicons name="add-circle" size={36} color="orange" onPress={() => {createHabit()}} />
        <Ionicons name="refresh" size={36} color="red" onPress={() => {clearHabitCompletion()}} />
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
  habitListItem:
  {
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 10,
  },
  habitItem:
  {
    flex: 1,
    alignItems: "center", 
    padding: 10, 
    backgroundColor: "skyblue",
    flexDirection: "row",
  },
  habitOptions:
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