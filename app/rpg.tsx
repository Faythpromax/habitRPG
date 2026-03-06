import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Player } from "./types/player";

// export default function RPG({ updateEXP }: { updateEXP: (addEXP: number) => void }) {
export default function RPG({updateEXP, player}: {updateEXP: (addEXP: number) => void, player: Player}) {
  // const [player, setPlayer] = useState<Player>({
  //   EXP: 0, 
  //   level: 1, 
  //   health: 100,
  //   mana: 50
  // });
  
  const [addedEXP, setAddedEXP] = useState(0);

  useEffect(() => {
    const loadPlayer= async () => {
      const loadData = await loadPlayerData();
      if (loadData != null) {
        setPlayer(loadData);
      }
    }
    loadPlayer();
  }, []);

  // For now updateEXP when pressing a button
  // function updateEXP(addEXP: number) {
  //   if (addEXP < 0) return;

  //   setPlayer(prev => {
  //     const totalEXP = prev.EXP + addEXP;
  //     const newLevel = prev.level + Math.floor(totalEXP / 100); // Level up for every 100 EXP
  //     const newEXP = totalEXP % 100; // Remainder EXP after leveling up

  //     const newPlayer = {...prev, EXP: newEXP, level: newLevel};

  //     savePlayerData(newPlayer);
  //     return newPlayer;
  //   });
  // }

  return (
    <View style = {style.container}>
      <Text style={style.stats}>EXP: {player.EXP}</Text>
      <Text style={style.stats}>Level: {player.level}</Text>
      <Text style={style.stats}>Health: {player.health}</Text>
      <Text style={style.stats}>Mana: {player.mana}</Text>
      <TextInput value={addedEXP.toString()} onChangeText={(text) => setAddedEXP(Number(text))} style={{color: "red", fontSize: 20}}/>
      <Ionicons name="add-circle" size={48} color="turquoise" onPress={() => {updateEXP(Number(addedEXP))}} />
    </View>
  )
}

async function loadPlayerData() {
  // Load player data from AsyncStorage
    try {
      const stored = await AsyncStorage.getItem("playerData");
      if (stored != null) {
        return JSON.parse(stored) as Player;
      }
      return {
        EXP: 0,
        level: 1,
        health: 100,
        mana: 50,
      };
    } catch (error) {
      console.error("Error loading player data", error);
    }
  }

async function savePlayerData(player: Player) {
  // Save player data to AsyncStorage
    try {
      await AsyncStorage.setItem("playerData", JSON.stringify(player));
    }
    catch (error) {
      console.error("Error saving player data", error);
    }
  }

const style = StyleSheet.create({
  container:
  {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stats:
  {
    fontSize: 20,
    padding: 10
  }
});