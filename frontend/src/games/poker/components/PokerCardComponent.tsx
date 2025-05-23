// src/games/poker/components/PokerCardComponent.tsx
import React from 'react';
import type { CardDto } from '../../../types'; // Pfad zu deiner globalen types.ts

interface PokerCardProps {
    card: CardDto;
}

// Definiert die Standard-Dimensionen und den Rand für eine einzelne Karte.
// Diese Konstante wird exportiert, damit andere Komponenten (z.B. für Kartenrücken)
// dieselben Dimensionen verwenden können, um Einheitlichkeit zu gewährleisten.
export const pokerCardDimensions = {
    width: '10%',
    height: '10%',
    margin: '5px',
};

const PokerCardComponent: React.FC<PokerCardProps> = ({ card }) => {
    // Hilfsfunktion für die Umwandlung des Rangs in den Dateinamen-Teil
    const mapRankToFilenamePart = (rank: string): string => {
        const rankLower = rank.toLowerCase();
        switch (rankLower) {
            case 'ace': return 'ace';
            case 'king': return 'king';
            case 'queen': return 'queen';
            case 'jack': return 'jack';
            case 'ten': return '10';
            case 'nine': return '9';
            case 'eight': return '8';
            case 'seven': return '7';
            case 'six': return '6';
            case 'five': return '5';
            case 'four': return '4';
            case 'three': return '3';
            case 'two': return '2';
            default: return rankLower; // Fallback
        }
    };

    // Hilfsfunktion für die Umwandlung der Farbe (Suit) in den Dateinamen-Teil
    const mapSuitToFilenamePart = (suit: string): string => {
        return suit.toLowerCase(); // z.B. "Hearts" -> "hearts"
    };

    const rankFilenamePart = mapRankToFilenamePart(card.rank);
    const suitFilenamePart = mapSuitToFilenamePart(card.suit);

    // Dateinamen zusammensetzen (z.B. ace_of_clubs.png)
    const imageFilename = `${rankFilenamePart}_of_${suitFilenamePart}.png`;
    // Pfad zu den Bildern im public-Ordner
    const imagePath = `/images/cards/${imageFilename}`;

    return (
        // Das Haupt-Div verwendet jetzt pokerCardDimensions für seine Größe und seinen Rand
        <div style={{
            ...pokerCardDimensions, // Hier werden width, height und margin direkt übernommen
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // Optional: Zusätzliche Styles für den Container, falls benötigt
            // backgroundColor: '#f0f0f0', // Leichter Hintergrund, falls Bild langsam lädt
        }}>
            <img
                src={imagePath}
                alt={`${card.rank} of ${card.suit}`} // Wichtig für Barrierefreiheit
                style={{
                    width: '100%', // Bild füllt den Container in der Breite
                    height: '100%',// Bild füllt den Container in der Höhe
                    objectFit: 'contain', // Behält das Seitenverhältnis des Bildes bei
                    border: '1px solid #aaa', // Dezenter Rand um das Bild
                    borderRadius: '4px',     // Abgerundete Ecken für das Bild
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.2)' // Leichter Schatten
                }}
                onError={(e) => {
                    // Fallback, falls das Bild nicht geladen werden kann
                    (e.target as HTMLImageElement).alt = `Bild für ${card.rank} of ${card.suit} (${imageFilename}) nicht gefunden.`;
                    // Optional: Logge den Fehler oder zeige ein Standard-Rückseitenbild an
                    // (e.target as HTMLImageElement).src = '/images/cards/card_back.png'; 
                    console.warn(`Konnte Bild nicht laden: ${imagePath}`);
                }}
            />
        </div>
    );
};

export default PokerCardComponent;