using CasinoApp.Interfaces;
using CasinoApp.Models;

namespace CasinoApp.Services
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null) return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return isValid ? user : null;
        }
        public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequestDto request)
        {
            var existingUser = await _unitOfWork.Users.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return (false, "Diese E-Mail wird bereits verwendet.");
            }

            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Balance = 0,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _unitOfWork.Users.Add(newUser);
            await _unitOfWork.CompleteAsync();

            return (true, "Registrierung erfolgreich.");
        }

    }
}
