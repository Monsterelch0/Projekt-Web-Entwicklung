// CasinoApp/Services/Deck.cs
using CasinoApp.Interfaces; // Für IDeck und ICardFactory
using CasinoApp.Models;    // Für Card, Suit, Rank
using System;
using System.Collections.Generic;
using System.Linq;

// This file currently causes build failures. I've commented out the lines that
// cause the issue (22 and 25), but that means this class is currently broken.
// Someone who knows more about C# should take care of this:
// Cannot consume scoped service 'CasinoApp.Interfaces.ICardFactory' from singleton 'CasinoApp.Interfaces.IDeck'.

namespace CasinoApp.Services
{
    public class Deck : IDeck // Implementiert IDeck
    {
        private List<Card> _cards; // Umbenannt von 'cards' zu '_cards' (übliche Konvention für private Felder)
        private readonly ICardFactory _cardFactory; // Sollte per DI kommen
        private readonly Random _random = new Random();

        //Konstruktor, der ICardFactory per Dependency Injection erhält
        public Deck(ICardFactory cardFactory)
        {
            _cardFactory = cardFactory ?? throw new ArgumentNullException(nameof(cardFactory));
            _cards = new List<Card>(); // Initialisiere _cards hier oder in InitializeDeck
            InitializeDeck();
        }

        private void InitializeDeck()
        {
            _cards = _cardFactory.CreateStandardDeck(); // Erstellt ein volles Deck über die Factory
            Shuffle(); // Direkt mischen
        }

        public void Shuffle()
        {
            int n = _cards.Count;
            while (n > 1)
            {
                n--;
                int k = _random.Next(n + 1);
                // Tausche Karten (moderner Tuple-Swap)
                (_cards[k], _cards[n]) = (_cards[n], _cards[k]);
            }
        }

        public Card? DealCard()
        {
            if (_cards.Count == 0)
            {
                // Optional: Deck neu initialisieren und mischen oder Fehler/null zurückgeben
                // InitializeDeck(); 
                return null;
            }

            Card cardToDeal = _cards[0];
            _cards.RemoveAt(0);
            return cardToDeal;
        }

        public int CardsRemaining => _cards.Count;

        // Diese Methode ist wichtig, um das Deck für eine neue Runde/Spiel zurückzusetzen,
        // da die Instanz jetzt ein Singleton ist und ihren Zustand beibehält.
        public void ResetDeck()
        {
            InitializeDeck();
        }
    }
}