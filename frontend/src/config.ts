// src/config.ts
// VITE_API_URL wird durch den Docker Build-Prozess gesetzt (z.B. auf "https://joshiidkwhy.de")
// oder ist für lokale Entwicklung leer/nicht gesetzt.
const VITE_API_URL_VALUE = import.meta.env.VITE_API_URL;

// Basis-URL für alle API-Aufrufe, die über deinen Nginx Reverse Proxy laufen.
// Wenn VITE_API_URL nicht gesetzt ist (lokale Entwicklung ohne Reverse Proxy auf der Domain),
// könntest du einen lokalen Backend-Port als Fallback nehmen.
// Da dein curl aber auf https://joshiidkwhy.de geht, ist das die Basis.
//export const API_DOMAIN_BASE = VITE_API_URL_VALUE || 'https://joshiidkwhy.de'; 
// Oder, falls lokal ein anderer Port für das Backend direkt angesprochen wird:
 export const API_DOMAIN_BASE = VITE_API_URL_VALUE || 'http://localhost:5296'; 

// Spezifische API-Pfade, die an die API_DOMAIN_BASE angehängt werden.
// Diese Pfade sind so, wie Nginx sie von außen erwartet.
export const LOGIN_API_ENDPOINT = `${API_DOMAIN_BASE}/api/users/login`;
export const USERS_ME_API_ENDPOINT = `${API_DOMAIN_BASE}/api/users/me`;
export const POKER_API_ENDPOINT_BASE = `${API_DOMAIN_BASE}/api/poker`;

// Für Debugging
console.log(`[Config] Login API Endpoint: ${LOGIN_API_ENDPOINT}`);
console.log(`[Config] Poker API Endpoint Base: ${POKER_API_ENDPOINT_BASE}`);