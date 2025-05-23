// src/games/blackjack/BlackjackPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlackjackGameManager, IObserver, Card, PlayerHand } from './BlackjackGame'; // Ensure path is correct

// Styles
const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#004d00', // Dark green background for casino feel
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
  color: '#ffd700', // Gold color for title
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
  backgroundColor: '#006400', // Slightly lighter green for game table
  borderRadius: '10px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '800px',
  textAlign: 'center',
};

const handAreaStyle: React.CSSProperties = {
  margin: '20px 0',
  minHeight: '120px', // Space for cards
};

const handTitleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  marginBottom: '10px',
  color: '#fff',
};

const cardsContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap', // Allow cards to wrap on smaller screens
};

const cardStyle: React.CSSProperties = {
  padding: '10px 15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: 'white',
  color: 'black',
  fontSize: '1.5rem',
  minWidth: '60px', // Card width
  height: '90px', // Card height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const hiddenCardStyle: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: '#555', // Dark color for hidden card
  color: '#555', // Hide text
  backgroundImage: 'repeating-linear-gradient(45deg, #666, #666 10px, #555 10px, #555 20px)', // Pattern for back
};


const scoreStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  marginTop: '5px',
  color: '#ffeb3b', // Bright yellow for score
};

const messageStyle: React.CSSProperties = {
  margin: '20px 0',
  fontSize: '1.3rem',
  color: '#fff',
  minHeight: '40px', // Prevent layout jumps
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

const patternInfoStyle: React.CSSProperties = {
  marginTop: '40px',
  fontSize: '0.9rem',
  color: '#ccc',
  fontStyle: 'italic',
};

// Helper function to render a single card
const CardView: React.FC<{ card: Card, isDealerFirstHidden: boolean, index: number }> = ({ card, isDealerFirstHidden, index }) => {
  const displaySuit: {[key: string]: string} = {'♥':'\u2665', '♦':'\u2666', '♣':'\u2663', '♠':'\u2660'};
  const cardColor = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';

  if (isDealerFirstHidden && index === 0) {
    return <div style={hiddenCardStyle}>??</div>;
  }
  return (
    <div style={{...cardStyle, color: cardColor}}>
      <div>{card.rank}</div>
      <div>{displaySuit[card.suit] || card.suit}</div>
    </div>
  );
};

// React Component acts as the Observer
export default function BlackjackPage() {
  const navigate = useNavigate();
  // Initial game data
  const initialGameData = new BlackjackGameManager();
  const [gameData, setGameData] = useState({
    playerHand: initialGameData.playerHand,
    dealerHand: initialGameData.dealerHand,
    playerScore: initialGameData.playerScore,
    displayedDealerScore: initialGameData.displayedDealerScore,
    message: initialGameData.message,
    isPlayerTurn: initialGameData.isPlayerTurn,
    isGameOver: initialGameData.isGameOver,
    showDealerFirstCard: initialGameData.showDealerFirstCard,
  });

  const gameManager = useMemo(() => new BlackjackGameManager(), []);

  useEffect(() => {
    const observer: IObserver = {
      update: (subject: BlackjackGameManager) => {
        setGameData({
          playerHand: [...subject.playerHand],
          dealerHand: [...subject.dealerHand],
          playerScore: subject.playerScore,
          displayedDealerScore: subject.displayedDealerScore,
          message: subject.message,
          isPlayerTurn: subject.isPlayerTurn,
          isGameOver: subject.isGameOver,
          showDealerFirstCard: subject.showDealerFirstCard,
        });
      }
    };

    gameManager.addObserver(observer);
    gameManager.notifyObservers();

    // Cleanup: remove the observer when the component unmounts.
    return () => {
      gameManager.removeObserver(observer);
    };
  }, [gameManager]);

  // Game actions
  const handleDeal = () => gameManager.dealInitial();
  const handleHit = () => gameManager.hit();
  const handleStand = () => gameManager.stand();

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🃏 Blackjack 🃏</h1>
        <button onClick={() => navigate('/home')} style={backButtonStyle}>
          Back to Lobby
        </button>
      </div>

      {/* Game Area*/}
      <div style={gameAreaStyle}>
        {/* Dealer's Hand */}
        <div style={handAreaStyle}>
          <h2 style={handTitleStyle}>Dealer's Hand ({gameData.isGameOver || gameData.showDealerFirstCard ? gameManager.dealerScore : gameData.displayedDealerScore})</h2>
          <div style={cardsContainerStyle}>
            {gameData.dealerHand.map((card, index) => (
              <CardView key={index} card={card} isDealerFirstHidden={!gameData.showDealerFirstCard} index={index} />
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div style={handAreaStyle}>
          <h2 style={handTitleStyle}>Your Hand ({gameData.playerScore})</h2>
          <div style={cardsContainerStyle}>
            {gameData.playerHand.map((card, index) => (
              <CardView key={index} card={card} isDealerFirstHidden={false} index={index}/>
            ))}
          </div>
        </div>

        <div style={messageStyle}>{gameData.message}</div>

        <div style={actionsStyle}>
          {gameData.isGameOver || !gameData.playerHand.length ? (
            <button onClick={handleDeal} style={{ ...gameButtonStyle, backgroundColor: '#007bff' }}>
              Deal New Hand
            </button>
          ) : (
            <>
              <button onClick={handleHit} disabled={!gameData.isPlayerTurn} style={{ ...gameButtonStyle, backgroundColor: '#28a745' }}>
                Hit
              </button>
              <button onClick={handleStand} disabled={!gameData.isPlayerTurn} style={{ ...gameButtonStyle, backgroundColor: '#dc3545' }}>
                Stand
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}