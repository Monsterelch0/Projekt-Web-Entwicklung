using CasinoApp.Interfaces;
using CasinoApp.Models;
using System; 
using System.Collections.Generic;

namespace CasinoApp.Services
{
    public class CardFactory : ICardFactory
    {
        public Card CreateCard(Suit suit, Rank rank)
        {
    
            return new Card(suit, rank);
        }

        public List<Card> CreateStandardDeck()
        {
            var deck = new List<Card>();
        
            foreach (Suit suit in (Suit[])Enum.GetValues(typeof(Suit)))
            {
                foreach (Rank rank in (Rank[])Enum.GetValues(typeof(Rank)))
                {
                    deck.Add(CreateCard(suit, rank));
                }
            }
            return deck;
        }
    }
}