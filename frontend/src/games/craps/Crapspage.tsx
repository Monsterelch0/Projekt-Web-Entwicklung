import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrapsGameManager, IObserver } from './CrapsGame';

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#004d00',
  color: 'white',
  minHeight: '100vh',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '800px',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  color: '#ffd700',
};

const backButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  textDecoration: 'none',
};

const gameAreaStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#006400',
  borderRadius: '10px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '800px',
  textAlign: 'center',
};

const diceStyle: React.CSSProperties = {
  fontSize: '4rem',
  margin: '10px',
};

const messageStyle: React.CSSProperties = {
  margin: '20px 0',
  fontSize: '1.3rem',
  color: '#fff',
  minHeight: '40px',
  fontWeight: 'bold',
};

const actionsStyle: React.CSSProperties = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
};

const gameButtonStyle: React.CSSProperties = {
  padding: '12px 25px',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  color: 'white',
  fontWeight: 'bold',
};

export default function CrapsPage() {
  const navigate = useNavigate();
  const gameManager = useMemo(() => new CrapsGameManager(), []);
  const [gameState, setGameState] = useState(gameManager.getState());

  useEffect(() => {
    const observer: IObserver = {
      update: () => setGameState(gameManager.getState()),
    };

    gameManager.addObserver(observer);
    gameManager.notifyObservers();

    return () => {
      gameManager.removeObserver(observer);
    };
  }, [gameManager]);

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎲 Craps 🎲</h1>
        <button onClick={() => navigate('/home')} style={backButtonStyle}>Back to Lobby</button>
      </div>

      <div style={gameAreaStyle}>
        <div style={diceStyle}>🎲 {gameState.dice.join(' 🎲 ')} 🎲</div>
        <div style={messageStyle}>{gameState.message}</div>

        <div style={actionsStyle}>
          <button onClick={() => gameManager.rollDice()} style={{ ...gameButtonStyle, backgroundColor: '#007bff' }}>
            Roll Dice
          </button>
          <button onClick={() => gameManager.resetGame()} style={{ ...gameButtonStyle, backgroundColor: '#6c757d' }}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
