using CasinoApp.Models;

namespace CasinoApp.Interfaces
{
	public interface IUserRepository
	{
		Task<User?> GetByEmailAsync(string email);
		Task<bool> ExistsAsync(string email);
		void Add(User user);
		Task<string?> GetPasswordHashByEmailAsync(string email);
		Task UpdatePasswordAsync(string email, string newPasswordHash);
	}
}
