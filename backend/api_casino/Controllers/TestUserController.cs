using Microsoft.AspNetCore.Mvc;
using CasinoApp.Interfaces;
using CasinoApp.Models;

namespace CasinoApp.Controllers
{
    [ApiController]
    [Route("api/test-users")]
    public class TestUserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public TestUserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 1. Benutzer nach E-Mail holen
        [HttpGet("get/{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            return user is null ? NotFound("User not found") : Ok(user);
        }

        // 2. Benutzer existiert?
        [HttpGet("exists/{email}")]
        public async Task<IActionResult> UserExists(string email)
        {
            var exists = await _unitOfWork.Users.ExistsAsync(email);
            return Ok(new { email, exists });
        }

        // 3. Benutzer hinzufügen
        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            _unitOfWork.Users.Add(user);
            await _unitOfWork.CompleteAsync();
            return Ok("User added successfully");
        }

        // 4. Passwort-Hash holen
        [HttpGet("password/{email}")]
        public async Task<IActionResult> GetPasswordHash(string email)
        {
            var hash = await _unitOfWork.Users.GetPasswordHashByEmailAsync(email);
            return hash is null ? NotFound("User not found") : Ok(new { email, hash });
        }

        // 5. Passwort aktualisieren
        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            await _unitOfWork.Users.UpdatePasswordAsync(request.Email, request.NewPasswordHash);
            await _unitOfWork.CompleteAsync();
            return Ok("Password updated");
        }
    }

    // Hilfsklasse für Passwort-Update
    public class UpdatePasswordRequest
    {
        public string Email { get; set; } = null!;
        public string NewPasswordHash { get; set; } = null!;
    }
}
