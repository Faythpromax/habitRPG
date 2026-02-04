import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Player = {
    EXP: number;
    level: number;
    health: number;
    mana: number;
}
export default function RPG() {
  const [player, setPlayer] = useState<Player>({
    EXP: 0, 
    level: 1, 
    health: 100,
    mana: 50
  });
  const [EXP, setEXP] = useState(player.EXP.toString());

  const playerNewEXP = async (newEXP: string) => {
    setPlayer((prev) => ({... prev, EXP: Number(newEXP)}));
    const newPlayer = {...player, EXP: Number(newEXP)};
    savePlayerData(newPlayer);
  };

  return (
    <View style = {style.container}>
      <Text style={style.stats}>EXP: {player.EXP}</Text>
      <Text style={style.stats}>Level: {player.level}</Text>
      <Text style={style.stats}>Health: {player.health}</Text>
      <Text style={style.stats}>Mana: {player.mana}</Text>
      <TextInput value={EXP} onChangeText={setEXP} style={{color: "red", fontSize: 20}}/>
      <Ionicons name="add-circle" size={48} color="turquoise" onPress={() => {playerNewEXP(EXP)}} />
    </View>
  )
}

async function loadPlayerData() {
  // Load player data from AsyncStorage
    try {
      const stored = await AsyncStorage.getItem("playerData");
      if (stored) {
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

export async function savePlayerData(player: Player) {
  // Save player data to AsyncStorage
    try {
      await AsyncStorage.setItem("playerData", JSON.stringify(player));
    }
    catch (error) {
      console.error("Error saving player data", error);
    }
  }

export function updateEXP(newEXP: number) {
  // Update player EXP with todo later
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