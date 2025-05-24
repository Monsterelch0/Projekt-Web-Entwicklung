// src/components/HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type GameModule = {
  id: string;
  name: string;
  icon: string;
};

export default function HomePage() {
  const [credits, setCredits] = useState(1000); // Beispielstartwert
  const [games, setGames] = useState<GameModule[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const availableGames = GameFactory.createAvailableGames();
    setGames(availableGames);
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        💰 Credits: {credits}
      </div>
      <h1>Welcome</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {games.map((game) => (
          <button key={game.id} onClick={() => navigate(`/game/${game.id}`)}
            style={{padding: '10px 20px', fontSize: '1rem', cursor: 'pointer'}}
          >
            {game.icon} {game.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// === Factory Pattern ===
class GameFactory {
  static createAvailableGames(): GameModule[] {
    return [
      { id: 'slots', name: 'Slot Machine', icon: '🎰' },
      { id: 'high-low', name: 'High-Low', icon: '🎯' },
      { id: 'blackjack', name: 'Blackjack', icon: '🃏' },
      { id: 'roulette', name: 'Roulette', icon: '🎡' },
      { id: 'poker', name: 'Poker', icon: '♠️' },      
      { id: 'craps', name: 'Craps', icon: '🎲' },
      { id: 'horse', name: 'Horse Racing', icon: '🐎' }
    ];
  }
}