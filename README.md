# Web Casinoo – Projektdokumentation

Diese Dokumentation liefert einen umfassenden Überblick über Aufbau, Funktionsweise und mögliche Erweiterungen des Projekts. Sie richtet sich an Studierende und Entwickler, die den Quellcode nachvollziehen oder eigene Beiträge leisten möchten. Alle relevanten Themen von der Idee bis zum Deployment werden ausführlich erläutert.

## Teilnehmer

- Denis Velko  
- Joshua Müller  
- Leon Braches  
- Ivan Petrovic

## Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [Projektidee und Mehrwert](#projektidee-und-mehrwert)
3. [Architektur](#architektur)
   1. [Übersicht](#übersicht)
   2. [Frontend](#frontend)
   3. [Backend](#backend)
   4. [Datenbank](#datenbank)
4. [Spiele und Designmuster](#spiele-und-designmuster)
5. [Eingesetzte Technologien](#eingesetzte-technologien)
6. [Containerisierung und Deployment](#containerisierung-und-deployment)
7. [Lokales Setup](#lokales-setup)
8. [Sicherheit und Datenschutz](#sicherheit-und-datenschutz)
9. [Fehlerbehandlung und Testing](#fehlerbehandlung-und-testing)
10. [Metriken und Monitoring](#metriken-und-monitoring)
11. [Erweiterungsmöglichkeiten und Ausblick](#erweiterungsmöglichkeiten-und-ausblick)
12. [Fazit](#fazit)

## Einleitung
"Web Casinoo" ist eine vollständige Webanwendung, die mehrere klassische Casinospiele in einem modernen Client/Server‑Szenario vereint. Die Anwendung wurde im Rahmen eines Universitätsprojekts erstellt und demonstriert den Einsatz aktueller Webtechnologien sowie bekannter Software‑Entwurfsmuster. Ziel ist es, sowohl eine funktionierende Spieleplattform zu liefern als auch Best Practices für die Architektur von Frontend und Backend zu zeigen.

Im Vordergrund steht das Zusammenspiel von React auf der Clientseite und ASP.NET auf der Serverseite. Die Anwendung lässt sich per Docker containerisieren und über einen Nginx Reverse Proxy betreiben. Dadurch eignet sich das Projekt ideal, um den kompletten Lebenszyklus einer Webapplikation – von der Entwicklung über Tests bis hin zum Deployment – abzubilden.

## Projektidee und Mehrwert
Die Grundidee besteht darin, eine Reihe kleiner Casinospiele über eine einheitliche Benutzeroberfläche zugänglich zu machen. Nutzer können sich registrieren, anmelden und ihr virtuelles Guthaben verwalten. Anschließend stehen diverse Spiele zur Wahl, darunter Slots, Blackjack, Poker, Roulette, High‑Low, Craps, Pferderennen sowie das Kartenratespiel "Black‑Red".

Der Mehrwert liegt vor allem im pädagogischen Ansatz: Jedes Spiel demonstriert ein oder mehrere Entwurfsmuster. So wird etwa beim Slot‑Spiel der State Pattern eingesetzt, beim High‑Low das Command Pattern und bei Blackjack oder dem Pferderennen das Observer Pattern. Dadurch eignet sich der Code hervorragend, um Designprinzipien in einer realen Anwendung zu studieren. Zusätzlich vermittelt das Projekt den Umgang mit modernen Tools wie React Hooks, TypeScript, Entity Framework Core und Docker.

## Architektur
### Übersicht
Die Applikation folgt einem klassischen Client/Server‑Modell. Durch die Trennung kann jedes Modul unabhängig entwickelt, getestet und skalierbar betrieben werden. Entwickler profitieren von kurzen Build‑Zeiten im Frontend und den Stabilitätsvorteilen eines typischen .NET‑Backends.

### Frontend
Das Frontend ist als Single‑Page‑Application (SPA) auf Basis von React und Vite umgesetzt. Die Anwendung kommuniziert ausschließlich über HTTP‑Aufrufe mit dem Backend. Routing, State Management und UI‑Logik sind vollständig in TypeScript implementiert. Die API‑Basis‑URL wird über eine Umgebungsvariable `VITE_API_URL` eingestellt, was sowohl lokale Entwicklung als auch Deployment erleichtert.

### Backend
Das Backend befindet sich im Ordner `backend/api_casino` und enthält den ASP.NET‑Code. Die zentrale Datei `Program.cs` konfiguriert sämtliche Abhängigkeiten über den eingebauten Dependency‑Injection‑Container. So werden unter anderem ein Kartendeck für Poker, der Hand‑Evaluator, diverse Repositories und der Datenbankkontext registriert.

```csharp
// Auszug aus Program.cs
builder.Services.AddSingleton<IDeck, Deck>();
builder.Services.AddSingleton<ICardFactory, CardFactory>();
builder.Services.AddScoped<IPokerGameService, PokerGameService>();
```

Die API stellt Endpunkte für Benutzerverwaltung, Slots und Poker bereit. Ein Beispiel ist der `UserController`, der Login und Registrierung abwickelt:

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
```

Neben den Controllern definiert die Business‑Logik Spielklassen wie `PokerGameService` oder `SlotGameService`. Letztere generieren Zufallsresultate und berechnen Gewinne. Die Pokerlogik verwaltet einen komplexeren Ablauf über mehrere Phasen (PreFlop, Flop, Turn, River, Showdown) und bewertet Hände über den `HandEvaluatorService`.

Darüber hinaus nutzt das Backend die Möglichkeiten von ASP.NET zur Konfiguration über `appsettings.json`. Die Datenbankverbindung wird per Umgebungsvariable übergeben, sodass unterschiedliche Verbindungen für Entwicklungs‑ und Produktionsumgebungen genutzt werden können. Jeder Controller ist mit dem `[ApiController]`‑Attribut ausgestattet, wodurch Modellvalidierung und sprechende Fehlermeldungen automatisch erfolgen. Für eine einfache API‑Dokumentation kommt Swashbuckle zum Einsatz und stellt unter `/swagger` eine interaktive Oberfläche bereit.

Die wichtigsten Endpunkte des `UserController` lauten:

```http
POST /api/users/login      # authentifiziert einen Benutzer
POST /api/users/register   # legt einen neuen Account an
GET  /api/users/profile    # liefert Profildaten per Query-Parameter
PUT  /api/users/credit     # setzt das aktuelle Guthaben
```

Diese API wird von den React-Komponenten konsumiert und bildet das Rückgrat der Benutzerverwaltung. Dank Dependency Injection lassen sich alle Services leicht durch Mock-Implementierungen ersetzen, was automatisierte Tests vereinfacht.

### Datenbank
Die Datenhaltung erfolgt via Entity Framework Core. Der `AppDbContext` beschreibt Tabellen wie `users` und konfiguriert die Verbindung zu PostgreSQL. Migrationsdateien legen das Schema an und können bei Bedarf erweitert werden. Benutzer werden mit BCrypt gehasht gespeichert, um sensible Daten zu schützen.

## Spiele und Designmuster
Ein Kernaspekt des Projekts ist die Verwendung bekannter Entwurfsmuster. Jedes Spiel nutzt mindestens ein Pattern, um die interne Logik zu strukturieren.

- **Slot Machine** – nutzt das *State Pattern*, um die Phasen "Idle", "Spinning" und "Results" abzubilden.
- **High‑Low** – demonstriert das *Command Pattern*. Aktionen wie "Start Game", "Guess" und "Cash Out" sind als Befehle gekapselt.
- **Blackjack** – realisiert das *Observer Pattern*. Das Spiel verwaltet eine Liste von Beobachtern und informiert sie, wenn sich der Zustand ändert.
- **Roulette** – zeigt das *Strategy Pattern*. Verschiedene Wettstrategien können ausprobiert und auf das Spiel angewendet werden.
- **Poker** – verteilt Logik zwischen Frontend und Backend. Die Serverseite hält den kompletten Spielzustand und wertet Hände aus, während die React‑Seite Spielphasen visualisiert.
- **Craps** und **Horse Racing** – setzen ebenfalls das Observer Pattern ein, um UI‑Updates bei Würfen oder Rennfortschritt zu ermöglichen.
- **Black‑Red** – ein Ratespiel, in dem das Verdoppeln der Punktzahl ein simples Risiko‑Belohnungs‑Szenario erzeugt. Auch hier wird das Command Pattern genutzt.

Durch diese Zuordnung wird deutlich, wie sich Muster in verschiedenen Kontexten anwenden lassen. Die Umsetzung in TypeScript erleichtert gleichzeitig das Verständnis der Spielregeln.

## Eingesetzte Technologien
Das Projekt nutzt eine Reihe aktueller Werkzeuge und Libraries:

- **React & Vite** – modernes Frontend‑Framework mit schneller Entwicklungsumgebung
- **TypeScript** – typsicheres JavaScript für bessere Wartbarkeit
- **ASP.NET 8** – leistungsstarker Web‑Stack für die API
- **Entity Framework Core** – ORM für die Anbindung von PostgreSQL
- **Npgsql** – Datenbanktreiber für PostgreSQL
- **Docker & Docker Compose** – Containerisierung und Orchestrierung
- **Nginx** – Reverse Proxy und TLS‑Terminierung
- **pnpm** – schlanker Package‑Manager für das Frontend
- **Prometheus** – Metriken für das Backend

Zusammen bilden diese Technologien eine moderne Grundlage, die von der lokalen Entwicklung bis zur produktiven Bereitstellung skaliert.

## Containerisierung und Deployment
Das Projekt bringt ein `docker-compose.yml` mit, das zwei Services definiert:

```yaml
services:
  casino-frontend:
    build: ./frontend
    ports:
      - "5173:80"
  casino-backend:
    build: ./backend/api_casino
    ports:
      - "5296:5296"
```

Damit lassen sich Frontend und Backend gemeinsam starten. In Produktionsumgebungen empfiehlt sich zusätzlich ein Nginx‑Server, der HTTPS terminiert und die Routen auf die jeweiligen Container verteilt. Die bereitgestellte Konfigurationsdatei `Server/nginx_joshiidkwhy.de` zeigt ein praktisches Beispiel mit Zertifikatspfad und Weiterleitung der API‑Anfragen.

Die Konfiguration erzwingt eine Weiterleitung von HTTP auf HTTPS und leitet sämtliche Pfade unter `/api/` an die ASP.NET‑Instanz weiter. Alle anderen Anfragen landen beim statischen Frontend. Diese Trennung ermöglicht eine klare Zugriffskontrolle und vereinfacht das Ausrollen neuer Versionen: Während die React‑Dateien einfach ersetzt werden können, bleibt die API unter ihrer gewohnten Adresse erreichbar. Auch Let's Encrypt Zertifikate lassen sich über Nginx automatisch erneuern.

Durch die Containerisierung ist es möglich, die Anwendung konsistent in verschiedenen Umgebungen laufen zu lassen. Updates an Frontend oder Backend können unabhängig voneinander vorgenommen und deployt werden.

## Lokales Setup
Für lokale Tests genügt es, Node.js (inklusive pnpm) und das .NET SDK zu installieren. Anschließend lässt sich der Code wie folgt ausführen:

```bash
cd frontend
pnpm install
pnpm dev
```

Parallel dazu startet das Backend:

```bash
cd backend/api_casino
dotnet run
```

Optional können beide Komponenten über Docker Compose gestartet werden:

```bash
docker-compose up --build
```

Die App ist dann unter `http://localhost:5173` erreichbar, während das Backend Anfragen an `http://localhost:5296` entgegennimmt. Bei Bedarf kann die Variable `VITE_API_URL` angepasst werden, um die API‑URL zu verändern.

## Sicherheit und Datenschutz
Neben dem rein spielerischen Aspekt muss eine Webanwendung auch die Sicherheit der Benutzerdaten sicherstellen. Im aktuellen Projekt werden Passwörter mit BCrypt gehasht, sodass beim Auslesen der Datenbank keine Klartexte ersichtlich sind. Trotzdem sollte man bei einem realen Einsatz weitere Maßnahmen treffen, beispielsweise eine Zwei-Faktor-Authentifizierung oder striktere Passwortregeln.

Auch der Schutz der API vor Missbrauch ist wichtig. Rate-Limiting und CSRF-Token könnten verhindern, dass Skripte automatisiert Anfragen stellen. Das Backend enthält bereits CORS-Regeln, die in Produktionsumgebungen nur die wirklich benötigten Domains zulassen sollten. Zudem empfiehlt sich die Protokollierung von Login-Versuchen und verdächtigen Aktionen, damit Administratoren schnell eingreifen können.

Datenschutzrechtlich relevant ist der Umgang mit persönlichen Daten. E-Mails und Spielhistorien sollten nur gespeichert werden, wenn es einen klaren Zweck dafür gibt. Ein ausführliches Impressum und eine Datenschutzerklärung, die darüber aufklären, welche Daten verarbeitet werden, sind Pflicht, sobald die Anwendung öffentlich erreichbar ist. Für das Hochschulprojekt genügt eine vereinfachte Erklärung, doch bei einer kommerziellen Nutzung wäre eine juristische Prüfung angeraten.

## Fehlerbehandlung und Testing
Ein weiterer Bestandteil professioneller Webentwicklung ist ein sauberes Testkonzept. Die hier präsentierte Anwendung nutzt Unit-Tests im Backend, die grundlegende Spielalgorithmen wie das Poker-Handranking überprüfen. Auf Frontend-Seite könnten zusätzliche Tests mit React Testing Library dafür sorgen, dass die Komponenten erwartungsgemäß funktionieren.

Fehlerbehandlung im laufenden Betrieb erfolgt derzeit über einfache `try-catch`-Blöcke und die Protokollierung über die Konsolenausgabe. Für eine echte Produktionsumgebung sollte ein zentrales Logging-System zum Einsatz kommen, das Fehlermeldungen zusammenführt und per Dashboard analysierbar macht. Hier bieten sich ELK-Stacks (Elasticsearch, Logstash, Kibana) oder Cloud-Dienste wie Azure Application Insights an.

Neben Unit-Tests sind Integrationstests sinnvoll, um das Zusammenspiel von Frontend und Backend zu prüfen. Tools wie Playwright oder Cypress können automatisiert durch alle Spiele klicken und sicherstellen, dass das End-to-End-Erlebnis stabil bleibt. Gerade für ein Projekt mit vielen Teilkomponenten ist dieser Schritt hilfreich, um Regressionen früh zu erkennen.

## Metriken und Monitoring
Zur Überwachung des laufenden Betriebs ist das Backend bereits mit einfachen Prometheus-Metriken ausgestattet. Diese liefern Zahlen zu API-Aufrufen und Laufzeitaspekten, die sich mittels Grafana visualisieren lassen. In einer Produktivumgebung empfiehlt es sich, weitere Kennzahlen zu erfassen, beispielsweise die durchschnittliche Spieldauer oder die Anzahl der Fehlversuche beim Login.

Prometheus scrapes in regelmäßigen Abständen die bereitgestellten Endpunkte. Ein Alertmanager könnte Benachrichtigungen auslösen, sobald bestimmte Schwellwerte überschritten werden, etwa bei ungewöhnlich vielen Fehlermeldungen. Für das Frontend gibt es ebenfalls Bibliotheken, mit denen man Performance-Daten erfassen kann. So lässt sich nachvollziehen, ob bestimmte Spielseiten besonders lange zum Laden brauchen.

Ein konsistentes Monitoring erleichtert die Wartung erheblich und macht Engpässe frühzeitig sichtbar. Gerade wenn das Projekt in eine produktionsähnliche Phase übergeht, ist ein Überblick über Fehler und Performancewerte essenziell.

## Erweiterungsmöglichkeiten und Ausblick
Die aktuelle Version des Projekts liefert eine solide Basis, doch es gibt zahlreiche Ideen für zukünftige Erweiterungen. Ein naheliegender Schritt wäre die Einführung eines sozialen Features, etwa eines Chats oder einer Bestenliste, um den Wettbewerb unter den Spielern zu fördern. Auch könnte man weitere Spiele integrieren oder existierende Varianten mit zusätzlichen Leveln versehen.

Für die Benutzerverwaltung ließe sich ein Rollenmodell einführen, durch das Administratoren Sonderrechte erhalten, wie z.B. das Sperren von Accounts oder das Verwalten von Bonusaktionen. Eine Verbindung zu echten Zahlungsanbietern würde das Projekt darüber hinaus praxisnäher gestalten, ist aber aus rechtlichen Gründen nicht Teil des Demonstrationscodes.

Technisch interessant wäre die Umstellung des Backends auf Microservices. Jedes Spiel könnte einen eigenen Dienst darstellen, was Skalierung und Fehlertoleranz verbessert. Kubernetes oder vergleichbare Plattformen würden die Orchestrierung übernehmen.

Bei wachsender Nutzerzahl empfiehlt sich zudem ein Caching-Layer, um API-Anfragen zu beschleunigen. Redis eignet sich hier sowohl für Sessions als auch für Spielzustände. Zusätzlich könnte ein Message-Broker wie RabbitMQ Events zwischen Backend-Komponenten verteilen, etwa wenn Spiele oder Guthabenänderungen protokolliert werden.

Auch im Frontend sind Optimierungen möglich. Lazy Loading für einzelne Spielseiten würde den initialen Ladevorgang verkürzen, während ein globaler Zustand mit Redux Toolkit oder Zustand mehr Transparenz über den Anwendungsstatus bietet.

Schließlich lassen sich die Spieleelemente als eigenständige npm-Pakete veröffentlichen. Andere Projekte könnten sie dann wiederverwenden, um eigene Casinoplattformen aufzubauen. Dadurch erhöht man den Mehrwert der geleisteten Arbeit weit über das Seminar hinaus.

## Fazit
"Web Casinoo" vereint verschiedene Technologien zu einer vollständigen Webanwendung. Das Projekt zeigt, wie eine SPA mit React und TypeScript effektiv mit einem ASP.NET‑Backend zusammenarbeitet. Durch den Einsatz von Docker und Nginx lässt sich die Anwendung leicht bereitstellen und skaliert in gängigen Cloud‑Umgebungen.

Besonders hervorzuheben ist der didaktische Nutzen: Jedes Spiel illustriert anschaulich ein Entwurfsmuster aus der Softwaretechnik. So bietet das Projekt nicht nur spielerischen Mehrwert, sondern auch wertvolle Einblicke in saubere Codearchitektur. Studierende können hier experimentieren, eigene Erweiterungen vornehmen und dabei gleichzeitig bewährte Konzepte aus der Praxis kennen lernen.

Insgesamt ist "Web Casinoo" ein vielseitiges Beispiel für moderne Webentwicklung. Es verbindet clientseitige Dynamik mit serverseitiger Stabilität und zeigt, wie man durchdachte Softwarestrukturen in einem unterhaltsamen Kontext umsetzen kann.
