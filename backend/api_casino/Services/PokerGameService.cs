// In Services/PokerGameService.cs

using CasinoApp.Interfaces; // Für IDeck, IPokerGameService, IHandEvaluatorService
using CasinoApp.Models;    // Für Player, Card, GameStateDto, CardDto
using CasinoApp.Models.PokerLogic; // Für HandRank, EvaluatedHand, PokerHandUtility
using System;
using System.Collections.Generic;
using System.Linq;

namespace CasinoApp.Services
{
    internal class PokerGame
    {
        public string GameId { get; }
        public List<Player> Players { get; }
        public List<Card> CommunityCards { get; }
        public int Pot { get; set; }
        public int CurrentPlayerIndex { get; set; } // Für spätere Spielerzuglogik
        public string CurrentGamePhase { get; set; }
        private readonly IDeck _deck; // Umbenannt für Klarheit

        // NEUE Eigenschaften für Gewinnerinformationen
        public List<string> WinnerIds { get; private set; }
        public string WinningHandDescription { get; private set; }

        public PokerGame(string gameId, IDeck gameDeck)
        {
            GameId = gameId;
            _deck = gameDeck;
            Players = new List<Player>();
            CommunityCards = new List<Card>();
            Pot = 0;
            CurrentGamePhase = "Lobby";
            WinnerIds = new List<string>();
            WinningHandDescription = string.Empty;
        }

        public void SetupNewOfflineRound(string humanPlayerName, int numberOfAICopponents, int initialChips)
        {
            if (_deck == null) throw new InvalidOperationException("Deck ist nicht initialisiert.");
            _deck.ResetDeck();
            Players.Clear();
            CommunityCards.Clear();
            WinnerIds.Clear(); // Gewinner zurücksetzen für neue Runde
            WinningHandDescription = string.Empty; // Beschreibung zurücksetzen
            Pot = 0;

            // Spieler hinzufügen (stelle sicher, dass Player.IsActive hier auf true gesetzt wird)
            var human = new Player(humanPlayerName, initialChips, isAI: false) { IsActive = true };
            Players.Add(human);
            for (int i = 0; i < numberOfAICopponents; i++)
            {
                var aiPlayer = new Player($"AI Opponent {i + 1}", initialChips, isAI: true) { IsActive = true };
                Players.Add(aiPlayer);
            }

            CurrentGamePhase = "PreFlop";
            CurrentPlayerIndex = 0; // Oder Logik für Dealer-Button etc.
        }

        public void DealInitialHands(int numberOfCards = 2)
        {
            if (_deck == null) throw new InvalidOperationException("Deck ist nicht initialisiert.");
            foreach (var player in Players)
            {
                player.ClearHand(); // Bestehende Karten entfernen
                for (int i = 0; i < numberOfCards; i++)
                {
                    Card? card = _deck.DealCard();
                    if (card != null)
                    {
                        player.AddCardToHand(card);
                    }
                }
            }
        }

        public void AdvancePhaseAndEvaluate(IHandEvaluatorService handEvaluator)
        {
            if (_deck == null) throw new InvalidOperationException("Deck ist nicht initialisiert.");

            bool needsEvaluation = false;
            switch (CurrentGamePhase)
            {
                case "PreFlop":
                    CurrentGamePhase = "Flop";
                    // deck.DealCard(); // Burn card (optional)
                    for (int i = 0; i < 3; i++) { Card? c = _deck.DealCard(); if (c != null) CommunityCards.Add(c); }
                    break;
                case "Flop":
                    CurrentGamePhase = "Turn";
                    // deck.DealCard(); // Burn card (optional)
                    Card? turnCard = _deck.DealCard(); if (turnCard != null) CommunityCards.Add(turnCard);
                    break;
                case "Turn":
                    CurrentGamePhase = "River";
                    // deck.DealCard(); // Burn card (optional)
                    Card? riverCard = _deck.DealCard(); if (riverCard != null) CommunityCards.Add(riverCard);
                    break;
                case "River":
                    CurrentGamePhase = "Showdown";
                    needsEvaluation = true;
                    break;
                default: // Lobby, Showdown oder unbekannte Phase
                    return;
            }

            if (needsEvaluation)
            {
                DetermineAndSetWinner(handEvaluator);
            }
            // Zukünftig: Logik für nächste Setzrunde hier oder im PokerGameService
        }

