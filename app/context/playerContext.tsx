import { useState } from 'react';
import RPG from '../rpg';
import { Player } from '../types/player';

export default function Index() {
  const [player, setPlayer] = useState<Player>({
    EXP: 0,
    level: 1,
    health: 100,
    mana: 50
  });

  function updateEXP(addEXP: number) {
    if (addEXP < 0) return;

    setPlayer(prev => {
      const totalEXP = prev.EXP + addEXP;
      const newLevel = prev.level + Math.floor(totalEXP / 100); // Level up for every 100 EXP
      const newEXP = totalEXP % 100; // Remainder EXP after leveling up

      const newPlayer = {...prev, EXP: newEXP, level: newLevel};

      // savePlayerData(newPlayer);
      return newPlayer;
    });
  }
  
  return (
  <>
      <RPG updateEXP={updateEXP} />
      <RPG player={player} />
  </>
  );
}