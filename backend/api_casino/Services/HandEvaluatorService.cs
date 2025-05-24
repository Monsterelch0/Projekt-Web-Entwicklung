// CasinoApp/Services/HandEvaluatorService.cs
using CasinoApp.Interfaces; // WICHTIG: Um das Interface aus dem korrekten Namespace zu verwenden
using CasinoApp.Models;
using CasinoApp.Models.PokerLogic;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CasinoApp.Services
{
    // Die Interface-Definition wurde hier entfernt.

    public class HandEvaluatorService : IHandEvaluatorService // Implementiert das Interface aus CasinoApp.Interfaces
    {
        public EvaluatedHand EvaluateHand(List<Card> fiveCardHand)
        {
            // ... (die gesamte Logik zur Handbewertung bleibt hier) ...
            if (fiveCardHand == null || fiveCardHand.Count != 5)
            {
                throw new ArgumentException("Eine Pokerhand muss aus genau 5 Karten bestehen.");
            }

            var sortedHand = fiveCardHand.OrderByDescending(c => c.Rank).ToList();
            var rankCounts = GetRankCounts(sortedHand);
            bool isFlush = IsFlush(sortedHand);
            bool isStraight = IsStraight(sortedHand);

            // 1. Royal Flush / Straight Flush
            if (isStraight && isFlush)
            {
                List<Card> straightFlushCards = DetermineStraightCards(sortedHand);
                if (straightFlushCards[0].Rank == Rank.Ace && straightFlushCards[4].Rank == Rank.Ten)
                {
                    return new EvaluatedHand(HandRank.RoyalFlush, straightFlushCards, new List<Rank>());
                }
                return new EvaluatedHand(HandRank.StraightFlush, straightFlushCards, straightFlushCards.Select(c => c.Rank).ToList());
            }
            // 2. Four of a Kind (Vierling)
            var fourOfAKindResult = CheckFourOfAKind(sortedHand, rankCounts);
            if (fourOfAKindResult != null) return fourOfAKindResult;
            // 3. Full House
            var fullHouseResult = CheckFullHouse(sortedHand, rankCounts);
            if (fullHouseResult != null) return fullHouseResult;
            // 4. Flush (Farbe)
            if (isFlush)
            {
                return new EvaluatedHand(HandRank.Flush, new List<Card>(sortedHand), sortedHand.Select(c => c.Rank).ToList());
            }
            // 5. Straight (Straße)
            if (isStraight)
            {
                List<Card> straightCards = DetermineStraightCards(sortedHand);
                return new EvaluatedHand(HandRank.Straight, straightCards, straightCards.Select(c => c.Rank).ToList());
            }
            // 6. Three of a Kind (Drilling)
            var threeOfAKindResult = CheckThreeOfAKind(sortedHand, rankCounts);
            if (threeOfAKindResult != null) return threeOfAKindResult;
            // 7. Two Pair (Zwei Paare)
            var twoPairResult = CheckTwoPair(sortedHand, rankCounts);
            if (twoPairResult != null) return twoPairResult;
            // 8. One Pair (Ein Paar)
            var onePairResult = CheckOnePair(sortedHand, rankCounts);
            if (onePairResult != null) return onePairResult;
            // 9. High Card (Höchste Karte)
            return new EvaluatedHand(HandRank.HighCard, new List<Card>(sortedHand), sortedHand.Select(c => c.Rank).ToList());
        }

        // HIER FOLGEN ALLE DEINE privaten Hilfsmethoden:
        // GetRankCounts, IsFlush, IsStraight, DetermineStraightCards,
        // CheckFourOfAKind, CheckFullHouse, CheckThreeOfAKind,
        // CheckTwoPair, CheckOnePair
        // (Diese bleiben unverändert, wie du sie gepostet hast)
        private Dictionary<Rank, int> GetRankCounts(List<Card> hand)
        {
            return hand.GroupBy(card => card.Rank)
                       .ToDictionary(group => group.Key, group => group.Count());
        }

        private bool IsFlush(List<Card> hand)
        {
            if (hand == null || hand.Count != 5) return false;
            var firstSuit = hand[0].Suit;
            return hand.All(card => card.Suit == firstSuit);
        }

        private bool IsStraight(List<Card> sortedHand)
        {
            if (sortedHand == null || sortedHand.Count != 5) return false;
            bool normalStraight = true;
            for (int i = 0; i < 4; i++)
            {
                if ((int)sortedHand[i].Rank != (int)sortedHand[i + 1].Rank + 1)
                {
                    normalStraight = false;
                    break;
                }
            }
            if (normalStraight) return true;
            if (sortedHand[0].Rank == Rank.Ace && sortedHand[1].Rank == Rank.Five && sortedHand[2].Rank == Rank.Four && sortedHand[3].Rank == Rank.Three && sortedHand[4].Rank == Rank.Two)
            {
                return true;
            }
            return false;
        }

        private List<Card> DetermineStraightCards(List<Card> sortedHand)
        {
            if (sortedHand[0].Rank == Rank.Ace && sortedHand[1].Rank == Rank.Five)
            {
                var wheelHand = new List<Card> { sortedHand[1], sortedHand[2], sortedHand[3], sortedHand[4], sortedHand[0] };
                return wheelHand;
            }
            return new List<Card>(sortedHand);
        }

        private EvaluatedHand? CheckFourOfAKind(List<Card> sortedHand, Dictionary<Rank, int> rankCounts)
        {
            var fourKindRankEntry = rankCounts.FirstOrDefault(kvp => kvp.Value == 4);
            if (fourKindRankEntry.Key != default(Rank))
            {
                Rank fourRank = fourKindRankEntry.Key;
                var bestCards = sortedHand.Where(c => c.Rank == fourRank).ToList();
                var kickerCard = sortedHand.First(c => c.Rank != fourRank);
                bestCards.Add(kickerCard);
                return new EvaluatedHand(HandRank.FourOfAKind, bestCards.OrderByDescending(c => c.Rank).ToList(),
                                         new List<Rank> { fourRank, kickerCard.Rank });
            }
            return null;
        }

        private EvaluatedHand? CheckFullHouse(List<Card> sortedHand, Dictionary<Rank, int> rankCounts)
        {
            var threeKindRankEntry = rankCounts.FirstOrDefault(kvp => kvp.Value == 3);
            var pairRankEntry = rankCounts.FirstOrDefault(kvp => kvp.Value == 2);

            if (threeKindRankEntry.Key != default(Rank) && pairRankEntry.Key != default(Rank))
            {
                Rank threeRank = threeKindRankEntry.Key;
                Rank pairRank = pairRankEntry.Key;
                return new EvaluatedHand(HandRank.FullHouse, new List<Card>(sortedHand),
                                         new List<Rank> { threeRank, pairRank });
            }
            return null;
        }

        private EvaluatedHand? CheckThreeOfAKind(List<Card> sortedHand, Dictionary<Rank, int> rankCounts)
        {
            var threeKindRankEntry = rankCounts.FirstOrDefault(kvp => kvp.Value == 3);
            if (threeKindRankEntry.Key != default(Rank) && !rankCounts.Any(kvp => kvp.Value == 2))
            {
                Rank threeRank = threeKindRankEntry.Key;
                var drillingCards = sortedHand.Where(c => c.Rank == threeRank).ToList();
                var kickerCards = sortedHand.Where(c => c.Rank != threeRank)
                                           .OrderByDescending(c => c.Rank)
                                           .Take(2)
                                           .ToList();
                var bestCards = drillingCards.Concat(kickerCards).OrderByDescending(c => c.Rank).ToList();
                return new EvaluatedHand(HandRank.ThreeOfAKind, bestCards,
                                         new List<Rank> { threeRank }.Concat(kickerCards.Select(k => k.Rank)).ToList());
            }
            return null;
        }

        private EvaluatedHand? CheckTwoPair(List<Card> sortedHand, Dictionary<Rank, int> rankCounts)
        {
            var pairsRanks = rankCounts.Where(kvp => kvp.Value == 2)
                                     .Select(kvp => kvp.Key)
                                     .OrderByDescending(r => r)
                                     .ToList();
            if (pairsRanks.Count >= 2)
            {
                Rank highPairRank = pairsRanks[0];
                Rank lowPairRank = pairsRanks[1];
                var pairCards = sortedHand.Where(c => c.Rank == highPairRank || c.Rank == lowPairRank).ToList();
                var kickerCard = sortedHand.First(c => c.Rank != highPairRank && c.Rank != lowPairRank);
                var bestCards = pairCards.Concat(new List<Card> { kickerCard }).OrderByDescending(c => c.Rank).ToList();
                return new EvaluatedHand(HandRank.TwoPair, bestCards,
                                         new List<Rank> { highPairRank, lowPairRank, kickerCard.Rank });
            }
            return null;
        }

        private EvaluatedHand? CheckOnePair(List<Card> sortedHand, Dictionary<Rank, int> rankCounts)
        {
            var pairRankEntry = rankCounts.FirstOrDefault(kvp => kvp.Value == 2);
            bool isOnlyOnePair = rankCounts.Count(kvp => kvp.Value == 2) == 1;
            bool noBetterCombination = !rankCounts.Any(kvp => kvp.Value >= 3);
            if (pairRankEntry.Key != default(Rank) && isOnlyOnePair && noBetterCombination)
            {
                Rank pairRank = pairRankEntry.Key;
                var pairCards = sortedHand.Where(c => c.Rank == pairRank).ToList();
                var kickerCards = sortedHand.Where(c => c.Rank != pairRank)
                                           .OrderByDescending(c => c.Rank)
                                           .Take(3)
                                           .ToList();
                var bestCards = pairCards.Concat(kickerCards).OrderByDescending(c => c.Rank).ToList();
                return new EvaluatedHand(HandRank.OnePair, bestCards,
                                         new List<Rank> { pairRank }.Concat(kickerCards.Select(k => k.Rank)).ToList());
            }
            return null;
        }
    }
}