        private void DetermineAndSetWinner(IHandEvaluatorService handEvaluator)
        {
            Console.WriteLine(""); // Leerzeile für bessere Lesbarkeit im Log
            Console.WriteLine("[DEBUG] === DetermineAndSetWinner WIRD AUFGERUFEN ===");
            Console.WriteLine($"[DEBUG] Community Cards auf dem Tisch: {string.Join(", ", CommunityCards.Select(c => c.ToString()))}");

            var activePlayers = Players.Where(p => p.IsActive).ToList();

            if (!activePlayers.Any())
            {
                WinningHandDescription = "Keine aktiven Spieler für den Showdown.";
                WinnerIds.Clear();
                Console.WriteLine("[DEBUG] Keine aktiven Spieler für den Showdown gefunden.");
                return;
            }
            Console.WriteLine($"[DEBUG] Aktive Spieler für Showdown: {string.Join(", ", activePlayers.Select(p => p.Id))}");

            if (activePlayers.Count == 1)
            {
                WinnerIds.Clear();
                WinnerIds.Add(activePlayers[0].Id);
                WinningHandDescription = $"{activePlayers[0].Id} gewinnt (einziger aktiver Spieler).";
                Console.WriteLine($"[DEBUG] Nur ein aktiver Spieler: {WinningHandDescription}");
                return;
            }

            var playerEvaluatedHands = new List<(Player Player, EvaluatedHand HandDetails)>();

            foreach (var player in activePlayers)
            {
                Console.WriteLine($"[DEBUG] ---- Bewerte Spieler: {player.Id} ----");
                Console.WriteLine($"[DEBUG]   {player.Id} Handkarten: {string.Join(", ", player.Hand.Select(c => c.ToString()))}");

                List<Card> allSevenCards = new List<Card>(player.Hand);
                allSevenCards.AddRange(CommunityCards);

                if (allSevenCards.Count < 5)
                {
                    Console.WriteLine($"[DEBUG]   {player.Id} hat nicht genug Karten ({allSevenCards.Count}) für eine 5-Karten-Hand.");
                    continue;
                }

                EvaluatedHand? bestPlayerHand = null;
                var combinations = PokerHandUtility.GetFiveCardCombinationsFromSeven(allSevenCards).ToList();
                // Console.WriteLine($"[DEBUG]   {player.Id} hat {combinations.Count} mögliche 5-Karten-Kombinationen."); // Kann sehr viel Output erzeugen

                foreach (var fiveCardCombination in combinations)
                {
                    if (fiveCardCombination.Count == 5)
                    {
                        EvaluatedHand currentEval = handEvaluator.EvaluateHand(fiveCardCombination);
                        // Optional: Sehr detailliertes Logging jeder einzelnen 5-Karten-Kombination und ihrer Bewertung
                        // Console.WriteLine($"[DEBUG]     Kombi: {string.Join(", ", fiveCardCombination.Select(c=>c.ToString()))} -> Eval: {currentEval.Rank} / {currentEval.ToString()}");
                        if (bestPlayerHand == null || currentEval.CompareTo(bestPlayerHand) > 0)
                        {
                            bestPlayerHand = currentEval;
                        }
                    }
                }

                if (bestPlayerHand != null)
                {
                    Console.WriteLine($"[DEBUG]   ===> {player.Id} BESTE HAND: {bestPlayerHand.ToString()}");
                    playerEvaluatedHands.Add((player, bestPlayerHand));
                }
                else
                {
                    Console.WriteLine($"[DEBUG]   ===> {player.Id} konnte keine beste Hand ermitteln.");
                }
            }

            if (!playerEvaluatedHands.Any())
            {
                WinningHandDescription = "Konnte keine Hände der aktiven Spieler bewerten.";
                WinnerIds.Clear();
                Console.WriteLine("[DEBUG] Keine Hände für den finalen Vergleich bewertet.");
                return;
            }

            // Sortiere die bewerteten Hände der Spieler, die beste Hand zuerst
            playerEvaluatedHands.Sort((eval1, eval2) => eval2.HandDetails.CompareTo(eval1.HandDetails)); // Beste Hand an Index 0

            Console.WriteLine("[DEBUG] ---- Sortierte Hände für finalen Vergleich (Beste zuerst): ----");
            foreach (var peh in playerEvaluatedHands)
            {
                Console.WriteLine($"[DEBUG]   Spieler: {peh.Player.Id}, Hand: {peh.HandDetails.ToString()}");
            }

            EvaluatedHand winningEvaluatedHand = playerEvaluatedHands[0].HandDetails;
            WinnerIds.Clear();
            WinnerIds.Add(playerEvaluatedHands[0].Player.Id);

            // Überprüfe auf Split Pot
            for (int i = 1; i < playerEvaluatedHands.Count; i++)
            {
                if (playerEvaluatedHands[i].HandDetails.CompareTo(winningEvaluatedHand) == 0)
                {
                    WinnerIds.Add(playerEvaluatedHands[i].Player.Id);
                }
                else
                {
                    break;
                }
            }

            string handRankName = ConvertHandRankToReadableString(winningEvaluatedHand.Rank);

            if (WinnerIds.Count > 1)
            {
                WinningHandDescription = $"Split Pot! Winners: {string.Join(" and ", WinnerIds)} with: {handRankName}";
            }
            else
            {
                WinningHandDescription = $"{WinnerIds[0]} wins with: {handRankName}";
            }
            Console.WriteLine($"[DEBUG] === Finale Gewinner-Ermittlung abgeschlossen ===");
            Console.WriteLine($"[DEBUG] WinningHandDescription: {WinningHandDescription}");
            Console.WriteLine($"[DEBUG] WinnerIds: {string.Join(", ", WinnerIds)}");
            Console.WriteLine($"[DEBUG] Die tatsächlich stärkste Hand (laut Sortierung): {winningEvaluatedHand.ToString()}");
            Console.WriteLine("[DEBUG] ===========================================");
            Console.WriteLine(""); // Leerzeile danach
        }
        // Innerhalb der 'internal class PokerGame' oder als private statische Methode in 'PokerGameService'
        private string ConvertHandRankToReadableString(HandRank rank)
        {
            switch (rank)
            {
                case HandRank.HighCard: return "High Card";
                case HandRank.OnePair: return "One Pair";
                case HandRank.TwoPair: return "Two Pair";
                case HandRank.ThreeOfAKind: return "Three of a Kind"; // "with Three of a Kind"
                case HandRank.Straight: return "a Straight";        // "with a Straight"
                case HandRank.Flush: return "a Flush";            // "with a Flush"
                case HandRank.FullHouse: return "a Full House";       // "with a Full House"
                case HandRank.FourOfAKind: return "Four of a Kind";   // "with Four of a Kind"
                case HandRank.StraightFlush: return "a Straight Flush"; // "with a Straight Flush"
                case HandRank.RoyalFlush: return "a Royal Flush";
                default: return rank.ToString(); // Fallback
            }
        }
    }

