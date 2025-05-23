// src/commands/LoginCommand.ts
import { LOGIN_API_ENDPOINT } from '../config'; // Importiere aus deiner config.ts

export class LoginCommand {
  constructor(private email: string, private password: string) {}

  async execute() {
    const dataToSend = JSON.stringify({
      email: this.email,
      password: this.password,
    });

    const loginUrl = LOGIN_API_ENDPOINT; // Verwende die konfigurierte URL
    console.log(`[LoginCommand] Attempting login to: ${loginUrl}`);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            // Versuche, eine spezifischere Fehlermeldung aus dem Backend zu extrahieren
            const message = errorJson.message || errorJson.title || errorJson.detail || 'Login failed due to server error';
            throw new Error(message);
        } catch (e) {
            // Wenn die Fehlerantwort kein JSON ist, verwende den Text
            throw new Error(errorText || 'Login failed');
        }
      }
      const responseData = await response.json();
      console.log("[LoginCommand] Login successful:", responseData);
      return responseData; // z.B. { token: "...", user: {...} }
    } catch (error) {
      console.error(`[LoginCommand] Login failed for URL ${loginUrl}:`, error);
      throw error; // Fehler weiterwerfen, damit die aufrufende UI-Komponente ihn behandeln kann
    }
  }
}