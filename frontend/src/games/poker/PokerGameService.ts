// src/games/poker/PokerGameService.ts
//import axios from 'axios'; // Stelle sicher, dass axios installiert ist
import type { GameStateDto } from '../../types'; // Pfad zu deiner globalen types.ts

// Die URL zu deinem Backend API
// WICHTIG: Dieser Port (5296) muss mit dem Port übereinstimmen, auf dem dein Backend tatsächlich läuft!
// Überprüfe die Startausgabe deines .NET Backends.
const API_BASE_URL = 'http://localhost:5296/api/poker';

class PokerGameService {
    private gameState: GameStateDto | null = null;
    private subscribers: Array<(state: GameStateDto | null) => void> = [];

    public subscribe(callback: (state: GameStateDto | null) => void): () => void {
        this.subscribers.push(callback);
        // Funktion zum De-abonnieren zurückgeben
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
            let url = `${API_BASE_URL}/startofflinegame`;
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
            this.notify(); // Benachrichtige alle Observer über den neuen Zustand
        } catch (error) {
            console.error("Fehler beim Starten des Offline-Spiels:", error);
            this.gameState = null; // Setze den Zustand bei Fehler zurück
            this.notify(); // Informiere auch bei Fehler die Observer
            throw error; // Fehler weiterwerfen, damit die UI ihn behandeln kann
        }
    }

    public async advanceGamePhase(gameId: string): Promise<void> {
        if (!gameId) {
            const errorMessage = "Keine Spiel-ID vorhanden, um die Phase fortzusetzen.";
            console.error("PokerGameService: advanceGamePhase aufgerufen ohne gameId");
            throw new Error(errorMessage);
        }
        try {
            // Der Endpunkt ist POST /api/poker/{gameId}/nextphase
            // Die URL wurde hier korrigiert:
            const response = await axios.post<GameStateDto>(`${API_BASE_URL}/${gameId}/nextphase`);
            this.gameState = response.data;
            this.notify(); // Benachrichtige Observer über den neuen Zustand
        } catch (error) {
            console.error("Fehler beim Voranschreiten der Spielphase:", error);
            // Optional: Fehler an die UI weitergeben oder alten Zustand beibehalten.
            // this.gameState bleibt beim alten Wert, wenn der Call fehlschlägt,
            // außer man setzt es hier explizit auf null oder einen Fehlerzustand.
            throw error; // Damit die UI den Fehler behandeln kann
        }
    }
}

// Erzeuge eine Singleton-Instanz des PokerGameService
export const pokerGameService = new PokerGameService();