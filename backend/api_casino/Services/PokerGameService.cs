// In Services/PokerGameService.cs

using CasinoApp.Interfaces; // F�r IDeck, IPokerGameService, IHandEvaluatorService
using CasinoApp.Models;    // F�r Player, Card, GameStateDto, CardDto
using CasinoApp.Models.PokerLogic; // F�r HandRank, EvaluatedHand, PokerHandUtility
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
        public int CurrentPlayerIndex { get; set; } // F�r sp�tere Spielerzuglogik
        public string CurrentGamePhase { get; set; }
        private readonly IDeck _deck; // Umbenannt f�r Klarheit

        // NEUE Eigenschaften f�r Gewinnerinformationen
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
            WinnerIds.Clear(); // Gewinner zur�cksetzen f�r neue Runde
            WinningHandDescription = string.Empty; // Beschreibung zur�cksetzen
            Pot = 0;

            // Spieler hinzuf�gen (stelle sicher, dass Player.IsActive hier auf true gesetzt wird)
            var human = new Player(humanPlayerName, initialChips, isAI: false) { IsActive = true };
            Players.Add(human);
            for (int i = 0; i < numberOfAICopponents; i++)
            {
                var aiPlayer = new Player($"AI Opponent {i + 1}", initialChips, isAI: true) { IsActive = true };
                Players.Add(aiPlayer);
            }

            CurrentGamePhase = "PreFlop";
            CurrentPlayerIndex = 0; // Oder Logik f�r Dealer-Button etc.
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
            // Zuk�nftig: Logik f�r n�chste Setzrunde hier oder im PokerGameService
        }

        private void DetermineAndSetWinner(IHandEvaluatorService handEvaluator)
        {
            // Stelle sicher, dass die Community Cards vollst�ndig sind f�r einen sinnvollen Showdown
            if (CommunityCards.Count < 5 && Players.Count > 1)
            {
                // Dies sollte nicht passieren, wenn AdvancePhaseAndEvaluate korrekt aufgerufen wird
                WinningHandDescription = "Showdown nicht m�glich, Community Cards unvollst�ndig.";
                return;
            }

            // Ber�cksichtige nur Spieler, die noch aktiv im Spiel sind (nicht gefoldet haben)
            // ANNAHME: Deine Player-Klasse hat eine 'IsActive'-Eigenschaft.
            var activePlayers = Players.Where(p => p.IsActive).ToList();

            if (!activePlayers.Any())
            {
                WinningHandDescription = "Keine aktiven Spieler f�r den Showdown.";
                return;
            }

            if (activePlayers.Count == 1)
            {
                WinnerIds.Add(activePlayers[0].Id);
                WinningHandDescription = $"{activePlayers[0].Id} gewinnt, da alle anderen Spieler nicht aktiv sind.";
                return;
            }

            var playerEvaluatedHands = new List<(Player Player, EvaluatedHand HandDetails)>();

            foreach (var player in activePlayers)
            {
                if (player.Hand.Count < 2 && CommunityCards.Count < 3) // Grundlegende Pr�fung
                {
                    continue;
                }

                List<Card> allSevenCards = new List<Card>(player.Hand);
                allSevenCards.AddRange(CommunityCards);

                if (allSevenCards.Count < 5) continue; // Kann keine 5-Karten-Hand bilden

                EvaluatedHand? bestPlayerHand = null;
                foreach (var fiveCardCombination in PokerHandUtility.GetFiveCardCombinationsFromSeven(allSevenCards))
                {
                    if (fiveCardCombination.Count == 5) // Stelle sicher, dass es eine 5-Karten-Kombi ist
                    {
                        EvaluatedHand currentEval = handEvaluator.EvaluateHand(fiveCardCombination);
                        if (bestPlayerHand == null || currentEval.CompareTo(bestPlayerHand) > 0)
                        {
                            bestPlayerHand = currentEval;
                        }
                    }
                }

                if (bestPlayerHand != null)
                {
                    playerEvaluatedHands.Add((player, bestPlayerHand));
                }
            }

            if (!playerEvaluatedHands.Any())
            {
                WinningHandDescription = "Konnte keine H�nde der aktiven Spieler bewerten.";
                WinnerIds.Clear(); // Stelle sicher, dass keine alten Gewinner drin sind
                return;
            }

            EvaluatedHand winningEvaluatedHand = playerEvaluatedHands[0].HandDetails;
            WinnerIds.Clear(); // Zuerst alte Gewinner l�schen
            WinnerIds.Add(playerEvaluatedHands[0].Player.Id);

            // �berpr�fe auf Split Pot
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

            // === ANPASSUNG DER WINNINGHANDDESCRIPTION ===
            string handRankName = ConvertHandRankToReadableString(winningEvaluatedHand.Rank);

            if (WinnerIds.Count > 1)
            {
                WinningHandDescription = $"Split Pot! Gewinner: {string.Join(" und ", WinnerIds)} mit: {handRankName}";
            }
            else
            {
                WinningHandDescription = $"{WinnerIds[0]} Winns with: {handRankName}";
            }
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

        private readonly IDeck _deckService; // Umbenannt f�r Klarheit und um Konflikte zu vermeiden
        private readonly IHandEvaluatorService _handEvaluatorService; // Umbenannt

        // Konstruktor f�r Dependency Injection
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

            // �bergebe den _handEvaluatorService an die Methode
            gameInstance.AdvancePhaseAndEvaluate(_handEvaluatorService);
            return MapGameToDto(gameInstance);
        }

        private GameStateDto MapGameToDto(PokerGame game)
        {
            if (game == null)
            {
                throw new ArgumentNullException(nameof(game), "Das �bergebene Spielobjekt darf nicht null sein.");
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
                    IsActive = p.IsActive, // �bernehme IsActive vom Player-Modell
                    IsAI = p.IsAI
                }).ToList(),
                CommunityCards = game.CommunityCards.Select(c => new CardDto(c)).ToList(),
                Pot = game.Pot,
                CurrentPlayerTurnId = game.Players.FirstOrDefault(p => p.IsActive)?.Id ?? (game.Players.Any() ? game.Players[game.CurrentPlayerIndex].Id : string.Empty), // Vereinfachte Logik f�r den Start
                CurrentGamePhase = game.CurrentGamePhase,
                // NEU: Gewinnerinformationen zum DTO hinzuf�gen
                WinnerIds = new List<string>(game.WinnerIds), // Kopie der Liste
                WinningHandDescription = game.WinningHandDescription
            };
        }
    }
}