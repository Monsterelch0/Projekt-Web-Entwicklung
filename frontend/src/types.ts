// src/types.ts

export interface CardDto {
    suit: string;
    rank: string;
    displayName: string;
}

export interface PlayerDto {
    id: string;
    hand: CardDto[];
    chips: number;
    isActive: boolean;
    isAI?: boolean; 
}

export interface GameStateDto {
    gameId: string;
    players: PlayerDto[];
    communityCards: CardDto[];
    pot: number;
    currentPlayerTurnId: string | null;
    currentGamePhase: string;
    // NEUE FELDER für Gewinnerinformationen:
    winnerIds?: string[];           // Liste der IDs der Gewinner (für Split Pots)
    winningHandDescription?: string; // Beschreibung der Gewinnerhand
}

export interface AccountDto {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    balance: number,
    createdAt: Date,
    isActive: boolean,
}
