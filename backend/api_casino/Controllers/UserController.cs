using Microsoft.AspNetCore.Mvc;
using CasinoApp.Models;
using CasinoApp.Services;

namespace CasinoApp.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await _userService.AuthenticateAsync(request.Email, request.Password);

            if (user == null)
                return Unauthorized(new { message = "E-Mail oder Passwort falsch" });

            return Ok(new
            {
                message = "Login erfolgreich",
                userId = user.UserId,
                email = user.Email,
                firstName = user.FirstName
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var (success, message) = await _userService.RegisterAsync(request);

            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }

    }
}
