using Microsoft.EntityFrameworkCore;
using CasinoApp.Data;
using CasinoApp.Interfaces;
using CasinoApp.Models;

namespace CasinoApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public void Add(User user)
        {
            _context.Users.Add(user);
        }
    }
}
