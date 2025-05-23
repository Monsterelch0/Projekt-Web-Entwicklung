// src/games/poker/PokerGamePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { pokerGameService } from '../poker/PokerGameService'; // Pfad zum PokerGameService
import type { GameStateDto } from '../../types'; // Pfad zur globalen types.ts
import PokerPlayerComponent from './components/PokerPlayerComponent';
import PokerCardComponent from './components/PokerCardComponent';

const PokerGamePage: React.FC = () => {
    const [gameState, setGameState] = useState<GameStateDto | null>(pokerGameService.getGameState());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGameStateUpdate = useCallback((newState: GameStateDto | null) => {
        setGameState(newState);
        setIsLoading(false); // Ladezustand beenden, egal ob Erfolg oder Fehler im Service (Service setzt gameState auf null)
        if (newState === null && pokerGameService.getGameState() === null) {
            // Diese Bedingung ist etwas redundant, da setError in den Handler-Funktionen gesetzt wird.
            // Man könnte hier spezifische Logik einbauen, falls ein Update null liefert, obwohl kein expliziter Fehler geworfen wurde.
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
            // Beispiel: Starte mit "Human" und hier z.B. 1 KI Gegner für einfachere Tests
            await pokerGameService.startOfflineGame("Human", 1); 
        } catch (e: any) {
            setError(e.message || "Spiel konnte nicht gestartet werden. Backend erreichbar?");
            console.error("Fehler in handleStartGame:", e);
            // setIsLoading wird durch handleGameStateUpdate (das auch bei Fehler null setzt) zurückgesetzt,
            // da der Service im Fehlerfall gameState auf null setzt und notify() aufruft.
        }
    };

    // NEUE FUNKTION: handleNextPhase
    const handleNextPhase = async () => {
        if (gameState && gameState.gameId && gameState.currentGamePhase !== "Showdown" && gameState.currentGamePhase !== "Lobby") {
            setIsLoading(true);
            setError(null);
            try {
                await pokerGameService.advanceGamePhase(gameState.gameId);
            } catch (e: any) {
                setError(e.message || "Phase konnte nicht fortgesetzt werden.");
                console.error("Fehler in handleNextPhase:", e);
                // setIsLoading wird durch handleGameStateUpdate (das auch bei Fehler aufgerufen wird) zurückgesetzt
            }
        }
    };
    
    if (isLoading) {
        return <p style={{ padding: '20px', textAlign: 'center' }}>Spiel wird geladen...</p>;
    }

    if (error && !gameState) { // Zeige Fehler nur, wenn kein gültiger Spielzustand vorhanden ist
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{color: 'red'}}>Fehler: {error}</p>
                <button onClick={handleStartGame} style={{padding: '10px 20px'}}>Erneut versuchen</button>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Willkommen zum Poker!</h1>
                <button onClick={handleStartGame} disabled={isLoading} style={{padding: '10px 20px', fontSize: '18px'}}>
                    Offline Spiel starten
                </button>
            </div>
        );
    }

    // Logik für den Button-Text der nächsten Phase
    let nextPhaseButtonText = "Nächste Phase";
    if (gameState.currentGamePhase === "PreFlop") nextPhaseButtonText = "Flop zeigen";
    else if (gameState.currentGamePhase === "Flop") nextPhaseButtonText = "Turn zeigen";
    else if (gameState.currentGamePhase === "Turn") nextPhaseButtonText = "River zeigen";
    else if (gameState.currentGamePhase === "River") nextPhaseButtonText = "Zum Showdown";

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{textAlign: 'center', color: '#ffd700'}}>Pokertisch (ID: {gameState.gameId})</h1>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <button onClick={handleStartGame} disabled={isLoading} style={{padding: '10px 20px', fontSize: '16px', marginRight: '10px'}}>
                    Neues Spiel starten
                </button>
                
                {/* NEUER BUTTON FÜR NÄCHSTE PHASE (konditional gerendert) */}
                {gameState.currentGamePhase !== "Showdown" && 
                 gameState.currentGamePhase !== "Lobby" && 
                 gameState.players.length > 0 && (
                    <button 
                        onClick={handleNextPhase} 
                        disabled={isLoading} 
                        style={{padding: '10px 20px', fontSize: '16px', backgroundColor: '#ffc107'}}
                    >
                        {nextPhaseButtonText}
                    </button>
                )}
            </div>
            
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#335533' }}>
                <h2 style={{textAlign: 'center', color: 'white'}}>Community Cards</h2>
                {gameState.communityCards.length === 0 && <p style={{textAlign: 'center', color: 'lightgrey'}}>(Noch keine Community Cards)</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '120px', justifyContent: 'center', alignItems: 'center' }}>
                    {gameState.communityCards.map((card, index) => (
                        <PokerCardComponent key={`community-card-${card.displayName}-${index}`} card={card} />
                    ))}
                </div>
            </div>

            <h2 style={{textAlign: 'center', color: 'white'}}>Spieler</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {gameState.players.map(player => (
                    <PokerPlayerComponent key={player.id} player={player} />
                ))}
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#eee', borderRadius: '5px', textAlign: 'center' }}>
                <p><strong>Spielphase:</strong> {gameState.currentGamePhase}</p>
                {/* <p><strong>Pot:</strong> {gameState.pot}</p> */}
                {/* <p><strong>Am Zug:</strong> {gameState.currentPlayerTurnId || "Niemand"}</p> */}
            </div>
        </div>
    );
};

export default PokerGamePage;