    public class PokerGameService : IPokerGameService
    {
        private static readonly Dictionary<string, PokerGame> activeGames = new Dictionary<string, PokerGame>();

        private readonly IDeck _deckService; // Umbenannt für Klarheit und um Konflikte zu vermeiden
        private readonly IHandEvaluatorService _handEvaluatorService; // Umbenannt

        // Konstruktor für Dependency Injection
        public PokerGameService(IDeck deckService, IHandEvaluatorService handEvaluatorService)
        {
            _deckService = deckService;
            _handEvaluatorService = handEvaluatorService;
        }

        public GameStateDto StartOfflineGame(string humanPlayerName = "Player 1", int numberOfAICopponents = 1)
        {
            if (numberOfAICopponents < 0)
            {
                throw new ArgumentException("Anzahl der KI-Gegner darf nicht negativ sein.");
            }

            string gameId = Guid.NewGuid().ToString();
            // Verwende den injizierten _deckService
            PokerGame newGame = new PokerGame(gameId, _deckService);

            newGame.SetupNewOfflineRound(humanPlayerName, numberOfAICopponents, 0);
            newGame.DealInitialHands(2);

            lock (activeGames)
            {
                activeGames[gameId] = newGame;
            }

            return MapGameToDto(newGame);
        }

        public GameStateDto AdvanceGamePhase(string gameId)
        {
            PokerGame? gameInstance;
            lock (activeGames)
            {
                activeGames.TryGetValue(gameId, out gameInstance);
            }

            if (gameInstance == null)
            {
                throw new ArgumentException($"Spiel mit ID '{gameId}' nicht gefunden.");
            }

            if (gameInstance.CurrentGamePhase == "Showdown" ||
                gameInstance.CurrentGamePhase == "Lobby" ||
                string.IsNullOrEmpty(gameInstance.CurrentGamePhase))
            {
                return MapGameToDto(gameInstance);
            }

            // Übergebe den _handEvaluatorService an die Methode
            gameInstance.AdvancePhaseAndEvaluate(_handEvaluatorService);
            return MapGameToDto(gameInstance);
        }

        private GameStateDto MapGameToDto(PokerGame game)
        {
            if (game == null)
            {
                throw new ArgumentNullException(nameof(game), "Das übergebene Spielobjekt darf nicht null sein.");
            }

            return new GameStateDto
            {
                GameId = game.GameId, // Korrigiert von rGameId
                Players = game.Players.Select(p => new PlayerDto
                {
                    Id = p.Id,
                    Hand = (!p.IsAI && p.IsActive) || game.CurrentGamePhase == "Showdown" // Zeige Hand, wenn Spieler menschlich & aktiv ODER es Showdown ist
                           ? p.Hand.Select(c => new CardDto(c)).ToList()
                           : p.Hand.Select(_ => new CardDto { Rank = "Hidden", Suit = "Hidden", DisplayName = "BACK" }).ToList(),
                    Chips = p.Chips,
                    IsActive = p.IsActive, // Übernehme IsActive vom Player-Modell
                    IsAI = p.IsAI
                }).ToList(),
                CommunityCards = game.CommunityCards.Select(c => new CardDto(c)).ToList(),
                Pot = game.Pot,
                CurrentPlayerTurnId = game.Players.FirstOrDefault(p => p.IsActive)?.Id ?? (game.Players.Any() ? game.Players[game.CurrentPlayerIndex].Id : string.Empty), // Vereinfachte Logik für den Start
                CurrentGamePhase = game.CurrentGamePhase,
                // NEU: Gewinnerinformationen zum DTO hinzufügen
                WinnerIds = new List<string>(game.WinnerIds), // Kopie der Liste
                WinningHandDescription = game.WinningHandDescription
            };
        }
    }
}