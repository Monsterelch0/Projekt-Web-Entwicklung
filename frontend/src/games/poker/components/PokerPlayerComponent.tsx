// src/games/poker/components/PokerPlayerComponent.tsx
import React from 'react';
// Stelle sicher, dass CardDto hier importiert wird, da wir card.displayName prüfen
import type { PlayerDto, CardDto } from '../../../types'; 
import PokerCardComponent from './PokerCardComponent';

interface PokerPlayerProps {
    player: PlayerDto;
}

// Definiere einen Style für die Kartenrückseite,
// damit sie ähnliche Abmessungen und Aussehen wie die Vorderseiten hat.
const cardBackStyle: React.CSSProperties = {
    width: '75px',  // Sollte zur Breite in PokerCardComponent passen
    height: '105px', // Sollte zur Höhe in PokerCardComponent passen
    margin: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #aaa',       // Ähnlicher Rand wie Vorderseite
    borderRadius: '4px',            // Ähnliche Rundung wie Vorderseite
    boxShadow: '1px 1px 3px rgba(0,0,0,0.2)', // Ähnlicher Schatten
    // backgroundColor: '#888', // Optionaler Hintergrund, falls Bild nicht lädt
};

const PokerPlayerComponent: React.FC<PokerPlayerProps> = ({ player }) => {
    return (
        <div style={{
            border: '2px solid green',
            padding: '15px',
            margin: '10px',
            borderRadius: '8px',
            backgroundColor: '#f0fff0'
        }}>
            <h3>{player.id} {player.isAI ? "(KI)" : ""}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '120px' /* Platz für Karten */ }}>
                {player.hand.map((card, index) => (
                    // Prüfe, ob die Karte eine verdeckte KI-Karte ist
                    card.displayName === "BACK" 
                    ? (
                        // Wenn ja, zeige das Bild der Kartenrückseite an
                        <div key={`${player.id}-back-${index}`} style={cardBackStyle}>
                            <img 
                                src="/images/cards/back.png" // Pfad zu deiner Kartenrückseite
                                alt="Karte verdeckt" 
                                style={{ 
                                    width: '200%', 
                                    height: '200%', 
                                    objectFit: 'contain', // Stellt sicher, dass das Bild passt
                                    borderRadius: '4px'   // Damit das Bild die Rundung des Containers übernimmt
                                }} 
                            />
                        </div>
                    )
                    : (
                        // Ansonsten zeige die normale PokerCardComponent für die Vorderseite an
                        <PokerCardComponent 
                            key={`${player.id}-card-${card.displayName}-${index}`} 
                            card={card} 
                        />
                    )
                ))}
            </div>
            {/* Chips sind aktuell nicht im Fokus, können aber angezeigt werden */}
            {/* <p>Chips: {player.chips}</p> */}
        </div>
    );
};

export default PokerPlayerComponent;