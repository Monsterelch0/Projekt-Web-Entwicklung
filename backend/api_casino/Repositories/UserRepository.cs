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
        public async Task<User?> GetByIdAsync(int id) {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }
        public void Add(User user)
        {
            _context.Users.Add(user);
        }
        public async Task UpdateUser(User user) {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
