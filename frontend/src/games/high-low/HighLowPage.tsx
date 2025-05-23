// src/games/high-low/HighLowPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HighLowGameLogic, StartGameCommand, GuessCommand, CashOutCommand, ICommand } from './HighLowCommands';

// Styles (similar to SlotMachinePage, can be refactored into a common style utility if desired)
const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#e9ecef',
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
  color: '#343a40',
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
  marginTop: '30px',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  width: '100%',
  maxWidth: '500px',
};

const numberDisplayStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#007bff',
  margin: '20px 0',
  padding: '10px',
  border: '2px solid #007bff',
  borderRadius: '5px',
  backgroundColor: '#f8f9fa',
};

const scoreStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#28a745',
  marginBottom: '15px',
};

const messageStyle: React.CSSProperties = {
  margin: '20px 0',
  fontSize: '1.1rem',
  color: '#17a2b8',
  minHeight: '60px', // To prevent layout jumps
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
};

const gameButtonStyle: React.CSSProperties = {
  padding: '12px 25px',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  color: 'white',
};

const patternInfoStyle: React.CSSProperties = {
  marginTop: '30px',
  fontSize: '0.9rem',
  color: '#888',
  fontStyle: 'italic',
};


export default function HighLowPage() {
  const navigate = useNavigate();
  // Use a state variable to force re-renders. The commands' uiUpdateCallback will update this.
  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  // Memoize the game logic instance.
  const gameLogic = useMemo(() => new HighLowGameLogic(), []);

  // Function to execute any command
  const executeCommand = (command: ICommand) => {
    command.execute();
  };

  // Create commands when needed, passing the gameLogic and the forceUpdate callback.
  const handleStartGame = () => {
    executeCommand(new StartGameCommand(gameLogic, forceUpdate));
  };

  const handleGuessHigher = () => {
    executeCommand(new GuessCommand(gameLogic, true, forceUpdate));
  };

  const handleGuessLower = () => {
    executeCommand(new GuessCommand(gameLogic, false, forceUpdate));
  };

  const handleCashOut = () => {
    executeCommand(new CashOutCommand(gameLogic, forceUpdate));
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎯High-Low Game🎯</h1>
      </div>
      <button onClick={() => navigate('/home')} style={backButtonStyle}>
            Back to Lobby
          </button>
      <div style={gameAreaStyle}>
        <div style={numberDisplayStyle}>
          {gameLogic.gameOver && !gameLogic.nextNumber ? '?' : gameLogic.currentNumber}
        </div>
        <div style={scoreStyle}>Score: {gameLogic.score}</div>

        {gameLogic.nextNumber !== null && (
          <p style={{fontSize: '1rem', color: '#6c757d'}}>Previous round's next number was: {gameLogic.nextNumber}</p>
        )}

        <div style={messageStyle}>{gameLogic.message}</div>

        {gameLogic.gameOver ? (
          <button
            onClick={handleStartGame}
            style={{ ...gameButtonStyle, backgroundColor: '#17a2b8' }}
          >
            Start New Game
          </button>
        ) : (
          <div style={buttonGroupStyle}>
            <button
              onClick={handleGuessHigher}
              style={{ ...gameButtonStyle, backgroundColor: '#28a745' }}
            >
              Higher ▲
            </button>
            <button
              onClick={handleGuessLower}
              style={{ ...gameButtonStyle, backgroundColor: '#dc3545' }}
            >
              Lower ▼
            </button>
            <button
              onClick={handleCashOut}
              style={{ ...gameButtonStyle, backgroundColor: '#ffc107', color: '#333' }}
            >
              Cash Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}