// src/games/roulette/RoulettePage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouletteGame, RouletteNumber } from './RouletteGame';
import { IBettingStrategy, BetOnRedStrategy, BetOnEvenStrategy, BetOnSpecificNumberStrategy, IBet } from './BettingStrategies';

// Basic styling
const pageStyle: React.CSSProperties = { padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' };
const wheelStyle: React.CSSProperties = {
  width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#222', color: 'white',
  display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px auto', fontSize: '2em',
  border: '5px solid #888'
};
const buttonStyle: React.CSSProperties = { margin: '5px', padding: '10px 15px', cursor: 'pointer' };
const selectStyle: React.CSSProperties = { margin: '10px', padding: '8px' };

export default function RoulettePage() {
  const navigate = useNavigate();
  const game = useMemo(() => new RouletteGame(), []);
  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  const availableStrategies: IBettingStrategy[] = useMemo(() => [
    new BetOnRedStrategy(),
    new BetOnEvenStrategy(),
    new BetOnSpecificNumberStrategy(),
  ], []);

  const [selectedStrategy, setSelectedStrategy] = useState<IBettingStrategy>(availableStrategies[0]);

  useEffect(() => { // Initial message sync
    forceUpdate();
  }, [game]);

  const handleStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const strategyName = event.target.value;
    setSelectedStrategy(availableStrategies.find(s => s.name === strategyName) || availableStrategies[0]);
  };

  const handlePlaceBets = () => {
    const betsToPlace = selectedStrategy.generateBets(game.balance, game.minBetAmount);
    game.placeBets(betsToPlace);
    forceUpdate();
  };

  const handleSpin = () => {
    game.spinWheel();
    forceUpdate();
  };
  
  // This component demonstrates the Strategy Pattern.
  // Different betting strategies (IBettingStrategy) can be selected and applied.
  // The RouletteGame (Context) uses the chosen strategy to determine bets.

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate('/home')} style={{ ...buttonStyle, float: 'right' }}>Back to Lobby</button>
      <h1>🎡 Roulette 🎡</h1>
      <p>Balance: ${game.balance}</p>
      <p style={{minHeight: '40px'}}>{game.message}</p>

      <div style={wheelStyle}>
        {game.lastResult ? `${game.lastResult.value}` : '?'}
      </div>
      {game.lastResult && <p>Color: <span style={{color: game.lastResult.color, fontWeight: 'bold'}}>{game.lastResult.color.toUpperCase()}</span></p>}


      <div>
        <h3>Choose Betting Strategy:</h3>
        <select value={selectedStrategy.name} onChange={handleStrategyChange} style={selectStyle}>
          {availableStrategies.map(s => <option key={s.name} value={s.name}>{s.name} - {s.description}</option>)}
        </select>
      </div>
      
      {game.currentBets.length > 0 && <div><strong>Current Bets:</strong> {game.currentBets.map(b => b.displayName || `${b.type} on ${b.target} (${b.amount})`).join(', ')}</div>}

      <button onClick={handlePlaceBets} disabled={game.currentBets.length > 0} style={buttonStyle}>
        Apply Strategy & Place Bets
      </button>
      <button onClick={handleSpin} disabled={game.currentBets.length === 0} style={buttonStyle}>
        Spin Wheel
      </button>
      <p style={{marginTop: '20px', fontSize: '0.9em', fontStyle: 'italic'}}>
        Uses <strong>Strategy Pattern</strong> for different betting approaches.
      </p>
    </div>
  );
}