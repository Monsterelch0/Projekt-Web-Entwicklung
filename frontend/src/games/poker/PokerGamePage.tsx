// src/games/poker/PokerGamePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Du hast dies hinzugefügt
import { pokerGameService } from '../poker/PokerGameService';
import type { GameStateDto } from '../../types';
import PokerPlayerComponent from './components/PokerPlayerComponent';
import PokerCardComponent from './components/PokerCardComponent';
import './Poker.css'; // Import the CSS file

const PokerGamePage: React.FC = () => {
    const navigate = useNavigate(); // useNavigate ist jetzt hier
    const [gameState, setGameState] = useState<GameStateDto | null>(pokerGameService.getGameState());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGameStateUpdate = useCallback((newState: GameStateDto | null) => {
        setGameState(newState);
        setIsLoading(false);
        // if (newState === null && pokerGameService.getGameState() === null) {
        //     // Error handling done in service call catch blocks or by checking error state
        // }
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
            await pokerGameService.startOfflineGame("Human", 1); // Habe auf 1 KI Gegner reduziert für einfachere Tests
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

    if (isLoading && !gameState) { // Zeige Ladeindikator nur, wenn noch kein gameState vorhanden ist
        return <p className="poker-loading-text">Spiel wird geladen...</p>;
    }

    if (error && !gameState) {
        return (
            <div className="poker-error-container">
                <p className="poker-error-message">Fehler: {error}</p>
                <button onClick={handleStartGame} className="poker-button">Erneut versuchen</button>
                <button onClick={() => navigate('/home')} className="poker-button poker-button-secondary" style={{marginLeft: '10px'}}>
                    Zurück zur Lobby
                </button>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="poker-welcome-container">
                <h1>Willkommen zum Poker!</h1>
                <div style={{marginTop: '20px'}}>
                    <button
                        onClick={handleStartGame}
                        disabled={isLoading}
                        className="poker-button poker-button-large-font poker-button-primary" // Primärer Aktionsbutton
                        style={{marginRight: '10px'}}
                    >
                        CPU Spiel starten
                    </button>
                    <button
                        onClick={() => navigate('/home')} // Navigiert zur Home-Seite
                        className="poker-button poker-button-large-font poker-button-secondary"
                    >
                        Zurück zur Lobby
                    </button>
                </div>
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
                        className="poker-button poker-button-warning" // 'Warning' für Aktionsbutton
                    >
                        {isLoading && gameState.currentGamePhase !== "Lobby" ? 'Lade...' : nextPhaseButtonText}
                    </button>
                )}
                 <button 
                    onClick={() => navigate('/home')} 
                    className="poker-button poker-button-secondary poker-button-float-right"
                    style={{marginLeft: 'auto'}} // Um ihn nach rechts zu schieben
                >
                    Zurück zur Lobby
                </button>
            </div>

            {/* === NEU: ANZEIGE DER GEWINNERINFORMATIONEN === */}
            {gameState.currentGamePhase === "Showdown" && gameState.winningHandDescription && (
                <div className="poker-showdown-info-box"> {/* Eigene Klasse für Styling */}
                    <h2 className="poker-showdown-title">🏆 Showdown! 🏆</h2>
                    <p className="poker-winning-hand-text">{gameState.winningHandDescription}</p>
                    {gameState.winnerIds && gameState.winnerIds.length > 0 && (
                        <p className="poker-winners-text">
                            <strong>Gewinner:</strong> {gameState.winnerIds.join(', ')}
                        </p>
                    )}
                </div>
            )}

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
            </div>
        </div>
    );
};

export default PokerGamePage;