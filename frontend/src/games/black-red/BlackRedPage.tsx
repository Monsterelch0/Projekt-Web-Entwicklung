// src/games/black-red/BlackRedPage.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BlackRedGameLogic,
  mapCardToImageFile,
} from './BlackRedGameLogic';
import {
  StartGameCommand,
  GuessCommand,
  CashOutCommand,
  ICommand,
} from './BlackRedCommands';

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#f1f3f5',
  minHeight: '100vh',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '600px',
  alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
  color: '#212529',
};

const backButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const gameAreaStyle: React.CSSProperties = {
  marginTop: '30px',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  width: '100%',
  maxWidth: '500px',
};

const cardDisplayStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '15px',
};

const scoreStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#28a745',
  marginBottom: '10px',
};

const messageStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#007bff',
  minHeight: '50px',
  marginTop: '20px',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
};

const gameButtonStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  color: 'white',
};

export default function BlackRedPage() {
  const navigate = useNavigate();
  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  const gameLogic = useMemo(() => new BlackRedGameLogic(), []);

  const executeCommand = (command: ICommand) => {
    command.execute();
  };

  const handleStart = () => {
    executeCommand(new StartGameCommand(gameLogic, forceUpdate));
  };

  const handleGuessRed = () => {
    executeCommand(new GuessCommand(gameLogic, true, forceUpdate));
  };

  const handleGuessBlack = () => {
    executeCommand(new GuessCommand(gameLogic, false, forceUpdate));
  };

  const handleCashOut = () => {
    executeCommand(new CashOutCommand(gameLogic, forceUpdate));
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🟥⬛ Black-Red Game ⬛🟥</h1>
        <button onClick={() => navigate('/home')} style={backButtonStyle}>
          Back to Lobby
        </button>
      </div>

      <div style={gameAreaStyle}>
        <div style={scoreStyle}>Score: {gameLogic.score}</div>

        <div style={cardDisplayStyle}>
          {gameLogic.revealedCards.map((card, index) => (
            <img
              key={index}
              src={mapCardToImageFile(card)}
              alt={card}
              style={{ width: '70px', borderRadius: '5px' }}
            />
          ))}
        </div>

        <div style={messageStyle}>{gameLogic.message}</div>

        {gameLogic.gameOver ? (
          <button
            onClick={handleStart}
            style={{ ...gameButtonStyle, backgroundColor: '#17a2b8' }}
          >
            Start New Game
          </button>
        ) : (
          <div style={buttonGroupStyle}>
            <button
              onClick={handleGuessRed}
              style={{ ...gameButtonStyle, backgroundColor: '#dc3545' }}
            >
              Red ♥♦
            </button>
            <button
              onClick={handleGuessBlack}
              style={{ ...gameButtonStyle, backgroundColor: '#343a40' }}
            >
              Black ♠♣
            </button>
            <button
              onClick={handleCashOut}
              style={{ ...gameButtonStyle, backgroundColor: '#ffc107', color: '#212529' }}
            >
              Cash Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
