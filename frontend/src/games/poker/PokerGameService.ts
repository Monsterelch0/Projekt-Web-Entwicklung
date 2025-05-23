// src/games/poker/PokerGameService.ts
import axios from 'axios';
import type { GameStateDto } from '../../types';

// Lese die API-URL aus den Vite-Umgebungsvariablen.
// Gib einen Standardwert an, falls die Variable nicht gesetzt ist.
import { POKER_API_ENDPOINT_BASE } from '../../config';

// Für Debugging-Zwecke, um zu sehen, welche URL verwendet wird:
console.log(`[PokerGameService] Effective Backend URL for Poker: ${POKER_API_ENDPOINT_BASE}`);

class PokerGameService {
    private gameState: GameStateDto | null = null;
    private subscribers: Array<(state: GameStateDto | null) => void> = [];

    public subscribe(callback: (state: GameStateDto | null) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify(): void {
        this.subscribers.forEach(callback => callback(this.gameState));
    }

    public getGameState(): GameStateDto | null {
        return this.gameState;
    }

    public async startOfflineGame(humanPlayerName?: string, numberOfAICopponents?: number): Promise<void> {
        try {
            // KORRIGIERTE URL-Konstruktion:
             let url = `${POKER_API_ENDPOINT_BASE}/startofflinegame`;
            const params = new URLSearchParams();
            if (humanPlayerName) {
                params.append('humanPlayerName', humanPlayerName);
            }
            if (numberOfAICopponents !== undefined) {
                params.append('numberOfAICopponents', numberOfAICopponents.toString());
            }
            
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await axios.get<GameStateDto>(url);
            this.gameState = response.data;
            this.notify(); 
        } catch (error) {
            console.error("Fehler beim Starten des Offline-Spiels:", error);
            this.gameState = null; 
            this.notify();
            throw error; 
        }
    }

    public async advanceGamePhase(gameId: string): Promise<void> {
        if (!gameId) {
            const errorMessage = "Keine Spiel-ID vorhanden, um die Phase fortzusetzen.";
            console.error("PokerGameService: advanceGamePhase aufgerufen ohne gameId");
            throw new Error(errorMessage);
        }
        try {
            // KORRIGIERTE URL-Konstruktion:
             const response = await axios.post<GameStateDto>(`${POKER_API_ENDPOINT_BASE}/${gameId}/nextphase`);
            this.gameState = response.data;
            this.notify(); 
        } catch (error) {
            console.error("Fehler beim Voranschreiten der Spielphase:", error);
            throw error; 
        }
    }
}

export const pokerGameService = new PokerGameService();