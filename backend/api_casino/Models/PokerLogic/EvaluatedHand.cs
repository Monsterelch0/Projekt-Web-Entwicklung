// CasinoApp/Models/PokerLogic/EvaluatedHand.cs
using CasinoApp.Models;
using System; // Für IComparable
using System.Collections.Generic;
using System.Linq;

namespace CasinoApp.Models.PokerLogic
{
    public class EvaluatedHand : IComparable<EvaluatedHand>
    {
        public HandRank Rank { get; }
        public List<Card> BestFiveCards { get; }
        public List<Rank> KickersInOrder { get; } // Wichtig für den Vergleich

        public EvaluatedHand(HandRank rank, List<Card> bestFiveCards, List<Rank> kickersInOrder)
        {
            this.Rank = rank;
            // Stelle sicher, dass BestFiveCards sortiert ist, falls nicht schon geschehen
            // Dies ist wichtig für konsistente Kicker-Vergleiche, falls KickersInOrder leer ist
            // und wir auf BestFiveCards zurückfallen.
            this.BestFiveCards = bestFiveCards?.OrderByDescending(c => c.Rank).Take(5).ToList() ?? new List<Card>();

            // KickersInOrder sollte bereits die Ränge in der relevanten Reihenfolge für den Vergleich enthalten.
            this.KickersInOrder = kickersInOrder ?? new List<Rank>();
        }

        public override string ToString()
        {
            string cardsString = string.Join(", ", BestFiveCards.Select(c => c.ToString()));
            string kickersString = KickersInOrder.Any() ? $" Significant Ranks/Kickers: {string.Join(", ", KickersInOrder.Select(k => k.ToString()))}" : "";
            return $"{Rank} ({cardsString}){kickersString}";
        }

        /// <summary>
        /// Vergleicht diese Hand mit einer anderen EvaluatedHand.
        /// </summary>
        /// <returns>
        /// Ein negativer Wert, wenn diese Hand schwächer ist als otherHand.
        /// Null, wenn die Hände gleichwertig sind (Split Pot).
        /// Ein positiver Wert, wenn diese Hand stärker ist als otherHand.
        /// </returns>
        public int CompareTo(EvaluatedHand? otherHand)
        {
            if (otherHand == null) return 1; // Diese Hand ist besser als nichts

            // 1. Vergleiche den HandRank
            if (this.Rank > otherHand.Rank) return 1; // Höherer Rang gewinnt
            if (this.Rank < otherHand.Rank) return -1; // Niedrigerer Rang verliert

            // 2. Wenn HandRanks gleich sind, vergleiche basierend auf KickersInOrder
            //    KickersInOrder wurde vom HandEvaluatorService so befüllt, dass die
            //    wichtigsten Vergleichswerte vorne stehen (z.B. Rang des Paares, dann Kicker).
            for (int i = 0; i < this.KickersInOrder.Count; i++)
            {
                // Wenn otherHand weniger Kicker hat (sollte bei gleichem Rang nicht passieren, aber zur Sicherheit)
                if (i >= otherHand.KickersInOrder.Count) return 1; // Diese Hand hat mehr Kicker-Infos, gilt als stärker

                if (this.KickersInOrder[i] > otherHand.KickersInOrder[i]) return 1;
                if (this.KickersInOrder[i] < otherHand.KickersInOrder[i]) return -1;
            }

            // Wenn otherHand mehr Kicker-Infos hat (sollte auch nicht passieren bei gleichem Rang und korrekter Kicker-Befüllung)
            if (this.KickersInOrder.Count < otherHand.KickersInOrder.Count) return -1;

            // Wenn alle Ränge und Kicker identisch sind, ist es ein Unentschieden (Split Pot)
            return 0;
        }
    }
}