// CasinoApp/Models/PokerLogic/PokerHandUtility.cs
using CasinoApp.Models; // F�r den Zugriff auf die Card-Klasse
using System.Collections.Generic;
using System.Linq;

namespace CasinoApp.Models.PokerLogic
{
    public static class PokerHandUtility
    {
        /// <summary>
        /// Generiert alle m�glichen 5-Karten-Kombinationen aus einer gegebenen Liste von Karten.
        /// Diese Methode ist optimiert f�r den Fall "5 aus 7", kann aber angepasst werden.
        /// </summary>
        /// <param name="availableCards">Eine Liste von typischerweise 7 Karten (2 Hole Cards + 5 Community Cards).</param>
        /// <returns>Eine Aufz�hlung aller m�glichen 5-Karten-H�nde.</returns>
        public static IEnumerable<List<Card>> GetAllFiveCardCombinations(List<Card> availableCards)
        {
            if (availableCards == null || availableCards.Count < 5)
            {
                // Nicht gen�gend Karten, um eine 5-Karten-Hand zu bilden
                yield break;
            }

            // Wenn genau 5 Karten vorhanden sind, gibt es nur eine Kombination
            if (availableCards.Count == 5)
            {
                yield return new List<Card>(availableCards);
                yield break;
            }

            // Algorithmus f�r k-Kombinationen (hier k=5)
            // F�r den spezifischen Fall "5 aus 7" ist es einfacher, die 2 Karten zu w�hlen, die NICHT dabei sind.
            // 7 Karten -> w�hle 2 aus, die weggelassen werden (7 �ber 2 = 21 Kombinationen)
            // Oder wir generieren direkt die 5-Karten-Kombinationen:

            int k = 5; // Anzahl der zu w�hlenden Karten
            int n = availableCards.Count;
            List<Card> currentCombination = new List<Card>(k);

            // Initialisiere die erste Kombination
            for (int i = 0; i < k; i++)
            {
                if (i < n) // Sicherstellen, dass wir nicht �ber die Grenzen gehen, falls weniger als k Karten da sind
                    currentCombination.Add(availableCards[i]);
                else
                    yield break; // Nicht genug Karten f�r die erste Kombination
            }

            // Hilfs-Array f�r Indizes
            int[] indices = new int[k];
            for (int i = 0; i < k; i++) indices[i] = i;

            while (indices[0] <= n - k)
            {
                // Aktuelle Kombination basierend auf Indizes erstellen
                var combination = new List<Card>();
                for (int i = 0; i < k; i++)
                {
                    combination.Add(availableCards[indices[i]]);
                }
                yield return combination;

                // N�chste Kombination finden
                int t = k - 1;
                while (t != 0 && indices[t] == n - k + t)
                {
                    t--;
                }
                indices[t]++;
                for (int i = t + 1; i < k; i++)
                {
                    indices[i] = indices[i - 1] + 1;
                }
            }
        }

        // Beispiel f�r eine einfachere Implementierung spezifisch f�r "5 aus 7"
        // durch Auswahl der 2 wegzulassenden Karten:
        public static IEnumerable<List<Card>> GetFiveCardCombinationsFromSeven(List<Card> sevenCards)
        {
            if (sevenCards == null || sevenCards.Count != 7)
            {
                // Diese Methode ist spezifisch f�r 7 Karten
                // throw new ArgumentException("Diese Methode erwartet genau 7 Karten.");
                // oder einfach nichts zur�ckgeben, wenn der Input nicht passt
                yield break;
            }

            // W�hle 2 Karten aus, die *nicht* in der 5-Karten-Hand sind
            for (int i = 0; i < sevenCards.Count; i++)
            {
                for (int j = i + 1; j < sevenCards.Count; j++)
                {
                    List<Card> fiveCardHand = new List<Card>();
                    for (int k = 0; k < sevenCards.Count; k++)
                    {
                        if (k != i && k != j) // Alle Karten au�er den beiden ausgew�hlten
                        {
                            fiveCardHand.Add(sevenCards[k]);
                        }
                    }
                    yield return fiveCardHand;
                }
            }
        }
    }
}