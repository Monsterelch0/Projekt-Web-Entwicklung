// src/types.ts

// Basierend auf deinen Backend CardDto
export interface CardDto {
    suit: string;
    rank: string;
    displayName: string;
}

// Basierend auf deinen Backend PlayerDto
export interface PlayerDto {
    id: string;
    hand: CardDto[];
    chips: number;
    isActive: boolean;
    isAI?: boolean; // NEU HINZUGEFÜGT (oder sicherstellen, dass es da ist)
}

// Basierend auf deinen Backend GameStateDto
export interface GameStateDto {
    gameId: string;
    players: PlayerDto[];
    communityCards: CardDto[];
    pot: number;
    currentPlayerTurnId: string | null;
    currentGamePhase: string;
}