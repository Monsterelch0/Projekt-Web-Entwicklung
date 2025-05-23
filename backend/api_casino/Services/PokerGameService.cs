// In Services/PokerGameService.cs

using CasinoApp.Interfaces;
using CasinoApp.Models;
using System;
using System.Collections.Generic;
using System.Linq; // Für .Select und .Any

namespace CasinoApp.Services
{
    // Die interne PokerGame-Klasse bleibt größtenteils gleich,
    // enthält die Logik für ein einzelnes Spiel.
    internal class PokerGame
    {
        public string GameId { get; }
        public List<Player> Players { get; }
        public List<Card> CommunityCards { get; }
        public int Pot { get; set; }
        public int CurrentPlayerIndex { get; set; }
        public string CurrentGamePhase { get; set; }
        private readonly IDeck deck;

        public PokerGame(string gameId, IDeck gameDeck)
        {
            GameId = gameId;
            deck = gameDeck; // IDeck wird übergeben
            Players = new List<Player>();
            CommunityCards = new List<Card>();
            Pot = 0;
            CurrentGamePhase = "Lobby"; // Startet in der Lobby-Phase
        }

        public void SetupNewOfflineRound(string humanPlayerName, int numberOfAICopponents, int initialChips)
        {
            if (deck == null) throw new InvalidOperationException("Deck is not initialized.");
            deck.ResetDeck();
            Players.Clear();

            Players.Add(new Player(humanPlayerName, initialChips, isAI: false));
            for (int i = 0; i < numberOfAICopponents; i++)
            {
                Players.Add(new Player($"AI Opponent {i + 1}", initialChips, isAI: true));
            }

            CommunityCards.Clear();
            Pot = 0;
            CurrentGamePhase = "PreFlop"; // Erste Spielphase nach dem Setup
            CurrentPlayerIndex = 0; // Index für den ersten Spieler (kann später verfeinert werden)
        }

        public void DealInitialHands(int numberOfCards = 2)
        {
            if (deck == null) throw new InvalidOperationException("Deck is not initialized.");
            foreach (var player in Players)
            {
                player.ClearHand();
                for (int i = 0; i < numberOfCards; i++)
                {
                    Card? card = deck.DealCard();
                    if (card != null)
                    {
                        player.AddCardToHand(card);
                    }
                }
            }
        }

        public void AdvancePhase()
        {
            if (deck == null) throw new InvalidOperationException("Deck is not initialized.");

            switch (CurrentGamePhase)
            {
                case "PreFlop":
                    CurrentGamePhase = "Flop";
                    // Optional: deck.DealCard(); // Burn card
                    for (int i = 0; i < 3; i++) { Card? c = deck.DealCard(); if (c != null) CommunityCards.Add(c); }
                    break;
                case "Flop":
                    CurrentGamePhase = "Turn";
                    // Optional: deck.DealCard(); // Burn card
                    Card? turnCard = deck.DealCard(); if (turnCard != null) CommunityCards.Add(turnCard);
                    break;
                case "Turn":
                    CurrentGamePhase = "River";
                    // Optional: deck.DealCard(); // Burn card
                    Card? riverCard = deck.DealCard(); if (riverCard != null) CommunityCards.Add(riverCard);
                    break;
                case "River":
                    CurrentGamePhase = "Showdown";
                    // Hier findet später die Auswertung statt
                    break;
                    // Kein Default nötig, da wir nur von gültigen Phasen aus voranschreiten
            }
            // Logik für nächste Setzrunde / Spieler am Zug würde hier folgen
        }
    }

    public class PokerGameService : IPokerGameService
    {
        // Statisches Dictionary, um aktive Spiele zu speichern (gameId -> PokerGame Instanz)
        // ACHTUNG: Für eine Produktionsanwendung müsste hier ggf. Thread-Sicherheit (z.B. ConcurrentDictionary)
        // und eine Strategie zum Aufräumen alter Spiele implementiert werden.
        // Für ein Uni-Projekt mit lokaler Entwicklung ist dies erstmal ausreichend.
        private static readonly Dictionary<string, PokerGame> activeGames = new Dictionary<string, PokerGame>();

