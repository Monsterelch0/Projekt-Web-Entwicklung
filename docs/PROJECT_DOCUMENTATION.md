# Projekt Dokumentation

## Einleitung
Dieses Dokument beschreibt Aufbau und Betrieb unseres Web-Casinos. Es richtet sich an Entwickler und Administratoren und liefert einen technischen Überblick.

## Casino-Spiele und Design-Patterns
### Blackjack
Die Blackjack-Implementierung nutzt das **State Pattern**. Jeder Spielzustand (Start, Spielerzug, Dealerzug, Ergebnis) wird als eigene Klasse repräsentiert, um Übergänge klar abzubilden. Änderungen am Ablauf lassen sich so unkompliziert erweitern.

### Poker
Unser Pokerspiel setzt auf das **Observer Pattern**. Die Klasse `PokerGameService` verwaltet den aktuellen Spielzustand und benachrichtigt abonnierte Komponenten, wenn sich dieser ändert. Dadurch bleibt die Darstellung entkoppelt und mehrere Spieler können denselben Zustand beobachten.

### Roulette
Hier kommt das **Strategy Pattern** zum Einsatz. In `BettingStrategies.ts` definieren unterschiedliche Strategien ihre Logik zur Generierung von Einsätzen. Der eigentliche Spielablauf bleibt konstant, während neue Strategien leicht ergänzt werden können.

### Craps
Beim Würfelspiel Craps verwenden wir ebenfalls das **Observer Pattern**. Das `CrapsGameManager`-Objekt führt die Spielregeln aus und informiert registrierte Observer – meist UI-Komponenten – über Änderungen. Dadurch wird eine saubere Trennung zwischen Logik und Präsentation erreicht.

### Slots
Die Slot-Maschine ist als einfaches **Singleton** umgesetzt. Nur eine Instanz verwaltet den aktuellen Walzenzustand und die Auszahlungstabelle. So behalten wir überall konsistente Gewinnchancen.

### Black-Red
Das Kartenratespiel Black-Red bedient sich eines **Command Patterns**. Benutzeraktionen wie „Karte ziehen“, „Auf Rot setzen“ oder „Kassieren“ werden als Befehle gekapselt. Dies erleichtert die Anbindung einer möglichen Undo-Funktion und sorgt für klare Verantwortlichkeiten.

### High-Low
Auch High-Low basiert auf dem Command-Konzept. Die Kommandoklassen delegieren an eine zentrale `HighLowGameLogic`, die das Ergebnis berechnet und den Punktestand verwaltet.

### Horse Racing
Beim Pferderennen arbeiten wir mit dem **Strategy Pattern**, um unterschiedliche Wett- und Rennlogiken austauschbar zu halten. Je nach Einsatz können so zum Beispiel „sichere“ oder „risikoreiche“ Strategien gewählt werden.

## Deployment-Pipeline und Docker
Die Bereitstellung erfolgt vollständig automatisiert über **GitHub Actions**. Bei jedem Push auf den `main`-Branch baut die Pipeline zwei Docker-Images: eins für das Frontend und eins für das Backend. Beide Images werden anschließend in unserer privaten Registry veröffentlicht und auf dem Server aktualisiert. Der Workflow `deploy.yml` kümmert sich ferner darum, via SSH auf den Server zu verbinden und `docker compose` auszuführen. Dadurch starten die neuen Container ohne manuelles Eingreifen.

Im `docker-compose.yml` werden Frontend und Backend gemeinsam orchestriert. Die variable `DB_CONNECTION_STRING` stammt aus einer `.env`‑Datei. Für das Frontend wird über ein Build-Argument die passende API-URL gesetzt. So lassen sich verschiedene Umgebungen (Test, Staging, Produktion) bequem konfigurieren.

## Nginx-Konfiguration
Unter `Server/nginx_joshiidkwhy.de` liegt die Nginx-Serverkonfiguration. Eine erste Server-Block leitet sämtlichen HTTP‑Traffic auf HTTPS um. Der zweite Block bedient Anfragen auf Port 443, hinterlegt die TLS-Zertifikate von Let’s Encrypt und leitet Pfade unter `/api/` an das Backend weiter. Alle übrigen Anfragen gehen an das Frontend. So entsteht ein klar getrenzter Reverse Proxy, der sowohl statische Dateien als auch die API ausliefert.

## PostgreSQL-Datenbank und Migrationen
Unsere Datenbank läuft auf PostgreSQL. Der `AppDbContext` definiert die Tabelle `users` mit Feldern wie `UserId`, `FirstName`, `LastName`, `Email`, `PasswordHash`, `Balance` und `CreatedAt`. Die dazugehörigen Migrationen im Ordner `Migrations` werden mit Entity Framework Core erzeugt. Ein Beispielaufruf lautet:
```bash
dotnet ef migrations add AddUserTable
```
Anschließend kann die Migration per `dotnet ef database update` eingespielt werden. Zur Laufzeit liest das Backend die Verbindungsdaten aus `appsettings.json` beziehungsweise aus der Umgebungsvariable `DB_CONNECTION_STRING`.

Beispielhafte SQL-Abfrage, um alle aktiven Nutzer samt Guthaben aufzulisten:
```sql
SELECT "FirstName", "LastName", "Balance"
FROM users
WHERE "IsActive" = true
ORDER BY "Balance" DESC;
```

## Sicherheit
Für die Passwortspeicherung verwenden wir `BCrypt.Net` im `UserService`. Neue Passwörter werden mit `HashPassword` verschlüsselt, bei der Anmeldung erfolgt ein Vergleich über `Verify`. Dadurch sind die Passwörter selbst bei einem Datenbankleck geschützt.

Cross-Origin-Anfragen werden über eine explizite CORS-Policy in `Program.cs` erlaubt. Nur freigegebene Domains wie `joshiidkwhy.de` oder lokale Testadressen dürfen auf die API zugreifen. Zudem erzwingt unser Nginx-Setup HTTPS. In Kombination mit den Let’s-Encrypt-Zertifikaten wird der gesamte Datenverkehr verschlüsselt.

Weitere Sicherheitsmaßnahmen beinhalten das Deaktivieren unnötiger HTTP-Header in Nginx sowie die Beschränkung der Datenbankverbindung auf einen dedizierten Benutzer mit minimalen Rechten.

## Fazit
Diese Dokumentation liefert einen Überblick über Architektur und Betriebsabläufe. Durch den Einsatz bewährter Design-Patterns bleiben die Spiele wartbar und erweiterbar. Die Docker-basierte Pipeline garantiert reproduzierbare Builds, während Nginx und PostgreSQL für eine stabile Produktionsumgebung sorgen. Sicherheit hat einen hohen Stellenwert, angefangen bei Passwort-Hashing bis hin zu verschlüsselter Kommunikation.
