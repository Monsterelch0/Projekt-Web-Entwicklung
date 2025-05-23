using CasinoApp.Interfaces;
using CasinoApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace CasinoApp.Controllers
{
    [ApiController]
    [Route("api/poker")] 
    public class PokerGameController : ControllerBase
    {
        private readonly IPokerGameService _pokerGameService;
        private readonly ILogger<PokerGameController> _logger;

        
        public PokerGameController(IPokerGameService pokerGameService, ILogger<PokerGameController> logger)
        {
            _pokerGameService = pokerGameService;
            _logger = logger; 
        }

        
        [HttpGet("startofflinegame")]
        public IActionResult StartOfflineGame([FromQuery] string? humanPlayerName, [FromQuery] int? numberOfAICopponents)
        {
            try
            {
               
                string name = humanPlayerName ?? "Player 1";
                int opponents = numberOfAICopponents ?? 1;

                _logger.LogInformation("StartOfflineGame called with player: {HumanPlayerName}, opponents: {NumberOfAICopponents}", name, opponents);

                GameStateDto gameState = _pokerGameService.StartOfflineGame(name, opponents);
                return Ok(gameState); 
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("ArgumentException in StartOfflineGame: {ErrorMessage}", ex.Message);
                return BadRequest(new { message = ex.Message }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in StartOfflineGame");
                return StatusCode(500, new { message = "Ein unerwarteter Fehler ist aufgetreten." }); 
            }
        }
        [HttpPost("{gameId}/nextphase")] // Ein POST ist hier passender, da wir den Zustand ändern
        public IActionResult AdvancePhase(string gameId)
        {
            try
            {
                // In einer echten Anwendung hier ggf. Spieler authentifizieren/autorisieren
                _logger.LogInformation("AdvancePhase aufgerufen für Spiel-ID: {GameId}", gameId);
                GameStateDto updatedGameState = _pokerGameService.AdvanceGamePhase(gameId);
                return Ok(updatedGameState);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("ArgumentException in AdvancePhase für Spiel {GameId}: {ErrorMessage}", gameId, ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unerwarteter Fehler in AdvancePhase für Spiel {GameId}", gameId);
                return StatusCode(500, new { message = "Ein unerwarteter Fehler ist beim Fortsetzen des Spiels aufgetreten." });
            }
        }

    }
}