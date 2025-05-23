using System.Collections.Generic; // Wichtig für List<>
using CasinoApp.Models; // Wichtig für den Zugriff auf Suit und Rank Enums für CardDto

namespace CasinoApp.Models // Stelle sicher, dass dieser Namespace korrekt ist
{
    // DTO, um den Spielzustand (vereinfacht für den Anfang) darzustellen
    public class GameStateDto
    {
        public string GameId { get; set; }
        public List<PlayerDto> Players { get; set; }
        public List<CardDto> CommunityCards { get; set; } // Für Texas Hold'em etc.
        public int Pot { get; set; }
        public string? CurrentPlayerTurnId { get; set; } // ID des Spielers, der am Zug ist (kann null sein)
        public string CurrentGamePhase { get; set; } // z.B. "PreFlop", "Flop", "Turn", "River", "Showdown"
        public List<string> WinnerIds { get; set; } // NEU
        public string WinningHandDescription { get; set; } // NEU

        public GameStateDto()
        {
            Players = new List<PlayerDto>();
            CommunityCards = new List<CardDto>();
            GameId = string.Empty; // Initialisieren, um Null-Referenzen zu vermeiden
            CurrentGamePhase = string.Empty;
            WinnerIds = new List<string>(); // Initialisieren
            WinningHandDescription = string.Empty; // Initialisieren
        }
    }

    // DTO für Spielerinformationen (enthält nicht sensible Server-interne Daten)
    // In Models/GameStateDto.cs (Backend)
    public class PlayerDto
    {
        public string Id { get; set; }
        public List<CardDto> Hand { get; set; } // Diese Liste wird für KI-Spieler leer sein (oder Platzhalter enthalten)
        public int Chips { get; set; }
        public bool IsActive { get; set; }
        public bool IsAI { get; set; } // NEU HINZUGEFÜGT (oder sicherstellen, dass es da ist)

        public PlayerDto()
        {
            Id = string.Empty;
            Hand = new List<CardDto>();
        }
    }

    // DTO für Karteninformationen (um z.B. keine Objekt-Referenzen direkt zu serialisieren)
    public class CardDto
    {
        public string Suit { get; set; }
        public string Rank { get; set; }
        public string DisplayName { get; set; } // z.B. "Ass von Herz" oder "AH"

        // Standardkonstruktor für Deserialisierung oder manuelle Erstellung
        public CardDto()
        {
            Suit = string.Empty;
            Rank = string.Empty;
            DisplayName = string.Empty;
        }

        // Konstruktor, der Suit und Rank Enums akzeptiert
        public CardDto(Suit suit, Rank rank)
        {
            Suit = suit.ToString();
            Rank = rank.ToString();
            // Einfache DisplayName Logik
            string rankDisplay = ((int)rank <= 10 && (int)rank >= 2) ? ((int)rank).ToString() : rank.ToString().Substring(0, 1);
            string suitDisplay = "";
            // Um Fehler bei Substring zu vermeiden, wenn Enum-Name zu kurz ist (sollte nicht passieren für Suit)
            if (!string.IsNullOrEmpty(suit.ToString()))
            {
                suitDisplay = suit.ToString().Substring(0, 1);
            }
            DisplayName = $"{rankDisplay}{suitDisplay}"; // z.B. AH für Ass Herz, 2S für 2 Pik
        }

        // Konstruktor, der ein Card-Objekt akzeptiert
        public CardDto(Card card) : this(card.Suit, card.Rank) { }
    }
}