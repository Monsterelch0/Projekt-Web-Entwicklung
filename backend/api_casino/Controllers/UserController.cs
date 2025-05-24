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

        /**
         * This route is intended to return the authenticated user's profile, but since authentication
         * is not implemented yet we require passing the user ID to fetch as query parameter for now.
         */
        [HttpGet("me")]
        public async Task<ActionResult<PublicUser>> GetSelf([FromQuery] String id) {
            try {
                var user = await _userService.GetUserByIdAsync(Convert.ToInt32(id));
                if (user == null) return NotFound(new { message = "User not found" });
                return Ok(new PublicUser(user));
            } catch(FormatException) {
                return BadRequest(new { message = "Non-numeric ID provided" });
            } catch(OverflowException) {
                return BadRequest(new { message = "Invalid ID" });
            }
        }
    }
}