        private readonly IDeck gameDeckInstance; // Hält die Singleton-Instanz des Decks

        public PokerGameService()
        {
            // Hole die Singleton-Instanz des Decks. 
            // Wenn IDeck als Singleton im DI-Container registriert wäre, würde man es hier injizieren.
            // Da Deck.Instance ein statischer Singleton ist, können wir ihn direkt verwenden.
            this.gameDeckInstance = Deck.Instance;
        }

        // Dieser Konstruktor ist gut für Tests, falls man ein gemocktes IDeck injizieren möchte.
        // Wenn du IDeck als Singleton im DI-Container registrierst, würde dieser Konstruktor verwendet.
        public PokerGameService(IDeck injectedDeck)
        {
            this.gameDeckInstance = injectedDeck;
        }

        public GameStateDto StartOfflineGame(string humanPlayerName = "Player 1", int numberOfAICopponents = 1) // Standardmäßig 1 KI Gegner
        {
            if (numberOfAICopponents < 0) // Mindestens 0 KI Gegner
            {
                throw new ArgumentException("Anzahl der KI-Gegner darf nicht negativ sein.");
            }

            string gameId = Guid.NewGuid().ToString();
            PokerGame newGame = new PokerGame(gameId, this.gameDeckInstance); // Verwende die gehaltene Deck-Instanz

            newGame.SetupNewOfflineRound(humanPlayerName, numberOfAICopponents, 0); // initialChips = 0
            newGame.DealInitialHands(2);

            // Füge das neue Spiel zum Dictionary der aktiven Spiele hinzu
            // Lock für Thread-Sicherheit, falls mehrere Anfragen gleichzeitig ein Spiel starten (unwahrscheinlich hier)
            lock (activeGames)
            {
                activeGames[gameId] = newGame;
            }

            return MapGameToDto(newGame);
        }

        public GameStateDto AdvanceGamePhase(string gameId)
        {
            PokerGame? gameInstance;
            lock (activeGames) // Lock für sicheren Zugriff auf das Dictionary
            {
                activeGames.TryGetValue(gameId, out gameInstance);
            }

            if (gameInstance == null)
            {
                throw new ArgumentException($"Spiel mit ID '{gameId}' nicht gefunden.");
            }

            // Verhindere das Voranschreiten, wenn das Spiel bereits im Showdown oder noch nicht gestartet ist.
            if (gameInstance.CurrentGamePhase == "Showdown" ||
                gameInstance.CurrentGamePhase == "Lobby" ||
                string.IsNullOrEmpty(gameInstance.CurrentGamePhase))
            {
                return MapGameToDto(gameInstance); // Gibt den aktuellen Zustand zurück
            }

            gameInstance.AdvancePhase();
            return MapGameToDto(gameInstance);
        }

        private GameStateDto MapGameToDto(PokerGame game)
        {
            if (game == null)
            {
                // Dieser Fall sollte idealerweise nicht eintreten, wenn die Aufrufer game prüfen.
                // Aber als zusätzliche Absicherung:
                throw new ArgumentNullException(nameof(game), "Das übergebene Spielobjekt darf nicht null sein.");
            }

            return new GameStateDto
            {
                GameId = game.GameId, // Korrigiert von rGameId
                Players = game.Players.Select(p => new PlayerDto
                {
                    Id = p.Id,
                    Hand = (!p.IsAI || game.CurrentGamePhase == "Showdown")
                           ? p.Hand.Select(c => new CardDto(c)).ToList()
                           : p.Hand.Select(_ => new CardDto { Rank = "Hidden", Suit = "Hidden", DisplayName = "BACK" }).ToList(),
                    Chips = p.Chips,
                    IsActive = true, // Vereinfachung
                    IsAI = p.IsAI
                }).ToList(),
                CommunityCards = game.CommunityCards.Select(c => new CardDto(c)).ToList(),
                Pot = game.Pot,
                CurrentPlayerTurnId = game.Players.Any() && game.Players.Count > game.CurrentPlayerIndex ? game.Players[game.CurrentPlayerIndex].Id : string.Empty,
                CurrentGamePhase = game.CurrentGamePhase
            };
        }
    }
}