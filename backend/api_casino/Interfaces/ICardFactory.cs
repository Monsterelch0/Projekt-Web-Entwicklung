using CasinoApp.Models;
using System.Collections.Generic;

namespace CasinoApp.Interfaces
{
    public interface ICardFactory
    {
        Card CreateCard(Suit suit, Rank rank);
        List<Card> CreateStandardDeck();
    }
}