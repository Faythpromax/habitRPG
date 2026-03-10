import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { usePlayer } from "./contexts/playerContext";

// type RPGProps = {
//   updateEXP: (addEXP: number) => void
//   player: Player
// }


// export default function RPG({ updateEXP, player }: RPGProps) {
export default function RPG() {
  const [addedEXP, setAddedEXP] = useState(0);
  const { player, updateEXP } = usePlayer();

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