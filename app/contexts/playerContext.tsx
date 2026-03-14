import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Player } from '../types/player';

type PlayerContextType = {
  player: Player;
  updateEXP: (addEXP: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    EXP: 0,
    level: 1,
    capEXP: 100,
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
        capEXP: 100,
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
      let totalEXP = prev.EXP + addEXP;
      let level = prev.level;
      let capEXP = prev.capEXP;
      let health = prev.health;
      let mana = prev.mana;

      while (totalEXP >= capEXP) {
        totalEXP -= capEXP;
        level = level + 1;
        capEXP = Math.floor(capEXP * 1.1); // Increase capEXP by 10% for each level up
        health = Math.floor(health * 1.15); // Increase health by 15% for each level up
        mana = Math.floor(mana * 1.15); // Increase mana by 15% for each level up
      }

      const newPlayer = {...prev, EXP: totalEXP, level: level, capEXP: capEXP, health: health, mana: mana};
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
    <PlayerContext.Provider value={{ player, updateEXP }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  
  return context;
}