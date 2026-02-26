import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("./todo")}>
        <Text style={styles.button}>Todo</Text>
      </Pressable>

      <Pressable onPress={() => router.push("./rpg")}>
        <Text style={styles.button}>RPG</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
  },
});
