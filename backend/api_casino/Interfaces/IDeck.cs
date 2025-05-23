using CasinoApp.Models;

namespace CasinoApp.Interfaces
{
    public interface IDeck
    {
        void Shuffle();
        Card? DealCard(); 
        int CardsRemaining { get; }
        void ResetDeck(); 
    }
}