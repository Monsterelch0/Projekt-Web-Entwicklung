using CasinoApp.Interfaces;
using CasinoApp.Models;
using System;
using System.Collections.Generic;
using System.Linq; 

namespace CasinoApp.Services
{
    public class Deck : IDeck
    {
        
        private static readonly Lazy<Deck> instance = new Lazy<Deck>(() => new Deck());

        private List<Card> cards;
        private readonly ICardFactory cardFactory; 
        private readonly Random random = new Random();

        
        public static Deck Instance => instance.Value;

       
        private Deck()
        {
            this.cardFactory = new CardFactory();
            InitializeDeck();
        }

        private void InitializeDeck()
        {
            this.cards = this.cardFactory.CreateStandardDeck();
            Shuffle();
        } 

        public void Shuffle()
        {
            int n = cards.Count;
            while (n > 1)
            {
                n--;
                int k = random.Next(n + 1);
                (cards[k], cards[n]) = (cards[n], cards[k]);
            }
        }

        public Card? DealCard()
        {
            if (cards.Count == 0)
            {
              
                return null;
            }

            Card cardToDeal = cards[0];
            cards.RemoveAt(0);
            return cardToDeal;
        }

        public int CardsRemaining => cards.Count;

        
        public void ResetDeck()
        {
            InitializeDeck();
        }
    }
}