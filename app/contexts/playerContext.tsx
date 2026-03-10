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