import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import RPG from '../screens/rpg';
import { Player } from '../types/player';

export default function Index() {
  const [player, setPlayer] = useState<Player>({
    EXP: 0,
    level: 1,
    health: 100,
    mana: 50
  });
  
  async function savePlayerData(player: Player) {
    // Save player data to AsyncStorage
      try {
        await AsyncStorage.setItem("playerData", JSON.stringify(player));
      }
      catch (error) {
        console.error("Error saving player data", error);
      }
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

  function updateEXP(addEXP: number) {
    if (addEXP < 0) return;

    setPlayer(prev => {
      const totalEXP = prev.EXP + addEXP;
      const newLevel = prev.level + Math.floor(totalEXP / 100); // Level up for every 100 EXP
      const newEXP = totalEXP % 100; // Remainder EXP after leveling up

      const newPlayer = {...prev, EXP: newEXP, level: newLevel};

      savePlayerData(newPlayer);
      return newPlayer;
    });
  }
  
    useEffect(() => {
    const loadPlayer= async () => {
      const loadData = await loadPlayerData();
      if (loadData != null) {
        setPlayer(loadData);
      }
    }
    loadPlayer();
    }, []);
  
  return (
  <>
      {/* <RPG updateEXP={updateEXP} /> */}
      {/* <RPG player={player} /> */}
      <RPG updateEXP={updateEXP} player={player} />
  </>
  );
}