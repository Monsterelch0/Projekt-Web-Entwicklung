// src/games/slots/SlotMachinePage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlotMachineGame } from './SlotMachineStates'; // Ensure this path is correct

// Style for the Slot Machine Page
const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#f0f0f0',
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
  color: '#333',
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
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

const reelsContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  margin: '20px 0',
  padding: '10px',
  border: '2px solid #333',
  borderRadius: '5px',
  backgroundColor: '#ddd',
};

const reelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
};

const symbolStyle: React.CSSProperties = {
  fontSize: '2rem',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#fff',
  minWidth: '50px', 
  textAlign: 'center',
};

const spinButtonStyle: React.CSSProperties = {
  padding: '15px 30px',
  fontSize: '1.2rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
  marginBottom: '20px',
};

const messageStyle: React.CSSProperties = {
  marginTop: '20px',
  fontSize: '1.1rem',
  color: '#555',
  minHeight: '30px', 
};

// SlotMachinePage Component
export default function SlotMachinePage() {
  const navigate = useNavigate();
  
  const [, setForceUpdate] = useState({});

  const game = useMemo(() => new SlotMachineGame(() => {
    setForceUpdate({}); 
  }), []);

  
  useEffect(() => {
    game.updateUI();
  }, [game]);

  const handleSpin = () => {
    game.spin();
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎰 Slot Machine 🎰</h1>
      </div>
        <button onClick={() => navigate('/home')} style={backButtonStyle}>
          Back to Lobby
        </button>
      <div style={gameAreaStyle}>
        <div style={reelsContainerStyle}>
          {game.reels.map((reel, reelIndex) => (
            <div key={reelIndex} style={reelStyle}>
              {reel.map((symbol, symbolIndex) => (
                <span key={symbolIndex} style={symbolStyle}>{symbol}</span>
              ))}
            </div>
          ))}
        </div>

        <button onClick={handleSpin} style={spinButtonStyle}>
          {game.getCurrentStateName() === 'Spinning' ? 'Spinning...' : 'Spin'}
        </button>

        <div style={messageStyle}>
          <p><strong>Status:</strong> {game.getCurrentStateName()}</p>
          <p>{game.message}</p>
        </div>
      </div>
    </div>
  );
}