using CasinoApp.Models;


namespace CasinoApp.Interfaces
{
    public interface IPokerGameService
    {
        GameStateDto StartOfflineGame(string humanPlayerName = "Player 1", int numberOfAICopponents = 1);
        GameStateDto AdvanceGamePhase(string gameId);
    }
}