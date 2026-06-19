using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs;
using EmpCheckInOut.Api.DTOs.Auth;
using EmpCheckInOut.Api.Exceptions;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly MongoDbContext _db;

        public AuthService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<User> LoginAsync(LoginRequestDto dto)
        {
            var user = await _db.Users
                .Find(u => u.Email == dto.Email.ToLower().Trim())
                .FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new AuthenticationException("Invalid email or password.");

            return user;
        }

        public async Task<User> RegisterAsync(RegistrationRequestDto dto)
        {
            var existing = await _db.Users
                .Find(u => u.Email == dto.Email.ToLower().Trim())
                .AnyAsync();

            if (existing)
                throw new ConflictException("Email already registered.");

            var user = AuthMapper.MapToUser(dto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _db.Users.InsertOneAsync(user);
            return user;
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var user = await _db.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user is null)
                throw new AuthenticationException("Session invalid. User no longer exists.");

            return user;
        }
    }
}