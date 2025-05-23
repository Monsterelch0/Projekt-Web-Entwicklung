// src/games/poker/PokerGamePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { pokerGameService } from '../poker/PokerGameService'; // Pfad zum PokerGameService
import type { GameStateDto } from '../../types'; // Pfad zur globalen types.ts
import PokerPlayerComponent from './components/PokerPlayerComponent';
import PokerCardComponent from './components/PokerCardComponent';
import './Poker.css'; // Import the CSS file

// const buttonStyle is removed as styles are now in Poker.css

const PokerGamePage: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<GameStateDto | null>(pokerGameService.getGameState());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGameStateUpdate = useCallback((newState: GameStateDto | null) => {
        setGameState(newState);
        setIsLoading(false);
        if (newState === null && pokerGameService.getGameState() === null) {
            //setError handling is done in service call catch blocks
        }
    }, []);

    useEffect(() => {
        const unsubscribe = pokerGameService.subscribe(handleGameStateUpdate);
        return () => {
            unsubscribe();
        };
    }, [handleGameStateUpdate]);

    const handleStartGame = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await pokerGameService.startOfflineGame("Human", 1);
        } catch (e: any) {
            setError(e.message || "Spiel konnte nicht gestartet werden. Backend erreichbar?");
            console.error("Fehler in handleStartGame:", e);
        }
    };

    const handleNextPhase = async () => {
        if (gameState && gameState.gameId && gameState.currentGamePhase !== "Showdown" && gameState.currentGamePhase !== "Lobby") {
            setIsLoading(true);
            setError(null);
            try {
                await pokerGameService.advanceGamePhase(gameState.gameId);
            } catch (e: any) {
                setError(e.message || "Phase konnte nicht fortgesetzt werden.");
                console.error("Fehler in handleNextPhase:", e);
            }
        }
    };

    if (isLoading) {
        return <p className="poker-loading-text">Spiel wird geladen...</p>;
    }

    if (error && !gameState) {
        return (
            <div className="poker-error-container">
                <p className="poker-error-message">Fehler: {error}</p>
                <button onClick={handleStartGame} className="poker-button">Erneut versuchen</button>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="poker-welcome-container">
                <h1>Willkommen zum Poker!</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="poker-button poker-button-large-font poker-button-float-right poker-button-margin-right"
                >
                    Back to Lobby
                </button>
                <button
                    onClick={handleStartGame}
                    disabled={isLoading}
                    className="poker-button poker-button-large-font"
                >
                    Offline Spiel starten
                </button>
            </div>
        );
    }

    let nextPhaseButtonText = "Nächste Phase";
    if (gameState.currentGamePhase === "PreFlop") nextPhaseButtonText = "Flop zeigen";
    else if (gameState.currentGamePhase === "Flop") nextPhaseButtonText = "Turn zeigen";
    else if (gameState.currentGamePhase === "Turn") nextPhaseButtonText = "River zeigen";
    else if (gameState.currentGamePhase === "River") nextPhaseButtonText = "Zum Showdown";

    return (
        <div className="poker-game-page-container">
            <h1 className="poker-table-title">Pokertisch (ID: {gameState.gameId})</h1>
            <div className="poker-actions-bar">
                <button
                    onClick={handleStartGame}
                    disabled={isLoading}
                    className="poker-button poker-button-margin-right"
                >
                    Neues Spiel starten
                </button>

                {gameState.currentGamePhase !== "Showdown" &&
                 gameState.currentGamePhase !== "Lobby" &&
                 gameState.players.length > 0 && (
                    <button
                        onClick={handleNextPhase}
                        disabled={isLoading}
                        className="poker-button poker-button-warning"
                    >
                        {nextPhaseButtonText}
                    </button>
                )}
            </div>

            <div className="poker-community-cards-section">
                <h2 className="poker-section-title">Community Cards</h2>
                {gameState.communityCards.length === 0 && <p className="poker-community-cards-empty-text">(Noch keine Community Cards)</p>}
                <div className="poker-community-cards-container">
                    {gameState.communityCards.map((card, index) => (
                        <PokerCardComponent key={`community-card-${card.displayName}-${index}`} card={card} />
                    ))}
                </div>
            </div>

            <h2 className="poker-players-title">Spieler</h2>
            <div className="poker-players-list">
                {gameState.players.map(player => (
                    <PokerPlayerComponent key={player.id} player={player} />
                ))}
            </div>

            <div className="poker-game-info-box">
                <p><strong>Spielphase:</strong> {gameState.currentGamePhase}</p>
                {/* <p><strong>Pot:</strong> {gameState.pot}</p> */}
                {/* <p><strong>Am Zug:</strong> {gameState.currentPlayerTurnId || "Niemand"}</p> */}
            </div>
        </div>
    );
};

export default PokerGamePage;